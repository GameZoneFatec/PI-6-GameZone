import 'dotenv/config';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { slugify } from '../core/Entities/game-entity';
import { CATALOG_MEDIA_DIR } from '../infra/config/media-config';
import { CATALOG_FILE, CatalogGame, loadCatalog } from './lib/game-catalog';
import { prisma } from '../infra/Repositories/prisma/client';

/**
 * IMPORTAÇÃO ÚNICA do catálogo a partir da loja pública da Steam (sem chave de API).
 *
 *   npm run games:import
 *
 * Gera backend/prisma/data/games.json + as imagens em backend/media/games/<slug>/ e
 * carrega tudo no banco. Depois disso o sistema NÃO depende mais da Steam: o catálogo
 * vive no nosso banco, é servido pela nossa API e mantido pelo backoffice.
 * Para recarregar o banco a partir do arquivo (sem internet): npm run games:load
 */
const STEAM_APPS: number[] = [
    271590, // Grand Theft Auto V
    292030, // The Witcher 3
    1174180, // Red Dead Redemption 2
    1091500, // Cyberpunk 2077
    1245620, // Elden Ring
    1086940, // Baldur's Gate 3
    1593500, // God of War
    1817070, // Marvel's Spider-Man Remastered
    2050650, // Resident Evil 4
    990080, // Hogwarts Legacy
    1888930, // The Last of Us Part I
    814380, // Sekiro
    374320, // Dark Souls III
    367520, // Hollow Knight
    413150, // Stardew Valley
    105600, // Terraria
    1145360, // Hades
    504230, // Celeste
    588650, // Dead Cells
    646570, // Slay the Spire
    268910, // Cuphead
    1794680, // Vampire Survivors
    620, // Portal 2
    264710, // Subnautica
    892970, // Valheim
    427520, // Factorio
    289070, // Civilization VI
    553850, // Helldivers 2
    1172470, // Apex Legends
    730, // Counter-Strike 2
    570, // Dota 2
    381210, // Dead by Daylight
    739630, // Phasmophobia
    945360, // Among Us
    252490, // Rust
    1716740, // Starfield
];

const MONTHS: Record<string, number> = { jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6, jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12 };
const PLATFORM_NAMES: Record<string, string> = { windows: 'PC', mac: 'macOS', linux: 'Linux' };
const SKIP_GENRES = ['acesso antecipado', 'early access'];
// Nomes mais limpos para alguns jogos (a loja usa o nome da edição)
const NAME_OVERRIDES: Record<number, string> = {
    271590: 'Grand Theft Auto V',
    292030: 'The Witcher 3: Wild Hunt',
    814380: 'Sekiro: Shadows Die Twice',
};

function parseDate(text: string | undefined): string | null {
    const m = text && /(\d{1,2})\D+([a-zç]{3})\D+(\d{4})/i.exec(text);
    if (!m) return null;
    const month = MONTHS[m[2]!.toLowerCase()];
    return month ? `${m[3]}-${String(month).padStart(2, '0')}-${m[1]!.padStart(2, '0')}` : null;
}

function htmlToText(html: string | undefined): string | null {
    if (!html) return null;
    const text = html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|h\d|li|ul)>/gi, '\n')
        .replace(/<li>/gi, '• ')
        .replace(/<[^>]+>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s*\n\s*/g, '\n\n')
        .trim();
    if (!text) return null;
    return text.length > 4000 ? `${text.slice(0, 3990).trimEnd()}…` : text;
}

async function download(url: string, dest: string) {
    if (existsSync(dest)) return; // já baixada
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function importApp(appid: number): Promise<CatalogGame | null> {
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&l=brazilian&cc=br`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body: any = await res.json();
    const d = body?.[appid]?.success ? body[appid].data : null;
    if (!d) return null;

    const name = NAME_OVERRIDES[appid] ?? String(d.name).replace(/[™®]/g, '').trim();
    const slug = slugify(name);
    const dir = join(CATALOG_MEDIA_DIR, 'games', slug);
    await mkdir(dir, { recursive: true });

    await download(d.header_image, join(dir, 'header.jpg'));
    const shots: string[] = [];
    for (const [i, s] of (d.screenshots ?? []).slice(0, 4).entries()) {
        const file = `ss${i + 1}.jpg`;
        await download(s.path_thumbnail, join(dir, file)); // 600x338: leve para web e celular
        shots.push(`games/${slug}/${file}`);
    }

    return {
        steam_appid: appid,
        name,
        slug,
        short_description: htmlToText(d.short_description),
        // alguns jogos montam a descrição só com imagens; aí usamos o texto detalhado ou o resumo
        description: htmlToText(d.about_the_game) || htmlToText(d.detailed_description) || htmlToText(d.short_description),
        released: parseDate(d.release_date?.date),
        metacritic: d.metacritic?.score ?? null,
        developers: d.developers ?? [],
        publishers: d.publishers ?? [],
        genres: (d.genres ?? []).map((g: any) => String(g.description)).filter((g: string) => !SKIP_GENRES.includes(g.toLowerCase())),
        platforms: Object.entries(d.platforms ?? {})
            .filter(([, v]) => v)
            .map(([k]) => PLATFORM_NAMES[k] ?? k),
        website: d.website || null,
        cover_image: `games/${slug}/header.jpg`,
        screenshots: shots,
    };
}

async function main() {
    const games: CatalogGame[] = [];
    for (const appid of STEAM_APPS) {
        try {
            const g = await importApp(appid);
            if (g) {
                games.push(g);
                console.log(`✓ ${g.name} (${g.genres.join(', ')})`);
            } else console.warn(`✗ ${appid}: não disponível na loja brasileira`);
        } catch (err: any) {
            console.warn(`✗ ${appid}: ${err.message}`);
        }
        await sleep(400); // respeita o limite de requisições da loja
    }
    await mkdir(join(CATALOG_FILE, '..'), { recursive: true });
    await writeFile(CATALOG_FILE, JSON.stringify(games, null, 2) + '\n');
    console.log(`\n${games.length} jogos salvos em prisma/data/games.json e media/games/`);

    const out = await loadCatalog(prisma);
    console.log(`Banco: ${out.created} criados, ${out.updated} atualizados`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());

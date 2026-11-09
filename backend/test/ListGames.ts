import { any, map } from 'zod';
import { id } from 'zod/locales';

const API_KEY = '5e603e9140c64ab38e6f3af8dac1f767';
const search = 'The Witcher';
const page = 1;
const pageSize = 2; //----1

// const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${search}&page=${page}&page_size=${pageSize}`;
// const url = `https://api.rawg.io/api/genres?key=${API_KEY}`;
// const url = `https://api.rawg.io/api/games/3328/achievements?key=${API_KEY}`;
// const url = `https://api.rawg.io/api/games/3328/movies?key=${API_KEY}`;
// const url = `https://api.rawg.io/api/games/3328/additions?key=${API_KEY}`;
// const url = `https://api.rawg.io/api/games/3328/screenshots?key=${API_KEY}`; // - 2

async function getGamesId() {
    const urlDetails = `https://api.rawg.io/api/games/3498?key=${API_KEY}`;
    const urlScreen = `https://api.rawg.io/api/games/3498/screenshots?key=${API_KEY}`;
    const trailer = `https://api.rawg.io/api/games/3498/movies?key=${API_KEY}`;

    const [detailRes, shotsRes, traiRes] = await Promise.all([fetch(urlDetails), fetch(urlScreen), fetch(trailer)]);
    if (!detailRes.ok) throw new Error(`Erro, ${detailRes.status}`);
    if (!shotsRes.ok) throw new Error(`Erro, ${shotsRes.status}`);
    if (!traiRes.ok) throw new Error(`Erro, ${traiRes.status}`);
    const data = await detailRes.json();
    const screens = await shotsRes.json();
    const trailers = await traiRes.json();

    // const {
    //     id,
    //     slug,
    //     name,
    //     name_original,
    //     description,
    //     metacritic,
    //     released,
    //     background_image_additional,
    //     website,
    //     metacritic_url,
    //     platforms,
    //     developers,
    //     genres,
    //     publishers,
    //     description_raw,
    //     background_imag,
    // } = data;

    // const games = {
    //     id,
    //     slug,
    //     name,
    //     name_original,
    //     description,
    //     metacritic,
    //     released,
    //     background_imag,
    //     background_image_additional,
    //     website,
    //     metacritic_url,
    //     platforms,
    //     developers,
    //     genres,
    //     publishers,
    //     description_raw,
    //     screen_shots: screens.results,
    // };

    return trailers;
}

async function getAll() {
    let url = `https://api.rawg.io/api/games?key=${API_KEY}&page=1&page_size=1&search=The Witcher 3`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Errr, status: ${response.status}`);
    const data = await response.json();

    console.log(JSON.stringify(data, null, 2));
}

// (async () => {
//     const games = await getGamesId();
//     console.log(JSON.stringify(games, null, 2));
// })().catch(console.error);
enum en {
    FINISHED = 'FINISHED',
    DRAFT = 'DRAFT',
}

function validateData(body: string, title: string, id: number | null, en: string) {
    const texts: string[] = [];
    if (body.length == 0) texts.push('Body não pode estar vazio');
    if (title.length == 0) texts.push('Título não pode estar vazio');
    if (id == null || undefined) texts.push('Rating não foi passado');
    if (!['FINISHED', 'DRAFT'].includes(en)) texts.push('Parâmetro passado para status não é valido');

    const details = texts.map((f: any) => ({ f }));
    console.log(details);
}

validateData('ff', '', null, 'ff');

// -----------------------------------------------

export interface RawgGenres {
    id: number;
    name: string;
    slug: string;
    image_background: string;
}

export interface RawgPlatform {
    id: number;
    name: string;
    slug: string;
}

export interface RawgGenre {
    id: number;
    name: string;
    slug: string;
}

export interface RawgGame {
    rawgId: number;
    name: string;
    slug: string;
    released: string | null;
    background_image: string | null;
    metacritic: number | null;
    platforms: RawgPlatform[];
    genres: RawgGenre[];
    developers?: { id: number; name: string }[];
    publishers?: { id: number; name: string }[];
}

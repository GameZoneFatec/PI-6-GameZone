import { useState, type ChangeEvent, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import handleAxiosErrors from '@utils/axiosErrorStandard';
import { gameAdminService } from '@services/gameAdmin.service';
import type { IAdminGame, IFieldError, IGameInput } from '@interfaces/game-admin.interface';
import {
  Backdrop,
  CancelButton,
  CloseButton,
  ErrorText,
  FieldGroup,
  FieldLabel,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  SaveButton,
  TextArea,
  TextInput
} from '@components/Modal/reviewModal/reviewModal.style';
import { CoverPreview, FormCard, FormGrid, FormScroll } from './styles.adminGames';

type Props = {
  game: IAdminGame | null; // null = novo jogo
  onClose: () => void;
  onSaved: (game: IAdminGame) => void;
};

const MAX_COVER = 2 * 1024 * 1024;
const join = (list: string[] | undefined) => (list ?? []).join(', ');
const split = (text: string) =>
  text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function GameFormModal({ game, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    name: game?.name ?? '',
    short_description: game?.short_description ?? '',
    description: game?.description ?? '',
    released: game?.released?.slice(0, 10) ?? '',
    metacritic: game?.metacritic?.toString() ?? '',
    genres: join(game?.genres),
    platforms: join(game?.platforms),
    developers: join(game?.developers),
    publishers: join(game?.publishers),
    website: game?.website ?? ''
  });
  const [cover, setCover] = useState<string | null | undefined>(undefined); // undefined = não mexer
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function pickCover(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return setErrors((x) => ({ ...x, cover_image_base64: 'Use JPG, PNG ou WEBP' }));
    if (file.size > MAX_COVER) return setErrors((x) => ({ ...x, cover_image_base64: 'Imagem de até 2 MB' }));
    setErrors((x) => ({ ...x, cover_image_base64: '' }));
    setCover(await readAsDataUrl(file));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setErrors({ name: 'Informe o nome do jogo' });
    const input: IGameInput = {
      name: form.name.trim(),
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      released: form.released || null,
      metacritic: form.metacritic === '' ? null : Number(form.metacritic),
      genres: split(form.genres),
      platforms: split(form.platforms),
      developers: split(form.developers),
      publishers: split(form.publishers),
      website: form.website.trim() || null
    };
    if (cover !== undefined) input.cover_image_base64 = cover;

    setSaving(true);
    setErrors({});
    try {
      const saved = game ? await gameAdminService.update(game.id, input) : await gameAdminService.create(input);
      toast.success(game ? `"${saved.name}" atualizado` : `"${saved.name}" adicionado ao catálogo`);
      onSaved(saved as IAdminGame);
    } catch (error) {
      const details = (error as AxiosError<{ details?: IFieldError[] }>).response?.data?.details;
      if (Array.isArray(details)) setErrors(Object.fromEntries(details.map((d) => [d.field, d.message])));
      handleAxiosErrors(error);
    } finally {
      setSaving(false);
    }
  }

  const previewSrc = cover === undefined ? game?.cover_url : cover;

  return createPortal(
    <Backdrop onClick={onClose}>
      <FormCard as='form' onSubmit={submit} onClick={(e) => e.stopPropagation()} role='dialog' aria-modal='true' aria-labelledby='game-form-title'>
        <ModalHeader>
          <ModalTitle id='game-form-title'>{game ? `Editar: ${game.name}` : 'Novo jogo'}</ModalTitle>
          <CloseButton type='button' onClick={onClose} aria-label='Fechar'>
            ✕
          </CloseButton>
        </ModalHeader>

        <FormScroll>
          <FormGrid>
            <FieldGroup style={{ gridColumn: '1 / -1' }}>
              <FieldLabel htmlFor='g-name'>Nome *</FieldLabel>
              <TextInput id='g-name' maxLength={120} value={form.name} onChange={set('name')} autoFocus />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
            </FieldGroup>

            <FieldGroup style={{ gridColumn: '1 / -1' }}>
              <FieldLabel htmlFor='g-short'>Resumo</FieldLabel>
              <TextArea id='g-short' rows={2} maxLength={400} value={form.short_description} onChange={set('short_description')} />
            </FieldGroup>

            <FieldGroup style={{ gridColumn: '1 / -1' }}>
              <FieldLabel htmlFor='g-desc'>Descrição completa</FieldLabel>
              <TextArea id='g-desc' rows={4} maxLength={8000} value={form.description} onChange={set('description')} />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor='g-released'>Lançamento</FieldLabel>
              <TextInput id='g-released' type='date' value={form.released} onChange={set('released')} />
              {errors.released && <ErrorText>{errors.released}</ErrorText>}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor='g-meta'>Nota Metacritic (0–100)</FieldLabel>
              <TextInput id='g-meta' type='number' min={0} max={100} value={form.metacritic} onChange={set('metacritic')} />
              {errors.metacritic && <ErrorText>{errors.metacritic}</ErrorText>}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor='g-genres'>Gêneros (separados por vírgula)</FieldLabel>
              <TextInput id='g-genres' placeholder='Ação, RPG' value={form.genres} onChange={set('genres')} />
              {errors.genres && <ErrorText>{errors.genres}</ErrorText>}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor='g-platforms'>Plataformas</FieldLabel>
              <TextInput id='g-platforms' placeholder='PC, Android' value={form.platforms} onChange={set('platforms')} />
              {errors.platforms && <ErrorText>{errors.platforms}</ErrorText>}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor='g-dev'>Desenvolvedora</FieldLabel>
              <TextInput id='g-dev' value={form.developers} onChange={set('developers')} />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor='g-pub'>Publicadora</FieldLabel>
              <TextInput id='g-pub' value={form.publishers} onChange={set('publishers')} />
            </FieldGroup>

            <FieldGroup style={{ gridColumn: '1 / -1' }}>
              <FieldLabel htmlFor='g-site'>Site oficial</FieldLabel>
              <TextInput id='g-site' type='url' placeholder='https://' value={form.website} onChange={set('website')} />
              {errors.website && <ErrorText>{errors.website}</ErrorText>}
            </FieldGroup>

            <FieldGroup style={{ gridColumn: '1 / -1' }}>
              <FieldLabel htmlFor='g-cover'>Capa (JPG, PNG ou WEBP, até 2 MB)</FieldLabel>
              <CoverPreview>
                {previewSrc ? <img src={previewSrc} alt='Capa do jogo' /> : <span>Sem capa</span>}
                <div>
                  <input id='g-cover' type='file' accept='image/jpeg,image/png,image/webp' onChange={pickCover} />
                  {previewSrc && (
                    <button type='button' onClick={() => setCover(null)}>
                      Remover capa
                    </button>
                  )}
                </div>
              </CoverPreview>
              {errors.cover_image_base64 && <ErrorText>{errors.cover_image_base64}</ErrorText>}
            </FieldGroup>
          </FormGrid>
        </FormScroll>

        <ModalFooter>
          <CancelButton type='button' onClick={onClose}>
            Cancelar
          </CancelButton>
          <SaveButton type='submit' disabled={saving}>
            {saving ? 'Salvando…' : game ? 'Salvar alterações' : 'Adicionar ao catálogo'}
          </SaveButton>
        </ModalFooter>
      </FormCard>
    </Backdrop>,
    document.body
  );
}

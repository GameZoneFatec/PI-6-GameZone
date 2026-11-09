import { useState, useEffect } from 'react';
import {
  Backdrop,
  ModalCard,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FieldGroup,
  FieldLabel,
  TextInput,
  TextArea,
  StarsRow,
  StarButton,
  RadioGroup,
  RadioOption,
  Select,
  ModalFooter,
  SaveButton,
  CancelButton,
  DeleteButton,
  ErrorText
} from './reviewModal.style';

const MAX_STARS = 5 as const;

export type ReviewStatus = 'DRAFT' | 'PUBLISHED';

export type responseReview = {
  title: string;
  body: string;
  rating: number;
  isPublic: boolean;
  status: ReviewStatus;
};

type ReviewModalProps = {
  open: boolean;
  onClose: () => void;
  onSave?: (values: responseReview) => void;
  initialValues?: Partial<responseReview> | null;
  canEdit?: boolean;
  showDeleteButton?: boolean;
  onDelete?: (erase: boolean) => void;
};

type Errors = {
  title?: string;
  body?: string;
  rating?: string;
};

export function ReviewModal({
  open,
  onClose,
  onSave,
  initialValues,
  canEdit = true,
  showDeleteButton = false,
  onDelete
}: ReviewModalProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [body, setBody] = useState(initialValues?.body ?? '');
  const [rating, setRating] = useState(initialValues?.rating ?? 0);
  const [isPublic, setIsPublic] = useState(initialValues?.isPublic ?? true);
  const [status, setStatus] = useState<ReviewStatus>(initialValues?.status ?? 'DRAFT');
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) return;

    setTitle(initialValues?.title ?? '');
    setBody(initialValues?.body ?? '');
    setRating(initialValues?.rating ?? 0);
    setIsPublic(initialValues?.isPublic ?? true);
    setStatus(initialValues?.status ?? 'DRAFT');
    setErrors({});
  }, [open, initialValues]);

  if (!open) return null;

  const isStatusLocked = initialValues?.status === 'PUBLISHED';
  const isReadOnly = !canEdit;
  const labelStatus = status === 'PUBLISHED' ? 'Publicar' : 'Salvar';

  function validate(): boolean {
    const newErrors: Errors = {};

    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório.';
    }

    if (!body.trim()) {
      newErrors.body = 'Opinião é obrigatória.';
    }

    if (isPublic && status === 'PUBLISHED' && rating <= 0) {
      newErrors.rating = 'Dê uma nota para reviews públicas publicadas.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (isReadOnly) return;
    if (!validate()) return;

    onSave?.({
      title: title.trim(),
      body: body.trim(),
      rating,
      isPublic,
      status
    });

    onClose();
  }

  function handleClear() {
    if (isReadOnly) return;

    setTitle('');
    setBody('');
    setRating(0);
    setIsPublic(true);
    setStatus('DRAFT');
    setErrors({});
  }

  function handleDeleteClick() {
    const confirmed = window.confirm('Tem certeza que deseja excluir sua review?');

    onDelete?.(confirmed);

    if (confirmed) {
      onClose();
    }
  }

  return (
    <Backdrop onClick={onClose}>
      <ModalCard onClick={(event) => event.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Escreva a sua review</ModalTitle>

          <CloseButton type='button' onClick={onClose}>
            ✕
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Nota */}
          <FieldGroup>
            <FieldLabel>Nota</FieldLabel>

            <StarsRow>
              {Array.from({ length: MAX_STARS }).map((_, index) => {
                const starValue = index + 1;
                const active = starValue <= rating;

                return (
                  <StarButton
                    key={starValue}
                    type='button'
                    aria-label={`Nota ${starValue}`}
                    data-active={active}
                    disabled={isReadOnly}
                    onClick={() => {
                      if (isReadOnly) return;
                      setRating(starValue);
                    }}
                  >
                    ★
                  </StarButton>
                );
              })}
            </StarsRow>

            {errors.rating && <ErrorText>{errors.rating}</ErrorText>}
          </FieldGroup>

          {/* Título */}
          <FieldGroup>
            <FieldLabel>Título</FieldLabel>
            <TextInput
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder='Dê um título para sua avaliação'
              disabled={isReadOnly}
            />
            {errors.title && <ErrorText>{errors.title}</ErrorText>}
          </FieldGroup>

          {/* Corpo / Opinião */}
          <FieldGroup>
            <FieldLabel>Opinião</FieldLabel>
            <TextArea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder='O que achou do jogo?'
              rows={5}
              disabled={isReadOnly}
            />
            {errors.body && <ErrorText>{errors.body}</ErrorText>}
          </FieldGroup>

          {/* Público / privado */}
          <FieldGroup>
            <FieldLabel>Visibilidade</FieldLabel>

            <RadioGroup>
              <RadioOption>
                <input
                  type='radio'
                  name='visibility'
                  value='public'
                  checked={isPublic === true}
                  onChange={() => setIsPublic(true)}
                  disabled={isReadOnly}
                />
                <span>Público</span>
              </RadioOption>

              <RadioOption>
                <input
                  type='radio'
                  name='visibility'
                  value='private'
                  checked={isPublic === false}
                  onChange={() => setIsPublic(false)}
                  disabled={isReadOnly}
                />
                <span>Privado</span>
              </RadioOption>
            </RadioGroup>
          </FieldGroup>

          {/* Status */}
          <FieldGroup>
            <FieldLabel>Status</FieldLabel>

            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value as ReviewStatus)}
              disabled={isStatusLocked || isReadOnly}
            >
              <option value='DRAFT'>Rascunho</option>
              <option value='PUBLISHED'>Publicado</option>
            </Select>
          </FieldGroup>
        </ModalBody>

        <ModalFooter>
          {/* deletar (visível via prop + só se puder editar) */}
          {!isReadOnly && showDeleteButton && (
            <DeleteButton type='button' onClick={handleDeleteClick}>
              Deletar review
            </DeleteButton>
          )}

          {!isReadOnly && (
            <CancelButton type='button' onClick={handleClear}>
              Limpar campos
            </CancelButton>
          )}

          <CancelButton type='button' onClick={onClose}>
            Fechar
          </CancelButton>

          {!isReadOnly && (
            <SaveButton type='button' onClick={handleSave}>
              {labelStatus}
            </SaveButton>
          )}
        </ModalFooter>
      </ModalCard>
    </Backdrop>
  );
}

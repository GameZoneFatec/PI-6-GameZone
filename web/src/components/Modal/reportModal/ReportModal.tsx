import { useState } from 'react';
import { toast } from 'react-toastify';
import handleAxiosErrors from '@utils/axiosErrorStandard';
import { moderationService } from '@services/moderation.service';
import { REASON_LABEL, type ReportReason } from '@interfaces/moderation.interface';
import {
  Backdrop,
  CancelButton,
  CloseButton,
  ErrorText,
  FieldGroup,
  FieldLabel,
  ModalBody,
  ModalCard,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  RadioGroup,
  RadioOption,
  SaveButton,
  TextArea
} from '../reviewModal/reviewModal.style';

type Props = {
  reviewId: string;
  reviewTitle: string;
  onClose: () => void;
};

const REASONS = Object.keys(REASON_LABEL) as ReportReason[];

export function ReportModal({ reviewId, reviewTitle, onClose }: Props) {
  const [reason, setReason] = useState<ReportReason>('OFFENSIVE');
  const [details, setDetails] = useState('');
  const [sending, setSending] = useState(false);
  const needsDetails = reason === 'OTHER' && !details.trim();

  async function submit() {
    if (needsDetails) return;
    setSending(true);
    try {
      const out = await moderationService.report(reviewId, reason, details);
      if (out.queued) toast.success('Denúncia enviada. Obrigado por ajudar a manter a comunidade segura!');
      else toast.info(out.message);
      onClose();
    } catch (error) {
      handleAxiosErrors(error);
    } finally {
      setSending(false);
    }
  }

  return (
    <Backdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()} role='dialog' aria-modal='true' aria-labelledby='report-title'>
        <ModalHeader>
          <ModalTitle id='report-title'>Denunciar análise</ModalTitle>
          <CloseButton onClick={onClose} aria-label='Fechar'>
            ✕
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <p style={{ color: '#B7B7CC', fontSize: 14 }}>
            “{reviewTitle}” será analisada pela moderação. Análises com várias denúncias ficam ocultas até a decisão de um administrador.
          </p>

          <FieldGroup>
            <FieldLabel>Motivo</FieldLabel>
            <RadioGroup>
              {REASONS.map((r) => (
                <RadioOption key={r}>
                  <input type='radio' name='reason' value={r} checked={reason === r} onChange={() => setReason(r)} />
                  {REASON_LABEL[r]}
                </RadioOption>
              ))}
            </RadioGroup>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor='report-details'>Detalhes {reason === 'OTHER' ? '(obrigatório)' : '(opcional)'}</FieldLabel>
            <TextArea
              id='report-details'
              maxLength={500}
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder='Conte o que há de errado com esta análise'
            />
            {needsDetails && <ErrorText>Descreva o motivo quando escolher “Outro”.</ErrorText>}
          </FieldGroup>
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <SaveButton onClick={submit} disabled={sending || needsDetails}>
            {sending ? 'Enviando...' : 'Enviar denúncia'}
          </SaveButton>
        </ModalFooter>
      </ModalCard>
    </Backdrop>
  );
}

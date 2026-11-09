import { useEffect } from 'react';
import { FaGamepad } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import {
  Overlay,
  ModalContent,
  Header,
  IconWrapper,
  Title,
  CloseButton,
  Divider,
  TextArea,
  Footer,
  SaveButton
} from './gameNoteModal.style';

interface GameNoteModalProps {
  open: boolean;
  body: string;
  onChangeBody: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function GameNoteModal({ open, body, onChangeBody, onSave, onClose }: GameNoteModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <IconWrapper>
            <FaGamepad size={20} />
          </IconWrapper>

          <Title>Anotação do jogo</Title>

          <CloseButton type='button' onClick={onClose}>
            <IoClose size={18} />
          </CloseButton>
        </Header>

        <Divider />

        <TextArea
          value={body}
          onChange={(e) => onChangeBody(e.target.value)}
          placeholder='Escreva aqui sua anotação...'
        />

        <Footer>
          <SaveButton type='button' onClick={onSave}>
            Salvar
          </SaveButton>
        </Footer>
      </ModalContent>
    </Overlay>
  );
}

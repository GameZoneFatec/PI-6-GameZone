import type { TextareaHTMLAttributes } from 'react';
import { TextAreaComponent, TextAreaContainer } from './textArea.style';
import type { FieldError } from 'react-hook-form';

interface ITextArea extends TextareaHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
}

const TextArea = ({ label, error }: ITextArea) => {
  return (
    <TextAreaContainer>
      {label ? <label className='text-input-label'>{label}</label> : null}
      <TextAreaComponent className={error ? 'textAreaErrorStyle' : ''} />
      {error ? <p className='textAreaErrorMessage'>{error.message}</p> : <p></p>}
    </TextAreaContainer>
  );
};

export default TextArea;

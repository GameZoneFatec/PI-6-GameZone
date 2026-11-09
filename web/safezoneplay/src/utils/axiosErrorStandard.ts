import type { IErrorResponse } from '@interfaces/providerProps.interface';
import type { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const handleAxiosErrors = (error: unknown) => {
  const axiosError = error as AxiosError<IErrorResponse>;
  if (axiosError.response) {
    toast.error(axiosError.response.data.message);
    console.error('Erro da API:', axiosError.response.data);
  } else if (axiosError.request) {
    toast.error('Servidor não respondeu. Tente novamente.');
    console.error('Erro de rede:', axiosError.request);
  } else {
    toast.error('Erro inesperado.');
    console.error('Erro desconhecido:', axiosError.message);
  }
  console.log(error);
};

export default handleAxiosErrors;

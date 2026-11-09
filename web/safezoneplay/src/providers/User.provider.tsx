import { UserContext } from '@contexts/User.context';
import type { IDefaultProviderProp } from '@interfaces/providerProps.interface';
import { type ICreateUser } from '@interfaces/users.interface';
import { api } from '@services/api';
import handleAxiosErrors from '@utils/axiosErrorStandard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserProvider = ({ children }: IDefaultProviderProp) => {
  const navigate = useNavigate();
  const createUser = async (data: ICreateUser) => {
    try {
      const formData = new FormData();

      formData.append('email', data.email);
      formData.append('name', data.name);
      formData.append('username', data.username);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);

      if (data.profile_image_url instanceof File) {
        formData.append('profile_image_url', data.profile_image_url);
      }

      await api.post('/users', formData);

      toast.success('Usuário criado!');
      navigate('/start/login');
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  return <UserContext.Provider value={{ createUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;

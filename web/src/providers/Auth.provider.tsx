/* eslint-disable react-hooks/exhaustive-deps */
import { AuthContext } from '@contexts/Auth.context';
import type { IDefaultProviderProp } from '@interfaces/providerProps.interface';
import type { IJWTToken, ILoginRequest } from '@interfaces/login.interface';
import { api } from '@services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { IGetUserDataResponse } from '@interfaces/users.interface';
import handleAxiosErrors from '@utils/axiosErrorStandard';

const TOKEN_KEY = '@SafeZoneToken';

const AuthProvider = ({ children }: IDefaultProviderProp) => {
  const navigate = useNavigate();
  const [userData, setUserdata] = useState<IGetUserDataResponse | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const setAuthHeader = (token: string | null) => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  };

  const signIn = async (loginForm: ILoginRequest) => {
    try {
      const { data }: AxiosResponse = await api.post('/login', loginForm);
      localStorage.setItem(TOKEN_KEY, data.token);

      setAuthHeader(data.token);

      const decoded = jwtDecode<IJWTToken>(data.token);
      await userLogged(decoded.id);

      const user = await userLogged(decoded.id);

      toast.success('Seja bem vindo!');
      console.log(user);

      if (user.email_verified === false) {
        navigate('/verify-email');
        return;
      } else {
        navigate('/home');
      }
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  const userLogged = async (id: string) => {
    try {
      const userDataRespose = await api.get(`/users/${id}`);
      setUserdata(userDataRespose.data);
      return userDataRespose.data;
    } catch (error) {
      handleAxiosErrors(error);
    } finally {
      setUserLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthHeader(null);
    setUserdata(null);

    toast.success('Logout realizado com sucesso!');
    navigate('/start/login');
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUserLoading(false);
      return;
    }

    setAuthHeader(token);

    try {
      const decoded = jwtDecode<IJWTToken>(token);
      userLogged(decoded.id);
    } catch {
      handleLogout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, userData, setUserdata, userLoading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

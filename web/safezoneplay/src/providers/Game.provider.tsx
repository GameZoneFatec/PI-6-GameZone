import { GameContext } from '@contexts/Game.context';
import type {
  IGameByIDResponse,
  IGamesListResponse,
  ITotalStatusUserResponse,
  IUserGamesResponse,
  TGameStatus
} from '@interfaces/game.interface';
import type { IDefaultProviderProp } from '@interfaces/providerProps.interface';
import { api } from '@services/api';
import handleAxiosErrors from '@utils/axiosErrorStandard';
import type { AxiosResponse } from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const GameProvider = ({ children }: IDefaultProviderProp) => {
  const [gameLoading, setGameLoading] = useState(false);
  const [popularGames, setPopularGames] = useState<IGamesListResponse>([]);
  const [userGames, setUserGames] = useState<IUserGamesResponse>({} as IUserGamesResponse);

  const [gameSearchValue, setGameSearchValue] = useState('');
  const [searchGamesResult, setSearchGamesResult] = useState<IGamesListResponse>([]);
  const [gameByID, setGameByID] = useState<IGameByIDResponse>({} as IGameByIDResponse);
  const [totalGameStatusUser, setTotalGameStatusUser] = useState<ITotalStatusUserResponse[]>([]);

  const getPopularGames = async () => {
    setGameLoading(true);
    try {
      const popularGamesResponse = await api.get('/games');
      setPopularGames(popularGamesResponse.data);
    } catch (error) {
      handleAxiosErrors(error);
    } finally {
      setGameLoading(false);
    }
  };

  const handleSearchGames = async (searchValues: string, page: number) => {
    if (page === 1) {
      setGameLoading(true);
    } else {
      setGameLoading(false);
    }

    try {
      const searchResponse = await api.get(`/games?search=${searchValues}&pageSize=${7}&page=${page}`);

      setSearchGamesResult((prev) => (page === 1 ? searchResponse.data : [...prev, ...searchResponse.data]));
    } catch (error) {
      handleAxiosErrors(error);
    } finally {
      setGameLoading(false);
    }
  };

  const getGamesByID = async (gameID: number, userID: string) => {
    setGameLoading(true);
    try {
      const searchResponse = await api.get(`/games/id?gameId=${gameID}&userId=${userID}`);
      setGameByID(searchResponse.data);
      console.log(searchResponse);
    } catch (error) {
      handleAxiosErrors(error);
    } finally {
      setGameLoading(false);
    }
  };

  const getUserGames = async (userID: string, page: number, limitPerPage: number, status?: string, search?: string) => {
    setGameLoading(true);
    let url = `/profile/?userId=${userID}&page=${page}&limit=${limitPerPage}`;

    if (status) url += `&status=${status}`;
    if (search) url += `&search=${search}`;
    try {
      const userGameResponse: AxiosResponse<IUserGamesResponse> = await api.get(url);
      setUserGames(userGameResponse.data);
    } catch (error) {
      handleAxiosErrors(error);
    } finally {
      setGameLoading(false);
    }
  };

  const createGameStatus = async (status: string, userId: string, gameId: number) => {
    const data = {
      userId,
      status,
      gameId
    };

    try {
      const gameStatusRespose = await api.post(`/profile`, data);
      console.log(gameStatusRespose);
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  const getTotalStatusUser = async (userId: string) => {
    try {
      const status = await api.get(`/profile/total/status/user?userId=${userId}`);
      setTotalGameStatusUser(status.data);
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  const updateGameStatus = async (userGameID: string, status?: string, note?: string) => {
    console.log(status);
    try {
      await api.put(`/profile/update/${userGameID}`, { status: status, note: note });
      if (note) {
        toast.success('Anotação atualizada com sucesso!');
      }
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  const deleteGameStatus = async (userGameID: string) => {
    try {
      const gameStatusRespose = await api.delete(`/profile/delete/${userGameID}`);
      console.log(gameStatusRespose);
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  const handleGameStatus = async (
    actualStatus: TGameStatus,
    sentStatus: 'BACKLOG' | 'PLAYING' | 'FINISHED' | 'DROPPED',
    userId: string,
    userGameID: string | null,
    gameId: number
  ) => {
    if (actualStatus === null) {
      await createGameStatus(sentStatus, userId, gameId);
    } else if (actualStatus !== sentStatus) {
      await updateGameStatus(sentStatus, userGameID!);
    } else if (actualStatus === sentStatus) {
      await deleteGameStatus(userGameID!);
    }
    await getGamesByID(gameId, userId);
  };

  return (
    <GameContext.Provider
      value={{
        gameLoading,
        setGameLoading,
        getPopularGames,
        popularGames,
        handleSearchGames,
        gameSearchValue,
        setGameSearchValue,
        searchGamesResult,
        getGamesByID,
        gameByID,
        setGameByID,
        getUserGames,
        createGameStatus,
        updateGameStatus,
        deleteGameStatus,
        handleGameStatus,
        userGames,
        setUserGames,
        getTotalStatusUser,
        totalGameStatusUser
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;

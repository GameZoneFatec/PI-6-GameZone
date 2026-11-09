/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IGameByIDResponse, IGameContextProps, IUserGamesResponse, TGameStatus } from '@interfaces/game.interface';
import { createContext, type SetStateAction } from 'react';

export const GameContext = createContext<IGameContextProps>({
  getPopularGames: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },

  popularGames: [],

  gameLoading: false,

  setGameLoading: function (_value: SetStateAction<boolean>): void {
    throw new Error('Function not implemented.');
  },

  gameByID: {} as IGameByIDResponse,

  handleSearchGames: function (_searchValues: string, _page: number): Promise<void> {
    throw new Error('Function not implemented.');
  },

  gameSearchValue: '',

  searchGamesResult: [],

  getGamesByID: function (_gameID: number, _userID: string): Promise<void> {
    throw new Error('Function not implemented.');
  },

  setGameSearchValue: function (_value: SetStateAction<string>): void {
    throw new Error('Function not implemented.');
  },

  setGameByID: function (_value: SetStateAction<IGameByIDResponse>): void {
    throw new Error('Function not implemented.');
  },

  createGameStatus: function (_status: string, _userId: string, _gameId: number): Promise<void> {
    throw new Error('Function not implemented.');
  },

  updateGameStatus: function (_userGameID: string, _status?: string, _note?: string): Promise<void> {
    throw new Error('Function not implemented.');
  },

  deleteGameStatus: function (_userGameID: string): Promise<void> {
    throw new Error('Function not implemented.');
  },

  handleGameStatus: function (
    _actualStatus: TGameStatus,
    _sentStatus: 'BACKLOG' | 'PLAYING' | 'FINISHED' | 'DROPPED',
    _userId: string,
    _userGameID: string | null,
    _gameId: number
  ): Promise<void> {
    throw new Error('Function not implemented.');
  },

  getUserGames: function (
    _userID: string,
    _page: number,
    _limitPerPage: number,
    _status?: string,
    _search?: string
  ): Promise<void> {
    throw new Error('Function not implemented.');
  },

  getTotalStatusUser: function (_userId: string): Promise<void> {
    throw new Error('Function not implemented.');
  },

  totalGameStatusUser: [],

  setUserGames: function (_value: SetStateAction<IUserGamesResponse>): void {
    throw new Error('Function not implemented.');
  },

  userGames: {} as IUserGamesResponse
});

export interface Game {
  userGameId?: string;
  note?: string | null;
  idGame: number;
  name: string;
  slug: string;
  metacritic: number;
  released: string;
  background_image: string;
  platforms: Platform[];
  genres: Genre[];
}

export interface Platform {
  id: number;
  name: string;
  image_background: string;
  requirements: PlatformRequirements;
}

export interface PlatformRequirements {
  minimum: string | null;
  recommended: string | null;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  image_background: string;
}

export type IGameCardValues = Pick<Game, 'idGame' | 'background_image' | 'name' | 'released' | 'platforms'>;

export type IGamesListResponse = Game[];

export interface IGameByIDResponse {
  userGame: {
    userGameId: string | null;
    status: string | null;
  };
  game: {
    idGame: number;
    slug: string;
    name: string;
    name_original: string;
    description: string;
    description2: string;
    metacritic: number;
    released: string;
    background_image: string;
    background_image_additional: string;
    playtime: number;
    reddit_url: string;
    website: string;
    metacritic_url: string;

    paltforms: {
      id: number;
      name: string;
      image_background: string;
      released_at: string;
      requirements: {
        minimum?: string;
        recommended?: string;
        [key: string]: unknown;
      };
    }[];

    genres: {
      id: number;
      name: string;
      slug: string;
      image_background: string;
    }[];

    publishers: {
      id: number;
      name: string;
      slug: string;
      image_background: string;
    }[];

    developers: {
      id: number;
      name: string;
      slug: string;
      image_background: string;
    }[];

    screen_shots: {
      id: number;
      image: string;
      height: number;
      width: number;
    }[];

    trailers: {
      id?: number;
      name?: string;
      preview?: string;
      data?: {
        480?: string;
        max?: string;
      };
    }[];
  };
}

// export interface IUserGamesResponse {
//   data: {
//     id: string;
//     userId: string;
//     gameId: number;
//     status: 'BACKLOG' | 'PLAYING' | 'FINISHED' | 'DROPPED'; // ajuste se necessário
//     note: string | null;
//     created_at: string;
//     updated_at: string;
//     game: {
//       idGame: number;
//       name: string;
//       slug: string;
//       description: string;
//       metacritic: number;
//       released: string;
//       background_image: string;
//       website: string;
//       platforms: {
//         id: number;
//         name: string;
//       }[];
//       genres: {
//         id: number;
//         name: string;
//       }[][];
//     };
//   }[];
//   totalGames: number;
//   totalPage: number;
//   currentPage: number;
// }

export interface ITotalStatusUserResponse {
  status: string;
  total: number;
}

export interface IGameByIDRequest {
  gameId: number;
  userId: string;
}

export interface ICreateGameStatus {
  userId: string;
  status: 'BACKLOG' | 'PLAYING' | 'FINISHED' | 'DROPPED' | null;
  gameId: number;
}

export interface IUpdateGameStatus {
  status: string;
  userGameID: string;
}

export type TGameStatus = string | null;

export interface IUserGames {
  id: string;
  userId: string;
  gameId: number;
  game_name: string;
  status: 'BACKLOG' | 'PLAYING' | 'FINISHED' | 'DROPPED';
  note: string | null;
  created_at: string;
  updated_at: string;
  game: Game;
}

export interface IUserGamesResponse {
  data: IUserGames[];
  totalGames: number;
  totalPage: number;
  currentPage: number;
}

export interface IGameContextProps {
  gameLoading: boolean;
  setGameLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getPopularGames: () => Promise<void>;
  popularGames: IGamesListResponse;
  handleSearchGames: (searchValues: string, page: number) => Promise<void>;
  gameSearchValue: string;
  setGameSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchGamesResult: IGamesListResponse;
  getGamesByID: (gameID: number, userID: string) => Promise<void>;
  gameByID: IGameByIDResponse;
  setGameByID: React.Dispatch<React.SetStateAction<IGameByIDResponse>>;
  getUserGames: (userID: string, page: number, limitPerPage: number, status?: string, search?: string) => Promise<void>;
  createGameStatus: (status: string, userId: string, gameId: number) => Promise<void>;
  updateGameStatus: (userGameID: string, status?: string, note?: string) => Promise<void>;
  deleteGameStatus: (userGameID: string) => Promise<void>;
  handleGameStatus: (
    actualStatus: TGameStatus,
    sentStatus: 'BACKLOG' | 'PLAYING' | 'FINISHED' | 'DROPPED',
    userId: string,
    userGameID: string | null,
    gameId: number
  ) => void;
  userGames: IUserGamesResponse;
  setUserGames: React.Dispatch<React.SetStateAction<IUserGamesResponse>>;
  getTotalStatusUser: (userId: string) => Promise<void>;
  totalGameStatusUser: ITotalStatusUserResponse[];
}

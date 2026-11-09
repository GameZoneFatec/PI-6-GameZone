import { GameContext } from '@contexts/Game.context';
import { useContext } from 'react';

const useGames = () => {
  return useContext(GameContext);
};

export default useGames;

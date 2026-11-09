import type { IGameCardValues, IGamesListResponse } from '@interfaces/game.interface';
import { Card, CardImage, CardInfos, CardsContainer } from './gameCard.style';
import { useNavigate } from 'react-router-dom';

interface gameListToCards {
  gameList: IGamesListResponse;
  direction: 'line' | 'grid';
}

const GameCardList = ({ gameList, direction }: gameListToCards) => {
  const gameCards = gameList.map((game) => {
    const { idGame, background_image, name, released, platforms } = game;
    return (
      <GameCard
        key={idGame}
        idGame={idGame}
        background_image={background_image}
        name={name}
        released={released}
        platforms={platforms}
      />
    );
  });

  return <CardsContainer direction={direction}>{gameCards}</CardsContainer>;
};

const GameCard = ({ background_image, name, released, idGame, platforms }: IGameCardValues) => {
  const navigate = useNavigate();
  const shownPlatforms = platforms?.slice(0, 2);
  const extraCount = platforms.length - shownPlatforms.length;

  return (
    <Card key={idGame} onClick={() => navigate(`/game/${idGame}`)}>
      <CardImage>
        <img src={background_image} alt={`${name} image`} />
      </CardImage>
      <CardInfos>
        <p className='gameTitle'>{name}</p>
        <small className='gameRelease'>{released}</small>
        <ul className='game-platforms'>
          {shownPlatforms.map((platform) => (
            <li key={platform.id}>
              <p>· {platform.name}</p>
            </li>
          ))}
          {extraCount > 0 && (
            <li>
              <small>· + {extraCount} plataforma(s)</small>
            </li>
          )}
        </ul>
      </CardInfos>
    </Card>
  );
};

export { GameCard, GameCardList };

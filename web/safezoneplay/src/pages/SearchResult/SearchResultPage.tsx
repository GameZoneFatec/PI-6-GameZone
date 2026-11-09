/* eslint-disable react-hooks/exhaustive-deps */
import Button from '@components/Buttons/Buttons';
import { GameCardList } from '@components/GameCard/GameCard.component';
import { Loading } from '@components/Loading/Loading.component';
import useGames from '@hooks/useGames';
import { StyledMain } from '@pages/Home/styles.homePage';
import { Container } from '@styles/global';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const SearchResultPage = () => {
  const param = useParams();
  const [page, setPage] = useState(1);

  const { handleSearchGames, gameLoading, searchGamesResult } = useGames();

  const initialSearch = useRef(false);

  useEffect(() => {
    if (!param.value) return;

    setPage(1);
    handleSearchGames(param.value, 1);
  }, [param.value]);

  useEffect(() => {
    if (!param.value) return;

    if (!initialSearch.current) {
      initialSearch.current = true;
      return;
    }

    handleSearchGames(param.value, page);
  }, [page]);

  const showMoreResults = async () => {
    setPage((prev) => prev + 1);
  };

  console.log(searchGamesResult);

  return (
    <StyledMain>
      <Container>
        {gameLoading ? (
          <Loading />
        ) : (
          <section id='cardlist-myGames'>
            <h2>Resultado da Pesquisa:</h2>
            <Container>
              <GameCardList gameList={searchGamesResult} direction='grid' />
              <Button type='moreResultsButton' onClick={showMoreResults}>
                MOSTRAR MAIS RESULTADOS
              </Button>
            </Container>
          </section>
        )}
      </Container>
    </StyledMain>
  );
};

export default SearchResultPage;

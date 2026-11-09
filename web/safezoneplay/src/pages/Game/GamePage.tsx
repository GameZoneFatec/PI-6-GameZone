/* eslint-disable react-hooks/exhaustive-deps */
import { Container } from '@styles/global';
import {
  GameAsideCard,
  GameDescription,
  GameGallery,
  GameInfos,
  ReviewButton,
  ReviewContainer,
  StyledGameContainer,
  StyledGameDetailsContainer,
  StyledGamePageMain,
  StyledGameTitle
} from './styles.gamePage';
import useGames from '@hooks/useGames';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import parseHtmlToText from '@utils/parseHtmlToText';
import { Loading } from '@components/Loading/Loading.component';
import { FaRegCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';
import { IoGameControllerOutline } from 'react-icons/io5';
import { RiBookShelfLine } from 'react-icons/ri';
import useAuth from '@hooks/useAuth';
import { ReviewCard } from '@components/ReviewCard/ReviewCard.component';
import useReview from '@hooks/useReview';
import type { ICreateReview, IReviewResponse } from '@interfaces/review.interface';
import { ReviewModal, type responseReview, type ReviewStatus } from '@components/Modal/reviewModal/reviewModal';
import { toast } from 'react-toastify';

const GamePage = () => {
  const param = useParams();
  const { userData, userLoading } = useAuth();
  const { getGamesByID, gameByID, gameLoading, handleGameStatus } = useGames();
  const {
    reviewFeed,
    reviewlistFeed,
    CreateLike,
    reviewUpdate,
    DeleteLike,
    createReview,
    deleteReview,
    reviewByUserAndGame,
    reviewByUser,
    setReviewByUser
  } = useReview();
  const [page, setPage] = useState(1);
  const [onDelete, setOndelete] = useState(false);
  const [ReviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectReview, setSelectReview] = useState<Partial<responseReview | null>>(null);
  const [canEditReview, setCanEditReview] = useState(false);
  const isEmailVerified = !!userData?.email_verified;

  function ensureEmailVerified() {
    if (!isEmailVerified) {
      toast.warning('Confirme o email para utilizar essa função', {
        style: {
          color: '#000',
          fontWeight: 'bold'
        }
      });
      return false;
    }

    return true;
  }

  function openReviewModal(review: IReviewResponse) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setCanEditReview(false);

    setSelectReview({
      body: review.body,
      isPublic: review.isPublic,
      rating: review.rating,
      status: review.status as ReviewStatus,
      title: review.title
    });

    setReviewModalOpen(true);
    document.body.style.overflow = 'hidden';
  }

  async function deletarReview(erase: boolean) {
    if (!erase || !reviewByUser?.id) return;

    const userId = userData?.id;
    if (!userId) return;

    try {
      await deleteReview({ reviewId: reviewByUser.id });

      await reviewlistFeed({
        gameId: Number(param.id),
        limit: 4,
        page,
        userId
      });

      await reviewByUserAndGame({
        gameId: Number(param.id),
        userId
      });

      console.log('DEPOIS DE DELETAR', reviewByUser);

      setReviewByUser(null);
      setOndelete(false);
      setReviewModalOpen(false);
      document.body.style.overflow = 'auto';
    } catch {
      return;
    }
  }

  function openCreateReviewMoal() {
    if (userData?.premium === false) {
      toast.warn('Você precisa ser premium para escrever um review', { style: { color: '#000', fontWeight: 'bold' } });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (reviewByUser) {
      setOndelete(true);
      setSelectReview({
        body: reviewByUser.body,
        isPublic: reviewByUser.isPublic,
        rating: reviewByUser.rating,
        status: reviewByUser.status as ReviewStatus,
        title: reviewByUser.title
      });
    } else {
      setSelectReview(null);
    }

    setCanEditReview(true);
    setReviewModalOpen(true);

    document.body.style.overflow = 'hidden';
  }

  async function HandlecreateReview(data: IReviewResponse) {
    const userId = userData?.id;
    if (!userId) return;

    const review: ICreateReview = {
      gameId: Number(param.id),
      body: data.body,
      isPublic: data.isPublic,
      status: data.status as ReviewStatus,
      title: data.title,
      rating: data.rating,
      userId
    };

    try {
      if (reviewByUser) {
        await reviewUpdate(review, reviewByUser.id);
      } else {
        await createReview(review);
      }
      // Vou deixar comentado aqui o fluxo que estou seguindo

      // Recarrega a lista de reviews
      await reviewlistFeed({
        gameId: Number(param.id),
        limit: 4,
        page,
        userId
      });

      // Recarrega a review do usuário pra mudar o texto do botão
      await reviewByUserAndGame({
        gameId: Number(param.id),
        userId
      });

      // Fecha o modal
      setReviewModalOpen(false);
      document.body.style.overflow = 'auto';
      setOndelete(true); // se quiser deixar o botão de deletar sempre que tiver review
    } catch {
      toast.error('Erro ao salvar review, tente novamente.');
    }
  }

  async function likedAndRemoveLike(like: boolean, reviewId: string) {
    const userId = userData?.id;
    if (!userId) {
      toast.error('Não foi possível realizar essa ação. Tente novamente mais tarde');
      return;
    }

    console.log('like (estado atual antes do clique): ', like, 'reviewId: ', reviewId, 'userId: ', userId);

    if (like) {
      await DeleteLike({ reviewId, userId });
    } else {
      await CreateLike({ userId, reviewId });
    }

    await reviewlistFeed({
      gameId: Number(param.id),
      limit: 4,
      page,
      userId
    });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!param.id || userLoading || !userData) return;
    getGamesByID(Number(param.id), userData.id);
    console.log(page);
    reviewlistFeed({
      gameId: Number(param.id),
      limit: 4,
      page,
      userId: userData.id
    });

    reviewByUserAndGame({
      gameId: Number(param.id),
      userId: userData.id
    });
  }, [param.id, userData, userLoading, page]);

  return (
    <>
      {ReviewModalOpen && (
        <ReviewModal
          open={ReviewModalOpen}
          canEdit={canEditReview}
          initialValues={selectReview ?? undefined}
          onClose={() => {
            setReviewModalOpen(false);
            document.body.style.overflow = 'auto';
          }}
          showDeleteButton={onDelete}
          onDelete={(data: boolean) => deletarReview(data)}
          onSave={(data) => HandlecreateReview(data as IReviewResponse)}
        />
      )}
      <StyledGamePageMain
        style={{
          ['--bg-image' as string]: `url(${gameByID?.game?.background_image || ''})`
        }}
      >
        <Container>
          {gameLoading || userLoading ? (
            <Loading />
          ) : (
            <StyledGameContainer>
              <StyledGameDetailsContainer>
                <StyledGameTitle>
                  <h1>{gameByID?.game?.name}</h1>
                </StyledGameTitle>
                <GameDescription>
                  <p>{parseHtmlToText.htmlToText(gameByID?.game?.description)}</p>
                </GameDescription>
                <GameGallery>
                  {gameByID?.game?.screen_shots?.map((image) => {
                    return <img src={`${image.image}`} key={image.id} />;
                  })}
                </GameGallery>
                <GameInfos>
                  <div className='column'>
                    <div>
                      <p className='minorDetails-title'>Gêneros:</p>
                      <ul>
                        {gameByID?.game?.genres?.map((genre) => (
                          <li key={genre.id}>
                            <p>{genre.name}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className='minorDetails-title'>Desenvolvedores:</p>
                      <ul>
                        {gameByID?.game?.developers?.map((developer) => (
                          <li key={developer.id}>
                            <p>{developer.name}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className='minorDetails-title'>Editora:</p>
                      <ul>
                        {gameByID?.game?.publishers?.map((publisher) => (
                          <li key={publisher.id}>
                            <p>{publisher.name}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className='column'>
                    <div>
                      <p className='minorDetails-title'>Lançamento: </p>
                      <p>{gameByID?.game?.released?.split('-').reverse().join('/')}</p>

                      {/*
                    Comentei porque muitos jogos não tem tempo de jogo ou vem com tempos totalmente errados.

                    {gameByID.playtime != 0 && <p>Tempo de jogo: {gameByID.playtime} horas</p>}
                    */}
                    </div>
                  </div>

                  <div className='column'>
                    <div>
                      <p className='minorDetails-title'>Plataformas:</p>
                      <ul>
                        {gameByID?.game?.paltforms?.map((platform) => (
                          <li key={platform.id}>
                            <p>{platform.name}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className='column'>
                    <div>
                      <p className='minorDetails-title'>Links</p>
                      <ul>
                        <li key={'webSite'}>
                          <a href={gameByID?.game?.website}>Site Oficial</a>
                        </li>
                        <li key={'reddit'}>
                          <a href={gameByID?.game?.reddit_url}>Reddit</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </GameInfos>
                <ReviewContainer>
                  <h2>Reviews da comunidade</h2>

                  {reviewFeed.map((review: IReviewResponse) => (
                    <ReviewCard
                      key={review.reviewId}
                      reviewId={review.reviewId}
                      title={review.title}
                      body={review.body}
                      username={review.author.username}
                      avatarUrl={review.author.profile_image_url}
                      likedByUser={review.likedByUser}
                      rating={review.rating}
                      likes={review.likesCount}
                      publishedAt={review.published_at}
                      onClick={() => {
                        openReviewModal(review);
                      }}
                      onToggleLike={(reviewId, like) => likedAndRemoveLike(like, reviewId)}
                    />
                  ))}

                  <div className='review-pagination'>
                    <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                      Anterior
                    </button>

                    <span className='page-number'>Página {page}</span>

                    <button disabled={reviewFeed.length < 4} onClick={() => setPage((prev) => prev + 1)}>
                      Próxima
                    </button>
                  </div>
                </ReviewContainer>
              </StyledGameDetailsContainer>
              <GameAsideCard>
                <img src={gameByID?.game?.background_image} />
                <ul>
                  {/* <li key={'addToList'}>
                  <FaRegStar />
                  <p>Adicionar à lista</p>
                </li> */}

                  <li
                    onClick={() => {
                      if (!ensureEmailVerified()) return;

                      handleGameStatus(
                        gameByID?.userGame?.status,
                        'BACKLOG',
                        userData!.id,
                        gameByID?.userGame?.userGameId,
                        Number(param.id)
                      );
                    }}
                    className={gameByID?.userGame?.status === 'BACKLOG' ? 'backlog' : ''}
                    key={'addToBacklog'}
                  >
                    <RiBookShelfLine />
                    <p>Backlog</p>
                  </li>

                  <li
                    onClick={() => {
                      if (!ensureEmailVerified()) return;

                      handleGameStatus(
                        gameByID?.userGame?.status,
                        'PLAYING',
                        userData!.id,
                        gameByID?.userGame?.userGameId,
                        Number(param.id)
                      );
                    }}
                    className={gameByID?.userGame?.status === 'PLAYING' ? 'playing' : ''}
                    key={'playing'}
                  >
                    <IoGameControllerOutline />
                    <p>Jogando</p>
                  </li>

                  <li
                    onClick={() => {
                      if (!ensureEmailVerified()) return;

                      handleGameStatus(
                        gameByID?.userGame?.status,
                        'FINISHED',
                        userData!.id,
                        gameByID?.userGame?.userGameId,
                        Number(param.id)
                      );
                    }}
                    className={gameByID?.userGame?.status === 'FINISHED' ? 'finished' : ''}
                    key={'addToFinished'}
                  >
                    <FaRegCircleCheck />
                    <p>Finalizado</p>
                  </li>

                  <li
                    onClick={() => {
                      if (!ensureEmailVerified()) return;

                      handleGameStatus(
                        gameByID?.userGame?.status,
                        'DROPPED',
                        userData!.id,
                        gameByID?.userGame?.userGameId,
                        Number(param.id)
                      );
                    }}
                    className={gameByID?.userGame?.status === 'DROPPED' ? 'dropped' : ''}
                    key={'abandoned'}
                  >
                    <FaRegCircleXmark />
                    <p>Abandonado</p>
                  </li>

                  {/* <li key={''}>
                  <MdOutlinePlaylistAdd />
                  <p>Lista</p>
                </li> */}

                  {/* <li key={'rateGame'}>
                  <TbEdit />
                  <p>Avaliar</p>
                </li> */}
                </ul>
                <ReviewButton onClick={() => openCreateReviewMoal()}>
                  {reviewByUser ? 'Atualizar review' : 'Deixar minha review'}
                </ReviewButton>
              </GameAsideCard>
            </StyledGameContainer>
          )}
        </Container>
      </StyledGamePageMain>
    </>
  );
};

export default GamePage;

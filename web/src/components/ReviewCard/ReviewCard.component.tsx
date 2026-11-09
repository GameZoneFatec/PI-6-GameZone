import type React from 'react';
import {
  Avatar,
  Body,
  Card,
  CreatedBy,
  Description,
  Footer,
  Header,
  LikeButton,
  LikeCount,
  PublishDate,
  Stars,
  Title
} from './reviewCard.style';

const MAX_STARS = 5;

type ReviewCardProps = {
  reviewId: string;
  title: string;
  rating: number;
  username: string;
  body: string;
  publishedAt: Date | null;
  likes: number;
  avatarUrl: string | null;
  likedByUser: boolean;
  onClick?: () => void;
  onToggleLike?: (reviewId: string, likedByUser: boolean) => void;
};

function StarRating({ rating }: { rating: number }) {
  const value = Math.round(rating);

  return (
    <Stars>
      {Array.from({ length: MAX_STARS }).map((_, index) => (
        <span key={index}>{index < value ? '★' : '☆'}</span>
      ))}
    </Stars>
  );
}

export function ReviewCard({
  reviewId,
  title,
  rating,
  username,
  body,
  publishedAt,
  likes,
  avatarUrl,
  likedByUser,
  onToggleLike,
  onClick
}: ReviewCardProps) {
  function handleLikeClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    onToggleLike?.(reviewId, likedByUser);
  }

  function normalizeUrl(url: string | null | undefined) {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://${url}`;
  }

  const avatar = normalizeUrl(avatarUrl);

  let publishedDate = '';
  if (publishedAt) {
    publishedDate = new Date(publishedAt).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <Card onClick={onClick}>
      <Avatar src={avatar ?? undefined} />

      <Body>
        <Header>
          <div>
            <Title>{title}</Title>
            <StarRating rating={rating} />
          </div>

          <CreatedBy>
            Criado por - <span>{username}</span>
          </CreatedBy>
        </Header>

        <Description>{body}</Description>

        <Footer>
          <PublishDate>Publicado: {publishedDate}</PublishDate>

          <LikeButton
            onClick={handleLikeClick}
            css={{
              background: likedByUser ? '#960a23' : 'transparent',
              borderColor: likedByUser ? '#960a23' : '#ffffff',
              color: '#ffffff'
            }}
          >
            <span>{likedByUser ? '❤️' : '♡'}</span>
            <LikeCount>{likes}</LikeCount>
          </LikeButton>
        </Footer>
      </Body>
    </Card>
  );
}

import { keyframes } from '@stitches/react';
import { styled } from '@styles/stitches.config';

export const spinX = keyframes({
  '0%': { transform: 'rotateX(0deg)' },
  '100%': { transform: 'rotateX(360deg)' }
});

export const Wrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: '100%',
  position: 'relative'
});

export const Logo = styled('img', {
  animation: `${spinX} 1.5s linear infinite`,
  transformStyle: 'preserve-3d'
});

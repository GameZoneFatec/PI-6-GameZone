import { styled } from '@styles/stitches.config';

export const StyledLayoutWrapper = styled('div', {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
});

export const StyledLayoutBody = styled('main', {
  flex: 1, 
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$brand1'
});

import { createStitches } from '@stitches/react';
import { baseTheme } from './theme';

export const { styled, globalCss } = createStitches({
  theme: baseTheme,
  media: {
    bp1: '(min-width: 768px)'
  }
});

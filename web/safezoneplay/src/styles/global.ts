import { styled, globalCss } from '@styles/stitches.config';

export const globalStyles = globalCss({
  '@font-face': [
    {
      fontFamily: 'Play',
      src: 'url("/fonts/Play/Play-Regular.ttf") format("truetype")',
      fontWeight: 400,
      fontStyle: 'normal'
    },
    {
      fontFamily: 'Play',
      src: 'url("/fonts/Play/Play-Bold.ttf") format("truetype")',
      fontWeight: 700,
      fontStyle: 'normal'
    },
    {
      fontFamily: 'Inter',
      src: 'url("/fonts/Inter/Inter-VariableFont_opsz,wght.ttf") format("truetype")',
      fontWeight: '100 900',
      fontStyle: 'normal'
    }
  ],

  /* RESET */
  'html, body, div, span, applet, object, iframe, \
  h1, h2, h3, h4, h5, h6, p, blockquote, pre, \
  a, abbr, acronym, address, big, cite, code, \
  del, dfn, em, img, ins, kbd, q, s, samp, \
  small, strike, strong, sub, sup, tt, var, \
  b, u, i, center, \
  dl, dt, dd, ol, ul, li, \
  fieldset, form, label, legend, \
  table, caption, tbody, tfoot, thead, tr, th, td, \
  article, aside, canvas, details, embed, \
  figure, figcaption, footer, header, hgroup, \
  menu, nav, output, ruby, section, summary, \
  time, mark, audio, video, input': {
    margin: 0,
    padding: 0,
    border: 0,
    fontSize: '100%',
    font: 'inherit',
    verticalAlign: 'baseline',
    boxSizing: 'border-box'
  },

  /* HTML5 display-role reset para browsers antigos */
  'article, aside, details, figcaption, figure, \
  footer, header, hgroup, menu, nav, section': {
    display: 'block'
  },

  body: {
    lineHeight: 1,
    fontFamily: '$play'
  },

  'ol, ul': {
    listStyle: 'none'
  },

  'blockquote, q': {
    quotes: 'none'
  },

  'blockquote:before, blockquote:after, q:before, q:after': {
    content: "''"
  },

  table: {
    borderCollapse: 'collapse',
    borderSpacing: 0
  },

  a: { textDecoration: 'none', color: '$whiteFixed' },

  'small, p, h1, h2, h3, h4, h5, h6': {
    overflowWrap: 'break-word',
    color: '$whiteFixed'
  },

  'input, button': {
    border: 'none'
  }
});

export const Container = styled('div', {
  maxWidth: '$container',
  width: '90%',
  margin: '0 auto',
  padding: '0 1rem'
});

export const Flex = styled('div', {
  display: 'flex',
  gap: '$1'
});

export type ColorType =
  | 'gray/white'
  | 'gray/grayBG'
  | 'gray/gray50'
  | 'gray/gray100'
  | 'gray/gray150'
  | 'gray/gray200'
  | 'gray/gray400'
  | 'gray/gray500'
  | 'gray/gray600'
  | 'gray/gray800'
  | 'gray/gray900'
  | 'gray/black'
  | 'main_color/green'
  | 'sub_color/red/p'
  | 'sub_color/red/s'
  | 'sub_color/red/c'
  | 'sub_color/red/bg'
  | 'sub_color/orange/p'
  | 'sub_color/orange/s'
  | 'sub_color/orange/c'
  | 'sub_color/orange/bg'
  | 'sub_color/beige/p'
  | 'sub_color/beige/s'
  | 'sub_color/beige/c'
  | 'sub_color/beige/h'
  | 'sub_color/beige/bg'
  | 'sub_color/green/p'
  | 'sub_color/green/s'
  | 'sub_color/green/c'
  | 'sub_color/green/bg'
  | 'sub_color/blue/p'
  | 'sub_color/blue/s'
  | 'sub_color/blue/c'
  | 'sub_color/blue/bg'
  | 'sub_color/indigo/p'
  | 'sub_color/indigo/s'
  | 'sub_color/indigo/c'
  | 'sub_color/indigo/bg'
  | 'sub_color/purple/p'
  | 'sub_color/purple/s'
  | 'sub_color/purple/c'
  | 'sub_color/purple/bg'
  | 'error/error_color';

export type WeightType = 'bold' | 'normal';

export type LineHeightType = 'sm' | 'md' | 'lg';

export type SizeType = 10 | 12 | 14 | 16 | 18 | 20 | 22 | 52;

const theme = {
  color: {
    'gray/white': '#FFFFFF',
    'gray/grayBG': '#FBFCFD',
    'gray/gray50': '#F2F5F8',
    'gray/gray100': '#EBEEF2',
    'gray/gray150': '#DCE2E7',
    'gray/gray200': '#CED3DA',
    'gray/gray400': '#A3ABB3',
    'gray/gray500': '#767D86',
    'gray/gray600': '#4B535A',
    'gray/gray800': '#2C2F34',
    'gray/gray900': '#232629',
    'gray/black': '#111111',
    'main_color/green': '#649B92',
    'sub_color/red/p': '#F9557C',
    'sub_color/red/s': '#FFABC1',
    'sub_color/red/c': '#FEE0E8',
    'sub_color/red/bg': '#FEF4F7',
    'sub_color/orange/p': '#F0836C',
    'sub_color/orange/s': '#FFBCAE',
    'sub_color/orange/c': '#FFDBD3',
    'sub_color/orange/bg': '#FFF1EE',
    'sub_color/beige/p': '#F2CA94',
    'sub_color/beige/s': '#BBB2A6',
    'sub_color/beige/c': '#F8EBDB',
    'sub_color/beige/h': '#F2DEC3',
    'sub_color/beige/bg': '#F4F0EB',
    'sub_color/green/p': '#658780',
    'sub_color/green/s': '#81B8A2',
    'sub_color/green/c': '#ADCEC1',
    'sub_color/green/bg': '#E8F5F0',
    'sub_color/blue/p': '#52A5E1',
    'sub_color/blue/s': '#AFD4FB',
    'sub_color/blue/c': '#D2E7FD',
    'sub_color/blue/bg': '#EEF6FF',
    'sub_color/indigo/p': '#7084EC',
    'sub_color/indigo/s': '#CAC8FA',
    'sub_color/indigo/c': '#E3E3FF',
    'sub_color/indigo/bg': '#F0F0FF',
    'sub_color/purple/p': '#8B5DC5',
    'sub_color/purple/s': '#C6B0FF',
    'sub_color/purple/c': '#E5DCFD',
    'sub_color/purple/bg': '#F5F1FF',
    'error/error_color': '#FF4C24',
  },
  weight: {
    bold: 700,
    normal: 500,
  },
  lineHeight: {
    sm: 1.2,
    md: 1.4,
    lg: 1.6,
  },
};

export default theme;

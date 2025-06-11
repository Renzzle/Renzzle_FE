import { useWindowDimensions } from 'react-native';
import theme from '../../styles/theme';

const useDeviceWidth = (): number => {
  const { width } = useWindowDimensions();
  return Math.min(width, theme.layout.maxWidth);
};

export default useDeviceWidth;

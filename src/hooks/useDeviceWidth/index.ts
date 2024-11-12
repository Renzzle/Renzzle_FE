import { useWindowDimensions } from 'react-native';

const useDeviceWidth = (): number => {
  const { width } = useWindowDimensions();
  return width;
};

export default useDeviceWidth;

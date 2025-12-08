import React from 'react';
import useDeviceWidth from '../../../hooks/useDeviceWidth';
import { AppBackground, Wrapper } from './index.styles';

const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const width = useDeviceWidth();

  return (
    <AppBackground edges={['top', 'bottom', 'left', 'right']}>
      <Wrapper maxWidth={width}>{children}</Wrapper>
    </AppBackground>
  );
};

export default AppWrapper;

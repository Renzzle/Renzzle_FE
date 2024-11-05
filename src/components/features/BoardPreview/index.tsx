import React from 'react';
import Preview from './index.styles';

interface BoardPreviewProps {
  isLocked?: boolean;
}

const BoardPreview = ({ isLocked = false }: BoardPreviewProps) => {
  return (
    <Preview isLocked={isLocked} />
  );
};

export default BoardPreview;

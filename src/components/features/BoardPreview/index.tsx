import React from 'react';
import Preview from './index.styles';
import { LockIcon } from '../../common/Icons';

interface BoardPreviewProps {
  isLocked?: boolean;
}

const BoardPreview = ({ isLocked = false }: BoardPreviewProps) => {
  return (
    <Preview isLocked={isLocked}>
      {isLocked &&
        <LockIcon />
      }
    </Preview>
  );
};

export default BoardPreview;

import React from 'react';
import { HelperWrapper } from './index.styles';
import Icon from '../Icon';
import CustomText from '../CustomText';

interface HelperTextProps {
  children: React.ReactNode;
  type?: 'info' | 'checked' | 'error';
}

const HelperText = ({ children, type }: HelperTextProps) => {
  if (type === 'info') {
    return (
      <HelperWrapper>
        <Icon name="InfoIcon" color="gray/gray400" size={14} />
        <CustomText size={10} lineHeight="sm" color="gray/gray400">
          {children}
        </CustomText>
      </HelperWrapper>
    );
  }
  if (type === 'checked') {
    return (
      <HelperWrapper>
        <Icon name="CheckIcon" color="main_color/blue_p" size={14} />
        <CustomText size={10} lineHeight="sm" color="main_color/blue_p">
          {children}
        </CustomText>
      </HelperWrapper>
    );
  }
  if (type === 'error') {
    return (
      <HelperWrapper>
        <Icon name="ErrorIcon" color="error/error_color" size={14} />
        <CustomText size={10} lineHeight="sm" color="error/error_color">
          {children}
        </CustomText>
      </HelperWrapper>
    );
  }
  return (
    <HelperWrapper>
      <CustomText size={10} lineHeight="sm" color="gray/gray500">
        {children}
      </CustomText>
    </HelperWrapper>
  );
};

export default HelperText;

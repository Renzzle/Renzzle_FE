import React from 'react';
import { ButtonWrapper } from './index.styles';
import { Icon } from '../../common';
import { menuThemeMap, MenuType } from '../../../types';
import theme from '../../../styles/theme';

interface MenuButtonProps {
  type: MenuType;
  size?: number;
}

const MenuButton = ({ type, size = 40 }: MenuButtonProps) => {
  const menuTheme = menuThemeMap[type];

  return (
    <ButtonWrapper background={theme.color[menuTheme.background]} size={size}>
      <Icon name={menuTheme.iconName} color={menuTheme.iconColor} size={size * 0.625} />
    </ButtonWrapper>
  );
};

export default MenuButton;

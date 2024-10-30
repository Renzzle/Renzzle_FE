import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import theme from '../../../styles/theme';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
};

export const AppIcon = ({ name, size = 24, color = theme.color['gray/gray900'] }: IconProps) => (
  <Icon name={name} size={size} color={color} />
);

export const ArrowIcon = ({ name, size = 24, color = theme.color['gray/gray900'] }: IconProps) => (
  <Icon2 name={name} size={size} color={color} />
);

export const HeartOutlineIcon = (props: Omit<IconProps, 'name'>) => (
  <AppIcon name="cards-heart-outline" {...props} />
);

export const HeartIcon = (props: Omit<IconProps, 'name' | 'color'>) => (
  <AppIcon name="cards-heart" color={theme.color['sub_color/red/p']} {...props} />
);

export const SubscribeIcon = (props: Omit<IconProps, 'name'>) => (
  <AppIcon name="account-multiple-plus-outline" {...props} />
);

export const LevelIcon = (props: Omit<IconProps, 'name'>) => (
  <AppIcon name="tune-vertical" {...props} />
);

export const RankingIcon = (props: Omit<IconProps, 'name'>) => (
  <AppIcon name="trophy-outline" {...props} />
);

export const DeleteAccountIcon = (props: Omit<IconProps, 'name'>) => (
  <AppIcon name="close-box-outline" {...props} />
);

export const LogoutIcon = (props: Omit<IconProps, 'name'>) => (
  <AppIcon name="logout-variant" {...props} />
);

export const SearchIcon = (props: Omit<IconProps, 'name' | 'color'>) => (
  <AppIcon name="magnify" color={theme.color['gray/gray500']} {...props} />
);

export const FilterIcon = (props: Omit<IconProps, 'name' | 'color'>) => (
  <AppIcon name="tune" color={theme.color['gray/gray500']} {...props} />
);

export const BellIcon = (props: Omit<IconProps, 'name'>) => (
  <AppIcon name="bell-outline" {...props} />
);

export const RadioBlankIcon = (props: Omit<IconProps, 'name' | 'color'>) => (
  <AppIcon name="radiobox-blank" color={theme.color['gray/gray500']} {...props} />
);

export const RadioMarkedIcon = (props: Omit<IconProps, 'name' | 'color'>) => (
  <AppIcon name="radiobox-marked" color={theme.color['main_color/green']} {...props} />
);

export const LockIcon = (props: Omit<IconProps, 'name' | 'color'>) => (
  <AppIcon name="lock" color={theme.color['gray/white']} {...props} />
);

export const PlusIcon = (props: Omit<IconProps, 'name' | 'color'>) => (
  <AppIcon name="plus" color={theme.color['gray/white']} {...props} />
);

export const MenuIcon = (props: Omit<IconProps, 'name'>) => (
  <AppIcon name="menu" {...props} />
);

export const ErrorIcon = (props: Omit<IconProps, 'name'>) => (
  <AppIcon name="alert-circle" {...props} />
);

export const CloseIcon = (props: Omit<IconProps, 'name' | 'color'>) => (
  <AppIcon name="close-circle" color={theme.color['gray/gray400']} {...props} />
);

export const CheckIcon = (props: Omit<IconProps, 'name'>) => (
  <AppIcon name="check-circle" {...props} />
);

export const ChevronLeftIcon = (props: Omit<IconProps, 'name'>) => (
  <ArrowIcon name="chevron-left" {...props} />
);

export const ChevronThinLeftIcon = (props: Omit<IconProps, 'name'>) => (
  <ArrowIcon name="chevron-thin-left" {...props} />
);

export const ChevronRightIcon = (props: Omit<IconProps, 'name'>) => (
  <ArrowIcon name="chevron-right" {...props} />
);

export const ChevronThinRightIcon = (props: Omit<IconProps, 'name'>) => (
  <ArrowIcon name="chevron-thin-right" {...props} />
);

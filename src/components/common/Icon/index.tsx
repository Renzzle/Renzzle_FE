import React from 'react';
import {SvgProps} from 'react-native-svg';

import Icons, {IconName} from '../../../assets/icons';
import theme, {ColorType} from '../../../styles/theme';

type IconProps = SvgProps & {
  name: IconName;
  size?: number;
  color?: ColorType;
};

const Icon = ({name, size, color = 'gray/gray900', ...props}: IconProps) => {
  const SvgIcon = Icons[name];

  const width = size;
  const height = size;

  const sizeProps = {
    ...(width !== undefined ? {width} : {}),
    ...(height !== undefined ? {height} : {}),
  };

  const fillColor = theme.color[color];

  return <SvgIcon {...sizeProps} color={fillColor} {...props} />;
};

export default Icon;

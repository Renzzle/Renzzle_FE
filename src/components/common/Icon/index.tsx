import React from 'react';
import {SvgProps} from 'react-native-svg';

import * as Icons from '../../../assets/icons';

type IconProps = SvgProps & {
  name: keyof typeof Icons;
  size?: number;
};

const Icon = ({name, size, ...props}: IconProps) => {
  const SvgIcon = Icons[name];

  const width = size;
  const height = size;

  const sizeProps = {
    ...(width !== undefined ? {width} : {}),
    ...(height !== undefined ? {height} : {}),
  };

  return <SvgIcon {...sizeProps} {...props} />;
};

export default Icon;

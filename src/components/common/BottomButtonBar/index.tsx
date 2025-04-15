import React, { ReactNode } from 'react';
import { StyledBottomButtonBar } from './index.styles';
import CustomButton from '../CustomButton';

type BottomButtonBarType = {
  transitions: {
    text: string;
    onAction: () => void | Promise<void>;
    disabled?: boolean;
  }[];
};

export function BottomBar({ children }: { children: ReactNode }) {
  return { children };
}

export default function BottomButtonBar({ transitions }: BottomButtonBarType) {
  if (transitions.length === 2) {
    const [secondaryTransition, primaryTransition] = transitions;
    return (
      <StyledBottomButtonBar>
        <CustomButton
          onPress={secondaryTransition.onAction}
          disabled={secondaryTransition.disabled}
          category="secondary">
          {secondaryTransition.text}
        </CustomButton>
        <CustomButton
          onPress={primaryTransition.onAction}
          disabled={primaryTransition.disabled}
          category="primary">
          {primaryTransition.text}
        </CustomButton>
      </StyledBottomButtonBar>
    );
  }

  if (transitions.length === 1) {
    const primaryTransition = transitions[0];
    return (
      <StyledBottomButtonBar>
        <CustomButton
          onPress={primaryTransition.onAction}
          disabled={primaryTransition.disabled}
          category="secondary">
          {primaryTransition.text}
        </CustomButton>
      </StyledBottomButtonBar>
    );
  }

  throw new Error('렌더링 에러');
}

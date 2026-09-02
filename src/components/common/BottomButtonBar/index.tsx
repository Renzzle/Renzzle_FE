import React, { ReactNode } from 'react';
import { StyledBottomButtonBar } from './index.styles';
import CustomButton from '../CustomButton';

type BottomButtonBarType = {
  transitions: {
    text: string;
    onAction: () => void | Promise<void>;
    disabled?: boolean;
    loading?: boolean;
  }[];
  variant?: 'default' | 'dim';
};

export function BottomBar({ children }: { children: ReactNode }) {
  return { children };
}

export default function BottomButtonBar({ transitions, variant = 'default' }: BottomButtonBarType) {
  if (transitions.length === 2) {
    const [secondaryTransition, primaryTransition] = transitions;
    return (
      <StyledBottomButtonBar variant={variant}>
        <CustomButton
          onPress={secondaryTransition.onAction}
          disabled={secondaryTransition.disabled}
          loading={secondaryTransition.loading}
          category="secondary">
          {secondaryTransition.text}
        </CustomButton>
        <CustomButton
          onPress={primaryTransition.onAction}
          disabled={primaryTransition.disabled}
          loading={primaryTransition.loading}
          category="primary">
          {primaryTransition.text}
        </CustomButton>
      </StyledBottomButtonBar>
    );
  }

  if (transitions.length === 1) {
    const primaryTransition = transitions[0];
    return (
      <StyledBottomButtonBar variant={variant}>
        <CustomButton
          onPress={primaryTransition.onAction}
          disabled={primaryTransition.disabled}
          loading={primaryTransition.loading}
          category="secondary">
          {primaryTransition.text}
        </CustomButton>
      </StyledBottomButtonBar>
    );
  }

  throw new Error('렌더링 에러');
}

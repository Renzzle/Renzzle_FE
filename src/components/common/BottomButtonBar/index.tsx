import React, { ReactNode } from 'react';
import { StyledBottomButtonBar } from './indes.styles';
import Button from '../Button';

type BottomButtonBarType = {
  transitions: {
    text: string;
    onAction: () => void | (() => Promise<void>);
    disabled?: boolean;
  }[];
};

export function BottomBar({ children }: { children: ReactNode }) {
  return {children};
}

export default function BottomButtonBar({ transitions }: BottomButtonBarType) {
  if (transitions.length === 2) {
    const [secondaryTransition, primaryTransition] = transitions;
    return (
      <StyledBottomButtonBar>
        <Button
          onPress={secondaryTransition.onAction}
          disabled={secondaryTransition.disabled}
          category="secondary"
        >
          {secondaryTransition.text}
        </Button>
        <Button
          onPress={primaryTransition.onAction}
          disabled={primaryTransition.disabled}
          category="primary"
        >
          {primaryTransition.text}
        </Button>
      </StyledBottomButtonBar>
    );
  }

  if (transitions.length === 1) {
    const primaryTransition = transitions[0];
    return (
      <StyledBottomButtonBar>
        <Button
          onPress={primaryTransition.onAction}
          disabled={primaryTransition.disabled}
          category="secondary"
        >
          {primaryTransition.text}
        </Button>
      </StyledBottomButtonBar>
    );
  }

  throw new Error('렌더링 에러');
}

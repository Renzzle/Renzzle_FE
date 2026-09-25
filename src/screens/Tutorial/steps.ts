import type { StoneType } from '../../components/features/Board';

export type TutorialChapter = 'intro' | 'basic' | 'forbidden' | 'exception' | 'white' | 'finish';
export type TutorialVisual = 'modes' | 'forbiddenSummary';
export type TutorialOutcome = 'success' | 'win' | 'lose';

export interface TutorialStep {
  // 문구 키: tutorial.steps.<key>.title / description(없으면 제목만 표시) / result(interaction이 있을 때)
  key: string;
  chapter: TutorialChapter;
  visual?: TutorialVisual;
  board?: {
    black: string[];
    white: string[];
    // 금수 자리 표시 (빈 칸)
    forbidden?: string[];
  };
  // 사용자가 target 칸에 stone을 두어야 다음 단계로 넘어갈 수 있다
  interaction?: {
    target: string;
    stone: StoneType;
    outcome: TutorialOutcome;
  };
}

// 금수 관련 배치는 모두 네이티브 엔진(ios/cpp)의 판정 결과와 일치하도록 검증한 배치다.
// 배치를 수정할 때는 엔진에서도 같은 결과(금수 여부, 승패)가 나오는지 확인해야 한다.
const DOUBLE_THREE_BOARD = {
  black: ['g8', 'h8', 'i9', 'i10'],
  white: ['g9', 'h10', 'j10', 'h7'],
};

export const TUTORIAL_STEPS: TutorialStep[] = [
  { key: 'welcome', chapter: 'intro', visual: 'modes' },
  {
    key: 'place',
    chapter: 'intro',
    board: { black: [], white: [] },
    interaction: { target: 'h8', stone: 1, outcome: 'success' },
  },
  {
    key: 'five',
    chapter: 'basic',
    board: { black: ['f8', 'g8', 'h8', 'i8'], white: ['e8', 'g9', 'h7', 'i9'] },
    interaction: { target: 'j8', stone: 1, outcome: 'win' },
  },
  { key: 'forbiddenIntro', chapter: 'basic', visual: 'forbiddenSummary' },
  {
    key: 'doubleThree',
    chapter: 'forbidden',
    board: { ...DOUBLE_THREE_BOARD, forbidden: ['i8'] },
  },
  {
    key: 'doubleFour',
    chapter: 'forbidden',
    board: {
      black: ['f8', 'g8', 'h8', 'i9', 'i10', 'i11'],
      white: ['e8', 'i12', 'g9', 'h10', 'j10', 'g7'],
      forbidden: ['i8'],
    },
  },
  {
    key: 'oneLineFour',
    chapter: 'forbidden',
    board: {
      black: ['e8', 'g8', 'i8', 'k8'],
      white: ['f9', 'h9', 'j9', 'h7'],
      forbidden: ['h8'],
    },
  },
  {
    key: 'overline',
    chapter: 'forbidden',
    board: {
      black: ['e8', 'f8', 'g8', 'i8', 'j8'],
      white: ['d8', 'k8', 'g9', 'i7', 'h10'],
      forbidden: ['h8'],
    },
  },
  {
    key: 'instantLoss',
    chapter: 'forbidden',
    board: DOUBLE_THREE_BOARD,
    interaction: { target: 'i8', stone: 1, outcome: 'lose' },
  },
  {
    key: 'fourThree',
    chapter: 'exception',
    board: {
      black: ['f8', 'g8', 'h8', 'i9', 'i10'],
      white: ['e8', 'g9', 'h10', 'j10', 'g7'],
    },
    interaction: { target: 'i8', stone: 1, outcome: 'success' },
  },
  {
    key: 'fivePriority',
    chapter: 'exception',
    board: {
      black: ['e8', 'f8', 'g8', 'h8', 'i9', 'i10', 'j9', 'k10'],
      white: ['d8', 'f7', 'g9', 'h10', 'j10', 'k9', 'j7', 'h6'],
    },
    interaction: { target: 'i8', stone: 1, outcome: 'win' },
  },
  {
    key: 'whiteFree',
    chapter: 'white',
    board: {
      black: ['d8', 'k8', 'g7', 'h9', 'i7', 'h10'],
      white: ['e8', 'f8', 'g8', 'i8', 'j8'],
    },
    interaction: { target: 'h8', stone: 2, outcome: 'win' },
  },
  { key: 'finish', chapter: 'finish' },
];

export interface RatingRanking {
  rank: number;
  nickname: string;
  rating: number;
}

export interface BestRanking {
  rank: number;
  nickname: string;
  score: number;
}

export interface RatingRankingResponse {
  top100: RatingRanking[];
  myRatingRank: RatingRanking;
}

export interface BestRankingResponse {
  top100: BestRanking[];
  myPuzzlerRank: BestRanking;
}

export type ResultVariant = 'success' | 'error' | 'default';

export interface GameResult {
  variant: ResultVariant;
}

export interface GameOutcome {
  rating?: number;
  reward?: number;
  price?: number;
  puzzleCount?: number;
}

export interface RankArchive {
  boardStatus: string;
  winColor: 'BLACK' | 'WHITE';
  isSolved: boolean;
}

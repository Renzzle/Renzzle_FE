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

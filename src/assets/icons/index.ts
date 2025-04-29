import AlertIcon from './ico-alert.svg';
import ArchiveIcon from './ico-archive.svg';
import AuthenticatedUserIcon from './ico-authenticated-user.svg';
import AuthenticatedIcon from './ico-authenticated.svg';
import BestUserIcon from './ico-best-user.svg';
import BookShelfIcon from './ico-book-shelf.svg';
import ChevronDoubleLeftIcon from './ico-chevron-double-left.svg';
import ChevronDoubleRightIcon from './ico-chevron-double-right.svg';
import ChevronLeftIcon from './ico-chevron-left.svg';
import ChevronRightIcon from './ico-chevron-right.svg';
import CommunityIcon from './ico-community.svg';
import ConfusedActiveIcon from './ico-confused-active.svg';
import ConfusedInactiveIcon from './ico-confused-inactive.svg';
import CorrectIcon from './ico-correct.svg';
import DepthIcon from './ico-depth.svg';
import FocusIcon from './ico-focus.svg';
import HashTagIcon from './ico-hashtag.svg';
import HeartActiveIcon from './ico-heart-active.svg';
import HeartInactiveIcon from './ico-heart-inactive.svg';
import HeartMediumIcon from './ico-heart-m.svg';
import HeartSmallIcon from './ico-heart-s.svg';
import HotIcon from './ico-hot.svg';
import IncorrectIcon from './ico-incorrect.svg';
import LightbulbAlertIcon from './ico-lightbulb-alert.svg';
import LightbulbIcon from './ico-lightbulb.svg';
import LightningIcon from './ico-lightning.svg';
import LockIcon from './ico-lock.svg';
import NormalUserIcon from './ico-normal-user.svg';
import NoticeIcon from './ico-notice.svg';
import PlusIcon from './ico-plus.svg';
import ProUserIcon from './ico-pro-user.svg';
import PuzzlePlusIcon from './ico-puzzle-plus.svg';
import PuzzleSquareIcon from './ico-puzzle-square.svg';
import PuzzleXSmallIcon from './ico-puzzle-xs.svg';
import Ranking1stIcon from './ico-ranking-1st.svg';
import Ranking2ndIcon from './ico-ranking-2nd.svg';
import Ranking3rdIcon from './ico-ranking-3rd.svg';
import RankingPuzzleIcon from './ico-ranking-puzzle.svg';
import RankingRatingIcon from './ico-ranking-rating.svg';
import RankingIcon from './ico-ranking.svg';
import RefreshIcon from './ico-refresh.svg';
import SettingIcon from './ico-setting.svg';
import StoneBlackIcon from './ico-stone-black.svg';
import StoneWhiteIcon from './ico-stone-white.svg';
import TimerIcon from './ico-timer.svg';
import TrainingIcon from './ico-training.svg';
import UnauthenticatedIcon from './ico-unauthenticated.svg';
import ViewIcon from './ico-view.svg';
import WasteBinIcon from './ico-waste-bin.svg';

const Icons = {
  AlertIcon,
  ArchiveIcon,
  AuthenticatedUserIcon,
  AuthenticatedIcon,
  BestUserIcon,
  BookShelfIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CommunityIcon,
  ConfusedActiveIcon,
  ConfusedInactiveIcon,
  CorrectIcon,
  DepthIcon,
  FocusIcon,
  HashTagIcon,
  HeartActiveIcon,
  HeartInactiveIcon,
  HeartMediumIcon,
  HeartSmallIcon,
  HotIcon,
  IncorrectIcon,
  LightbulbAlertIcon,
  LightbulbIcon,
  LightningIcon,
  LockIcon,
  NormalUserIcon,
  NoticeIcon,
  PlusIcon,
  ProUserIcon,
  PuzzlePlusIcon,
  PuzzleSquareIcon,
  PuzzleXSmallIcon,
  Ranking1stIcon,
  Ranking2ndIcon,
  Ranking3rdIcon,
  RankingPuzzleIcon,
  RankingRatingIcon,
  RankingIcon,
  RefreshIcon,
  SettingIcon,
  StoneBlackIcon,
  StoneWhiteIcon,
  TimerIcon,
  TrainingIcon,
  UnauthenticatedIcon,
  ViewIcon,
  WasteBinIcon,
} as const;

export default Icons;
export type IconName = keyof typeof Icons;

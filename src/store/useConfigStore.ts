import { create } from 'zustand';
import { AppDataItem, getAppData } from '../apis/config';

interface ConfigStoreState {
  feedbackUrl: string | null;
  iosStoreUrl: string | null;
  androidStoreUrl: string | null;
  privacyPolicyUrl: string | null;
  termsOfUseUrl: string | null;
  attendanceReward: number | null;
  changeNicknamePrice: number | null;
  communityReward: number | null;
  hintPrice: number | null;
  rankReward: number | null;
  trainingReward: number | null;

  // 서버에서 앱 설정(링크, 보상·가격)을 불러와 스토어를 갱신. 토큰이 필요하여 자동 로그인과 로그인 직후에 호출
  loadAppData: () => Promise<void>;
}

const findAppDataValue = (appData: AppDataItem[], tag: string) =>
  appData.find((item) => item.tag === tag)?.value;

const findAppDataNumber = (appData: AppDataItem[], tag: string) => {
  const value = Number(findAppDataValue(appData, tag));
  return Number.isFinite(value) ? value : undefined;
};

const useConfigStore = create<ConfigStoreState>((set) => ({
  feedbackUrl: null,
  iosStoreUrl: null,
  androidStoreUrl: null,
  privacyPolicyUrl: null,
  termsOfUseUrl: null,
  attendanceReward: null,
  changeNicknamePrice: null,
  communityReward: null,
  hintPrice: null,
  rankReward: null,
  trainingReward: null,

  loadAppData: async () => {
    try {
      const appData = await getAppData();
      const value = (tag: string) => findAppDataValue(appData, tag);
      const number = (tag: string) => findAppDataNumber(appData, tag);

      // 서버에 없는 항목은 이전 값을 그대로 둔다
      set((state) => ({
        feedbackUrl: value('feedback_url') || state.feedbackUrl,
        iosStoreUrl: value('ios_store_url') ?? state.iosStoreUrl,
        androidStoreUrl: value('android_store_url') ?? state.androidStoreUrl,
        privacyPolicyUrl: value('privacy_policy_url') ?? state.privacyPolicyUrl,
        termsOfUseUrl: value('terms_of_use_url') ?? state.termsOfUseUrl,
        attendanceReward: number('attendance_reward') ?? state.attendanceReward,
        changeNicknamePrice: number('change_nickname_price') ?? state.changeNicknamePrice,
        communityReward: number('community_reward') ?? state.communityReward,
        hintPrice: number('hint_price') ?? state.hintPrice,
        rankReward: number('rank_reward') ?? state.rankReward,
        trainingReward: number('training_reward') ?? state.trainingReward,
      }));
    } catch (error) {
      console.log('설정 로드 실패:', error);
    }
  },
}));

export default useConfigStore;

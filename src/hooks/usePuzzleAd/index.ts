const AD_UNIT_ID = 'ca-app-pub-8517144519151386/4005306762';
const AD_TRIGGER_COUNT = 3; // Show ad every 3 solves

type InterstitialAdInstance = {
  loaded: boolean;
  load: () => void;
  show: () => void;
  addAdEventListener: (eventType: string, listener: () => void) => () => void;
};

let interstitial: InterstitialAdInstance | null = null;
let adEventType: { CLOSED: string } | null = null;
let globalSolveCount = 0;

const getInterstitial = () => {
  if (__DEV__) {
    return null;
  }

  if (!interstitial) {
    const { InterstitialAd, AdEventType } = require('react-native-google-mobile-ads');

    adEventType = AdEventType;
    const createdInterstitial: InterstitialAdInstance = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    createdInterstitial.load();
    createdInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
      interstitial?.load();
    });
    interstitial = createdInterstitial;
  }

  return interstitial;
};

export const usePuzzleAd = () => {
  const showAdIfReady = (onAdFinished: () => void) => {
    if (__DEV__) {
      onAdFinished();
      return;
    }

    const currentInterstitial = getInterstitial();

    if (!currentInterstitial || !adEventType) {
      onAdFinished();
      return;
    }

    globalSolveCount += 1;
    console.log(
      `현재 퍼즐 푼 횟수: ${globalSolveCount}, 광고 로드 상태: ${currentInterstitial.loaded}`,
    );

    if (globalSolveCount % AD_TRIGGER_COUNT === 0 && currentInterstitial.loaded) {
      const unsubscribeCallback = currentInterstitial.addAdEventListener(adEventType.CLOSED, () => {
        onAdFinished();
        unsubscribeCallback();
      });
      currentInterstitial.show();
    } else {
      onAdFinished();
    }
  };

  return { showAdIfReady };
};

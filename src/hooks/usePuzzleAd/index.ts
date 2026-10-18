import { useCallback } from 'react';

const AD_UNIT_ID = 'ca-app-pub-8517144519151386/4005306762';
const AD_TRIGGER_COUNT = 3; // Show ad every 3 solves
const AD_RELOAD_DELAY_MS = 30 * 1000;

type InterstitialAdInstance = {
  loaded: boolean;
  load: () => void;
  show: () => Promise<void>;
  addAdEventListener: (eventType: string, listener: () => void) => () => void;
};

let interstitial: InterstitialAdInstance | null = null;
let adEventType: { CLOSED: string; ERROR: string } | null = null;
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
    // 불러오거나 보여주는 데 실패하면 다시 불러오지 않아 그 뒤로 광고가 안 나오므로, 잠시 뒤 다시 불러온다
    createdInterstitial.addAdEventListener(AdEventType.ERROR, () => {
      setTimeout(() => interstitial?.load(), AD_RELOAD_DELAY_MS);
    });
    interstitial = createdInterstitial;
  }

  return interstitial;
};

export const usePuzzleAd = () => {
  const showAdIfReady = useCallback((onAdFinished: () => void) => {
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
      let isFinished = false;
      const finish = () => {
        if (isFinished) {
          return;
        }
        isFinished = true;
        unsubscribeClosed();
        unsubscribeError();
        onAdFinished();
      };
      const unsubscribeClosed = currentInterstitial.addAdEventListener(adEventType.CLOSED, finish);
      // 보여주지 못하면 닫힘 이벤트가 오지 않으므로 바로 다음으로 넘어간다
      const unsubscribeError = currentInterstitial.addAdEventListener(adEventType.ERROR, finish);
      Promise.resolve()
        .then(() => currentInterstitial.show())
        .catch(finish);
    } else {
      onAdFinished();
    }
  }, []);

  return { showAdIfReady };
};

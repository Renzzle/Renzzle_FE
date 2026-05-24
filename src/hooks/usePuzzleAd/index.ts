import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-8517144519151386/4005306762';
// Ad instance
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

// Initial load
interstitial.load();

// Reload the next ad when the user closes the current one
interstitial.addAdEventListener(AdEventType.CLOSED, () => {
  interstitial.load();
});

let globalSolveCount = 0;
const AD_TRIGGER_COUNT = 3; // Show ad every 3 solves

export const usePuzzleAd = () => {
  const showAdIfReady = (onAdFinished: () => void) => {
    globalSolveCount += 1;
    console.log(`현재 퍼즐 푼 횟수: ${globalSolveCount}, 광고 로드 상태: ${interstitial.loaded}`);

    if (globalSolveCount % AD_TRIGGER_COUNT === 0 && interstitial.loaded) {
      const unsubscribeCallback = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        onAdFinished();
        unsubscribeCallback();
      });
      interstitial.show();
    } else {
      onAdFinished();
    }
  };

  return { showAdIfReady };
};

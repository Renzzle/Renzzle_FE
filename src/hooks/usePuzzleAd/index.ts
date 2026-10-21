import { useCallback } from 'react';
import { Platform } from 'react-native';
import mobileAds, { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import usePurchaseStore from '../../store/usePurchaseStore';

const AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: 'ca-app-pub-8517144519151386/4759154965',
      android: 'ca-app-pub-8517144519151386/4005306762',
    })!;
const AD_TRIGGER_COUNT = 3; // Show ad every 3 solves
const AD_RELOAD_DELAY_MS = 30 * 1000;

let interstitial: InterstitialAd | null = null;
let initialization: Promise<void> | null = null;
let globalSolveCount = 0;

const getInterstitial = () => {
  if (!interstitial && !initialization) {
    // 초기화 중에도 퍼즐 진행은 계속하고, SDK가 준비된 뒤에만 광고를 요청한다.
    initialization = mobileAds()
      .initialize()
      .then(() => {
        const createdInterstitial = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
          requestNonPersonalizedAdsOnly: true,
        });

        createdInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
          createdInterstitial.load();
        });
        // 불러오거나 보여주는 데 실패하면 잠시 뒤 다시 불러온다.
        createdInterstitial.addAdEventListener(AdEventType.ERROR, () => {
          setTimeout(() => createdInterstitial.load(), AD_RELOAD_DELAY_MS);
        });
        createdInterstitial.load();
        interstitial = createdInterstitial;
      })
      .catch((error) => {
        initialization = null;
        console.warn('광고 SDK 초기화 실패:', error);
      });
  }

  return interstitial;
};

export const usePuzzleAd = () => {
  const showAdIfReady = useCallback((onAdFinished: () => void) => {
    if (usePurchaseStore.getState().isAdsRemoved) {
      onAdFinished();
      return;
    }

    globalSolveCount += 1;
    const currentInterstitial = getInterstitial();

    if (!currentInterstitial) {
      onAdFinished();
      return;
    }

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
      const unsubscribeClosed = currentInterstitial.addAdEventListener(AdEventType.CLOSED, finish);
      // 보여주지 못하면 닫힘 이벤트가 오지 않으므로 바로 다음으로 넘어간다
      const unsubscribeError = currentInterstitial.addAdEventListener(AdEventType.ERROR, finish);
      Promise.resolve()
        .then(() => currentInterstitial.show())
        .catch(finish);
    } else {
      onAdFinished();
    }
  }, []);

  return { showAdIfReady };
};

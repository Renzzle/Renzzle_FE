import React, { useCallback, useEffect, useRef } from 'react';
import { Container, ListWrapper, UserInfoWrapper } from './index.styles';
import CustomListItem from '../../components/common/CustomListItem';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../store/useUserStore';
import { CustomModal, CustomText } from '../../components/common';
import { Linking, Platform } from 'react-native';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useModal from '../../hooks/useModal';
import { deleteUser } from '../../apis/user';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import useAuthStore from '../../store/useAuthStore';
import useConfigStore from '../../store/useConfigStore';
import usePurchaseStore from '../../store/usePurchaseStore';
import {
  ErrorCode,
  getAvailablePurchases as getAvailableIapPurchases,
  isUserCancelledError,
  useIAP,
} from 'react-native-iap';
import { IAP_PRODUCT_IDS } from '../../constants/iap';

const EXTERNAL_URLS = {
  DEFAULT_FEEDBACK: 'https://forms.gle/NTVoFDAxy498yTv17',
  PRIVACY_POLICY: 'https://renzzle.github.io/Renzzle_Policy/privacy-policy.html',
  TERMS_OF_USE: 'https://renzzle.github.io/Renzzle_Policy/terms-of-use.html',
};

const Settings = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const { feedbackUrl, privacyPolicyUrl, termsOfUseUrl } = useConfigStore();
  const { clearTokens } = useAuthStore();
  const { isAdsRemoved, setAdsRemoved } = usePurchaseStore(); // TODO: 추후 api로 광고제거 정보 불러오게 되면 스토어 삭제
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();

  const restoreRemoveAdsPurchase = useCallback(async () => {
    try {
      const purchases = await getAvailableIapPurchases();
      const hasRemoveAds = purchases.some(
        (purchase) => purchase.productId === IAP_PRODUCT_IDS.REMOVE_ADS,
      );

      if (hasRemoveAds) {
        await setAdsRemoved(true);
        showBottomToast('success', t('toast.removeAdsRestored'));
      }
    } catch (error) {
      console.log('광고 제거 구매 복원 실패:', error);
      showBottomToast('error', t('toast.purchaseFailed'));
    }
  }, [setAdsRemoved, t]);

  const { connected, products, getProducts, requestPurchase, finishTransaction } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      if (purchase.productId !== IAP_PRODUCT_IDS.REMOVE_ADS) {
        return;
      }

      try {
        await setAdsRemoved(true); // TODO: 추후 광고제거상태 전달 api로 수정
        await finishTransaction({
          purchase,
          isConsumable: false,
        });
        showBottomToast('success', t('toast.purchaseComplete'));
      } catch (error) {
        console.log('광고 제거 구매 처리 실패:', error);
        showBottomToast('error', t('toast.purchaseFailed'));
      }
    },
    onPurchaseError: async (error) => {
      const isCancelled =
        isUserCancelledError(error) ||
        error?.code === ErrorCode.E_USER_CANCELLED ||
        error?.message?.toLowerCase().includes('cancel');
      if (isCancelled) {
        return;
      }

      if (error.code === ErrorCode.E_ALREADY_OWNED) {
        await restoreRemoveAdsPurchase();
        return;
      }

      console.log('광고 제거 구매 실패:', error);
      showBottomToast('error', t('toast.purchaseFailed'));
    },
  });
  const getProductsRef = useRef(getProducts);

  useEffect(() => {
    getProductsRef.current = getProducts;
  }, [getProducts]);

  useEffect(() => {
    if (!connected) {
      return;
    }

    getProductsRef.current({ skus: [IAP_PRODUCT_IDS.REMOVE_ADS] });
  }, [connected]);

  const handleRemoveAds = async () => {
    if (isAdsRemoved) {
      showBottomToast('info', t('toast.adsAlreadyRemoved'));
      return;
    }

    if (!connected) {
      showBottomToast('error', t('toast.storeNotConnected'));
      return;
    }

    const removeAdsProduct = products.find(
      (product) => product.productId === IAP_PRODUCT_IDS.REMOVE_ADS,
    );

    if (!removeAdsProduct) {
      showBottomToast('error', t('toast.productUnavailable'));
      return;
    }

    try {
      if (Platform.OS === 'android') {
        await requestPurchase({ skus: [IAP_PRODUCT_IDS.REMOVE_ADS] });
      } else {
        await requestPurchase({ sku: IAP_PRODUCT_IDS.REMOVE_ADS });
      }
    } catch (error: any) {
      const isCancelled =
        isUserCancelledError(error) ||
        error?.code === ErrorCode.E_USER_CANCELLED ||
        error?.message?.toLowerCase().includes('cancel');
      if (isCancelled) {
        return;
      }

      console.log('광고 제거 구매 요청 실패:', error);
      showBottomToast('error', t('toast.purchaseFailed'));
    }
  };

  const openExternalUrl = async (url: string, errorMessage: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        throw new Error('Invalid URL');
      }

      await Linking.openURL(url);
    } catch (e) {
      console.log(errorMessage, e);
      showBottomToast('error', t('toast.cannotOpenPage'));
    }
  };

  const handleFeedback = () => {
    openExternalUrl(feedbackUrl ?? EXTERNAL_URLS.DEFAULT_FEEDBACK, '피드백 열기 실패:');
  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      await clearTokens();
    } catch (error) {
      showBottomToast('error', t('toast.withdrawFailed'));
    }
  };

  const handleUserDelete = () => {
    activateModal('USER_DELETE_CONFIRM', {
      primaryAction: handleDelete,
    });
  };

  const menuItems = [
    { label: t('settings.gameGuide'), onPress: () => navigation.navigate('Tutorial') },
    { label: t('settings.language'), onPress: () => navigation.navigate('Language') },
    { label: t('settings.changeNickname'), onPress: () => navigation.navigate('ChangeNickname') },
    { label: t('settings.changePassword'), onPress: () => navigation.navigate('ChangePassword') },
    { label: t('settings.removeAds'), onPress: () => handleRemoveAds },
    {
      label: t('settings.privacyPolicy'),
      onPress: () =>
        openExternalUrl(
          privacyPolicyUrl ?? EXTERNAL_URLS.PRIVACY_POLICY,
          '개인정보처리방침 열기 실패:',
        ),
    },
    {
      label: t('settings.termsOfService'),
      onPress: () =>
        openExternalUrl(termsOfUseUrl ?? EXTERNAL_URLS.TERMS_OF_USE, '이용약관 열기 실패:'),
    },
    { label: t('settings.feedback'), onPress: handleFeedback },
    { label: t('settings.deleteAccount'), onPress: handleUserDelete },
  ];

  return (
    <Container>
      <UserInfoWrapper>
        <CustomText size={22} weight="bold">
          {user?.nickname}
        </CustomText>
        <CustomText size={12} color="gray/gray500">
          {user?.email}
        </CustomText>
      </UserInfoWrapper>

      <ListWrapper>
        {menuItems.map((item, index) => (
          <CustomListItem key={index} onPress={item.onPress}>
            <CustomText size={14} lineHeight="sm">
              {item.label}
            </CustomText>
          </CustomListItem>
        ))}
      </ListWrapper>

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
      />
    </Container>
  );
};

export default Settings;

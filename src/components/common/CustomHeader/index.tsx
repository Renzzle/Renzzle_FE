import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import { getMenuTypeByRouteName } from '../../../constants/menuThemeMap';
import {
  CurrencyWrapper,
  HeaderContainer,
  MenuWrapper,
  PurchaseOptionButton,
  PurchaseOptionList,
} from './index.styles';
import MenuButton from '../../features/MenuButton';
import CustomText from '../CustomText';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../../store/useUserStore';
import Icon from '../Icon';
import theme from '../../../styles/theme';
import CustomModal from '../CustomModal';
import useModal from '../../../hooks/useModal';
import usePiecePurchase from '../../../hooks/usePiecePurchase';
import { PIECE_PRODUCTS } from '../../../constants/iap';

const CustomHeader: React.FC<NativeStackHeaderProps> = ({ options, route }) => {
  const { t } = useTranslation();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const user = useUserStore((state) => state.user);
  const { products, selectedProductId, purchasePiece } = usePiecePurchase({
    onPurchaseComplete: closePrimarily,
  });

  const isHome = route.name === 'Home';

  // 본문 Container가 gray/grayBG인 화면들. 헤더 배경을 본문과 통일하기 위한 목록으로,
  // 새 화면을 추가할 때 본문이 grayBG라면 여기에도 함께 추가해야 한다.
  const grayBGRoutes = [
    'Signup',
    'FindPassword',
    'TrainingPuzzleSolve',
    'CommunityPuzzleSolve',
    'CreateCommunityPuzzle',
    'AnswerCommunityPuzzle',
    'RankedPuzzleSolve',
    'RankedPuzzleReview',
    'PuzzleReview',
    'TrainingPuzzleReview',
    'TrainingPuzzleViewAnswer',
    'CommunityPuzzleReview',
    'CommunityPuzzleViewAnswer',
    'ChangeNickname',
    'ChangePassword',
  ];
  const backgroundColor = grayBGRoutes.includes(route.name)
    ? theme.color['gray/grayBG']
    : theme.color['gray/grayBGDim'];

  const matchedType = getMenuTypeByRouteName(route.name);

  const handlePuzzleClick = () => {
    activateModal('PIECE_PURCHASE', { primaryAction: () => {} });
  };

  const renderLeftContent = () => {
    if (isHome) {
      return (
        <CustomText size={16} lineHeight="sm">
          {user?.nickname}
        </CustomText>
      );
    }

    return (
      <>
        {matchedType && <MenuButton type={matchedType} size={30} />}
        <CustomText size={18} lineHeight="sm">
          {options.title && t(options.title)}
        </CustomText>
      </>
    );
  };

  const renderRightContent = () => {
    if (user) {
      return (
        <>
          <CustomText size={12} weight="bold" lineHeight="sm" color="main_color/blue_p">
            {user?.currency}
            {user && t('puzzle.piece')}
          </CustomText>
          <Icon
            name="PuzzlePlusIcon"
            color="main_color/blue_p"
            size={22}
            onPress={handlePuzzleClick}
          />
        </>
      );
    }
  };

  return (
    <HeaderContainer backgroundColor={backgroundColor}>
      <MenuWrapper>{renderLeftContent()}</MenuWrapper>
      <CurrencyWrapper>{renderRightContent()}</CurrencyWrapper>

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}>
        <PurchaseOptionList>
          {PIECE_PRODUCTS.map((product) => {
            const storeProduct = products.find((item) => item.productId === product.productId);
            const priceText = storeProduct?.localizedPrice ?? '-';
            const isDisabled = selectedProductId !== null;
            const textColor = isDisabled ? 'gray/gray400' : 'gray/gray900';
            const priceColor = isDisabled ? 'gray/gray400' : 'main_color/blue_p';

            return (
              <PurchaseOptionButton
                key={product.productId}
                disabled={isDisabled}
                onPress={() => purchasePiece(product.productId)}>
                <CustomText size={14} weight="bold" lineHeight="sm" color={textColor}>
                  {product.pieces}
                  {t('puzzle.piece')}
                </CustomText>
                <CustomText size={14} weight="bold" lineHeight="sm" color={priceColor}>
                  {priceText}
                </CustomText>
              </PurchaseOptionButton>
            );
          })}
        </PurchaseOptionList>
      </CustomModal>
    </HeaderContainer>
  );
};

export default CustomHeader;

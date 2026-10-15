import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView } from 'react-native';
import {
  CommonActions,
  NavigationAction,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  BoardWrapper,
  BottomSpacer,
  Card,
  CardList,
  CardText,
  Container,
  ContentWrapper,
  FeedbackSlot,
  FeedbackText,
  FeedbackWrapper,
  ForbiddenLabel,
  Header,
  HeaderTitle,
  ProgressFill,
  ProgressHeader,
  ProgressTrack,
  ScrollContainer,
  SkipButton,
  TextMeasurer,
  TextWrapper,
} from './index.styles';
import { TUTORIAL_STEPS, TutorialStep } from './steps';
import { BottomButtonBar, CustomModal, CustomText, Icon } from '../../components/common';
import MenuButton from '../../components/features/MenuButton';
import TutorialBoard, { PlacedStone } from '../../components/features/TutorialBoard';
import useModal from '../../hooks/useModal';
import useTutorialStore from '../../store/useTutorialStore';
import { menuThemeMap, MenuType, RootStackParamList } from '../../types';

const MODE_MENUS: MenuType[] = ['trainingPuzzle', 'communityPuzzle', 'rankingPuzzle'];
const FORBIDDEN_TYPES = ['doubleThree', 'doubleFour', 'overline'] as const;
const BOARD_STEPS = TUTORIAL_STEPS.filter((tutorialStep) => tutorialStep.board);

const Tutorial = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Tutorial'>>();
  const isFirstRun = route.params?.isFirstRun ?? false;
  const setTutorialPending = useTutorialStore((state) => state.setTutorialPending);
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();

  const scrollRef = useRef<ScrollView>(null);
  // 튜토리얼을 끝내거나 건너뛰어 나가는 중에는 beforeRemove에서 막지 않는다
  const isLeavingRef = useRef(false);

  const [stepIndex, setStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isHintVisible, setIsHintVisible] = useState(false);
  // 보드가 있는 단계 중 가장 긴 글 영역의 높이. 보드 단계에서 이 높이를 확보해 보드 위치를 고정한다
  // (카드만 있는 단계는 카드가 글 바로 아래에 오도록 확보하지 않는다)
  const [textAreaHeight, setTextAreaHeight] = useState(0);

  const step = TUTORIAL_STEPS[stepIndex];
  const { interaction } = step;
  const isLastStep = stepIndex === TUTORIAL_STEPS.length - 1;
  const isCompleted = completedSteps.includes(stepIndex);

  const placedStone = useMemo<PlacedStone | null>(
    () =>
      interaction && isCompleted
        ? {
            position: interaction.target,
            stone: interaction.stone,
            isForbidden: interaction.outcome === 'lose',
          }
        : null,
    [interaction, isCompleted],
  );

  const leaveTutorial = useCallback(
    (action?: NavigationAction) => {
      isLeavingRef.current = true;
      if (isFirstRun) {
        setTutorialPending(false);
      }

      if (action) {
        navigation.dispatch(action);
      } else {
        navigation.goBack();
      }
    },
    [isFirstRun, navigation, setTutorialPending],
  );

  const confirmSkip = useCallback(
    (action?: NavigationAction) => {
      activateModal('TUTORIAL_SKIP_CONFIRM', {
        primaryAction: () => leaveTutorial(action),
      });
    },
    [activateModal, leaveTutorial],
  );

  // 첫 실행은 렌주룰을 아는지 확인한 뒤 나가고, 설정에서 직접 연 경우는 바로 닫는다
  const handleSkip = () => {
    if (isFirstRun) {
      confirmSkip();
      return;
    }

    leaveTutorial();
  };

  useEffect(() => {
    if (!isFirstRun) {
      return;
    }

    // iOS 스와이프 뒤로가기는 beforeRemove로 막을 수 없어서 첫 실행에서는 제스처를 끈다
    navigation.setOptions({ gestureEnabled: false });
  }, [isFirstRun, navigation]);

  useEffect(() => {
    if (!isFirstRun) {
      return;
    }

    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (isLeavingRef.current) {
        return;
      }

      event.preventDefault();
      confirmSkip(event.data.action);
    });

    return unsubscribe;
  }, [confirmSkip, isFirstRun, navigation]);

  const goToStep = (index: number) => {
    setStepIndex(index);
    setIsHintVisible(false);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  // 결과 문구 자리는 미리 확보되어 있어서, 내용이 화면보다 긴 작은 기기에서만 실제로 스크롤된다
  const revealFeedback = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const handlePlace = (position: string) => {
    if (!interaction || isCompleted) {
      return;
    }

    if (position !== interaction.target) {
      setIsHintVisible(true);
      revealFeedback();
      return;
    }

    setIsHintVisible(false);
    setCompletedSteps((prev) => [...prev, stepIndex]);
    revealFeedback();
  };

  const handleTextAreaLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setTextAreaHeight((prev) => Math.max(prev, height));
  };

  // 튜토리얼을 닫고 Home 위에 트레이닝 팩 화면을 연다 (설정에서 들어온 경우에도 뒤로가기 시 Home으로)
  const handleStartTraining = () => {
    const homeRoute = navigation.getState().routes.find((r) => r.name === 'Home');

    leaveTutorial(
      CommonActions.reset({
        index: 1,
        // 기존 Home의 key를 유지해 홈 화면이 다시 마운트되지 않도록 한다
        routes: [{ key: homeRoute?.key, name: 'Home' }, { name: 'TrainingPacks' }],
      }),
    );
  };

  const transitions = isLastStep
    ? [
        { text: t('tutorial.close'), onAction: () => leaveTutorial() },
        { text: t('tutorial.startTraining'), onAction: handleStartTraining },
      ]
    : [
        {
          text: t('tutorial.prev'),
          onAction: () => goToStep(stepIndex - 1),
          disabled: stepIndex === 0,
        },
        {
          text: t('tutorial.next'),
          onAction: () => goToStep(stepIndex + 1),
          disabled: !!interaction && !isCompleted,
        },
      ];

  const renderStepText = (targetStep: TutorialStep) => {
    const descriptionKey = `tutorial.steps.${targetStep.key}.description`;

    return (
      <>
        <CustomText size={20} weight="bold" lineHeight="md">
          {t(`tutorial.steps.${targetStep.key}.title`)}
        </CustomText>
        {i18n.exists(descriptionKey) && (
          <CustomText size={14} lineHeight="lg" color="gray/gray600">
            {t(descriptionKey)}
          </CustomText>
        )}
      </>
    );
  };

  const renderVisual = () => {
    if (step.visual === 'modes') {
      return (
        <CardList>
          {MODE_MENUS.map((menu) => {
            const { titleKey } = menuThemeMap[menu];

            return (
              <Card key={menu}>
                <MenuButton type={menu} size={48} />
                <CardText>
                  <CustomText size={16} weight="bold" lineHeight="sm">
                    {t(titleKey)}
                  </CustomText>
                  <CustomText size={12} lineHeight="md" color="gray/gray600">
                    {t(`${titleKey}Description`)}
                  </CustomText>
                </CardText>
              </Card>
            );
          })}
        </CardList>
      );
    }

    if (step.visual === 'forbiddenSummary') {
      return (
        <CardList>
          {FORBIDDEN_TYPES.map((type) => (
            <Card key={type}>
              <ForbiddenLabel>
                <CustomText size={14} weight="bold" lineHeight="sm" color="error/error_color">
                  {t(`tutorial.forbiddenSummary.${type}.label`)}
                </CustomText>
              </ForbiddenLabel>
              <CardText>
                <CustomText size={14} lineHeight="md">
                  {t(`tutorial.forbiddenSummary.${type}.description`)}
                </CustomText>
              </CardText>
            </Card>
          ))}
        </CardList>
      );
    }

    return null;
  };

  const renderFeedback = () => {
    if (interaction && isCompleted) {
      const isLose = interaction.outcome === 'lose';
      const color = isLose ? 'error/error_color' : 'main_color/blue_p';

      return (
        <FeedbackWrapper>
          <Icon name={isLose ? 'IncorrectIcon' : 'CorrectIcon'} color={color} size={20} />
          <FeedbackText>
            <CustomText
              size={14}
              weight="bold"
              lineHeight="md"
              color={color}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}>
              {t(`tutorial.steps.${step.key}.result`)}
            </CustomText>
          </FeedbackText>
        </FeedbackWrapper>
      );
    }

    if (isHintVisible) {
      return (
        <FeedbackWrapper>
          <Icon name="InfoIcon" color="gray/gray500" size={16} />
          <FeedbackText>
            <CustomText
              size={12}
              lineHeight="md"
              color="gray/gray500"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}>
              {t('tutorial.placeHint')}
            </CustomText>
          </FeedbackText>
        </FeedbackWrapper>
      );
    }

    return null;
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>
          <MenuButton type="tutorial" size={30} />
          <CustomText size={18} lineHeight="sm">
            {t('settings.gameGuide')}
          </CustomText>
        </HeaderTitle>
        {!isLastStep && (
          <SkipButton onPress={handleSkip} hitSlop={10}>
            <CustomText size={14} weight="bold" lineHeight="sm" color="gray/gray500">
              {t('tutorial.skip')}
            </CustomText>
          </SkipButton>
        )}
      </Header>

      <ScrollContainer ref={scrollRef} showsVerticalScrollIndicator={false}>
        <TextMeasurer
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants">
          {BOARD_STEPS.map((tutorialStep) => (
            <TextWrapper key={tutorialStep.key} onLayout={handleTextAreaLayout}>
              {renderStepText(tutorialStep)}
            </TextWrapper>
          ))}
        </TextMeasurer>

        <ContentWrapper>
          <ProgressHeader>
            <CustomText size={12} weight="bold" lineHeight="sm" color="main_color/blue_p">
              {t(`tutorial.chapter.${step.chapter}`)}
            </CustomText>
            <CustomText size={12} lineHeight="sm" color="gray/gray500">
              {stepIndex + 1} / {TUTORIAL_STEPS.length}
            </CustomText>
          </ProgressHeader>

          <ProgressTrack>
            <ProgressFill progress={(stepIndex + 1) / TUTORIAL_STEPS.length} />
          </ProgressTrack>

          <TextWrapper minHeight={step.board ? textAreaHeight : 0}>
            {renderStepText(step)}
          </TextWrapper>
        </ContentWrapper>

        {renderVisual()}

        {step.board && (
          <BoardWrapper>
            <TutorialBoard
              key={stepIndex}
              black={step.board.black}
              white={step.board.white}
              forbidden={step.board.forbidden}
              target={interaction?.target}
              placedStone={placedStone}
              onPlace={interaction && !isCompleted ? handlePlace : undefined}
            />
          </BoardWrapper>
        )}

        {step.board && <FeedbackSlot>{renderFeedback()}</FeedbackSlot>}

        <BottomSpacer />
      </ScrollContainer>

      <BottomButtonBar transitions={transitions} />

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
      />
    </Container>
  );
};

export default Tutorial;

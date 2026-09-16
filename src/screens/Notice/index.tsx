import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Container,
  DateWrapper,
  EmptyContainer,
  NoticeHeader,
  NoticeItemContent,
  NoticeTitleWrapper,
  ListSeparator,
  LoadingContainer,
  NoticeContentWrapper,
} from './index.styles';
import { CustomText } from '../../components/common';
import CustomListItem from '../../components/common/CustomListItem';
import { NoticeItem, NoticeLanguage } from '../../types';
import theme from '../../styles/theme';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { getPublicNotices } from '../../apis/notice';

const normalizeNoticeLanguage = (language: string): NoticeLanguage => {
  const languageCode = language.split('-')[0];

  const languageMap: Record<string, NoticeLanguage> = {
    ko: 'KO',
    en: 'EN',
    ja: 'JP',
    jp: 'JP',
  };

  return languageMap[languageCode] ?? 'EN';
};

const getExpiredAtTime = (expiredAt: string): number | null => {
  if (!expiredAt) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(expiredAt)) {
    return new Date(`${expiredAt}T23:59:59.999`).getTime();
  }

  const time = new Date(expiredAt.replace(' ', 'T')).getTime();

  return Number.isNaN(time) ? null : time;
};

const isActiveNotice = (notice: NoticeItem, now = Date.now()) => {
  const expiredAtTime = getExpiredAtTime(notice.expiredAt);

  return expiredAtTime === null || now <= expiredAtTime;
};

const Notice = () => {
  const { t, i18n } = useTranslation();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [expandedNoticeKey, setExpandedNoticeKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const noticeLanguage = useMemo(() => normalizeNoticeLanguage(i18n.language), [i18n.language]);

  const fetchNotices = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const data = await getPublicNotices(noticeLanguage);
        setNotices(data.filter((notice) => isActiveNotice(notice)));
      } catch (error) {
        showBottomToast('error', t('toast.noticeLoadFailed'));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [noticeLanguage, t],
  );

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotices(false);
  };

  const listContentContainerStyle = notices.length ? undefined : styles.emptyListContent;

  const getNoticeKey = (item: NoticeItem, index: number) =>
    `${item.title}-${item.createdAt}-${index}`;

  const handlePressNotice = (noticeKey: string) => {
    setExpandedNoticeKey((prev) => (prev === noticeKey ? null : noticeKey));
  };

  const renderNotice = ({ item, index }: { item: NoticeItem; index: number }) => {
    const noticeKey = getNoticeKey(item, index);
    const isExpanded = expandedNoticeKey === noticeKey;

    return (
      <CustomListItem onPress={() => handlePressNotice(noticeKey)}>
        <NoticeItemContent>
          <NoticeHeader>
            <NoticeTitleWrapper>
              <CustomText
                size={16}
                weight="bold"
                lineHeight="md"
                numberOfLines={isExpanded ? undefined : 1}>
                {item.title}
              </CustomText>
            </NoticeTitleWrapper>
          </NoticeHeader>

          {isExpanded && (
            <>
              <NoticeContentWrapper>
                <CustomText size={12} lineHeight="lg" color="gray/gray600">
                  {item.context}
                </CustomText>
              </NoticeContentWrapper>
              <DateWrapper>
                <CustomText size={10} lineHeight="sm" color="gray/gray400">
                  {item.createdAt}
                </CustomText>
              </DateWrapper>
            </>
          )}
        </NoticeItemContent>
      </CustomListItem>
    );
  };

  return (
    <Container>
      {loading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.color['gray/gray300']} />
        </LoadingContainer>
      ) : (
        <FlatList
          data={notices}
          keyExtractor={getNoticeKey}
          renderItem={renderNotice}
          ItemSeparatorComponent={ListSeparator}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          contentContainerStyle={listContentContainerStyle}
          ListEmptyComponent={
            <EmptyContainer>
              <CustomText size={14} color="gray/gray500">
                {t('notice.empty')}
              </CustomText>
            </EmptyContainer>
          }
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  emptyListContent: {
    flexGrow: 1,
  },
});

export default Notice;

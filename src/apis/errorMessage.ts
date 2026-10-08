import i18n from '../locales/i18n';

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

const ERROR_CODE_TO_I18N_KEY: Record<string, string> = {
  G500: 'error.internalServerError',
  G400: 'error.validationError',
  G404: 'error.globalNotFound',
  G405: 'error.methodNotAllowed',
  G415: 'error.unsupportedMediaType',

  S404: 'error.emptyResultError',
  S409: 'error.constraintViolationError',

  A4290: 'error.exceedEmailAuthRequest',
  A4291: 'error.exceedEmailAuthAttempt',
  A4292: 'error.exceedLoginAttempt',
  A4010: 'error.invalidEmailAuthCode',
  A4011: 'error.invalidAuthVerityToken',
  A4012: 'error.invalidEmail',
  A4013: 'error.invalidPassword',
  A4014: 'error.notBearerGrantType',
  A403: 'error.adminAccessDenied',
  A4090: 'error.duplicateEmail',
  A4091: 'error.duplicateNickname',
  A4092: 'error.duplicateDevice',

  J4010: 'error.expiredJwtToken',
  J4011: 'error.malformedJwtToken',
  J4012: 'error.unsupportedJwtToken',
  J4013: 'error.illegalToken',
  J4014: 'error.cannotParseToken',

  U4040: 'error.cannotLoadUserInfo',
  U4041: 'error.levelNotFound',
  U4000: 'error.cannotFindUser',
  U4001: 'error.invalidSubscriptionRequest',
  U4002: 'error.insufficientCurrency',
  U401: 'error.unauthorizedAction',

  I4000: 'error.invalidPaymentRequest',
  I4001: 'error.unsupportedPaymentPlatform',
  I4002: 'error.storeVerificationFailed',
  I4003: 'error.receiptTransactionMismatch',
  I4040: 'error.unknownIapProduct',
  I4090: 'error.alreadyProcessedReceipt',

  P4000: 'error.alreadySolvedPuzzle',
  P4001: 'error.alreadyExistingTranslation',
  P4002: 'error.invalidSessionTtl',
  P4003: 'error.isNotStarted',
  P4005: 'error.noBoardStatus',
  P4006: 'error.invalidAnswerPosition',
  R4004: 'error.invalidRankPuzzleType',
  P4030: 'error.communityPuzzleAccessDenied',
  P4040: 'error.cannotFindCommunityPuzzle',
  P4041: 'error.cannotFindTrainingPuzzle',
  P4042: 'error.noSuchTrainingPack',
  P4043: 'error.noSuchTrainingPacks',
  P4044: 'error.cannotFindPuzzle',
  P4045: 'error.noUserProgressForPack',
  P4046: 'error.cannotFindRankPuzzle',
  P4047: 'error.emptySessionData',
  P4048: 'error.latestPuzzleNotFound',
  P4090: 'error.trendPuzzleDuplicated',
  P429: 'error.exceedDailyPuzzleUpload',
  P4100: 'error.sessionAlreadyEnded',
  P5000: 'error.sessionGenerationFailed',

  N4040: 'error.cannotFindAnnouncement',
};

export const getApiErrorMessage = (errorResponse?: ApiErrorResponse) => {
  const key = errorResponse?.code ? ERROR_CODE_TO_I18N_KEY[errorResponse.code] : undefined;

  if (key && i18n.exists(key)) {
    return i18n.t(key);
  }

  return errorResponse?.message ?? i18n.t('error.internalServerError');
};

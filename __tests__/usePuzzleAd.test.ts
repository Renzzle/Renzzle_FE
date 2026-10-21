const mockInitialize = jest.fn();
const mockCreateAd = jest.fn();
const mockAd = {
  loaded: true,
  load: jest.fn(),
  show: jest.fn().mockResolvedValue(undefined),
  addAdEventListener: jest.fn(() => jest.fn()),
};
let mockIsAdsRemoved = false;

jest.mock('react-native-google-mobile-ads', () => ({
  __esModule: true,
  default: () => ({ initialize: mockInitialize }),
  TestIds: { INTERSTITIAL: 'test-interstitial' },
  InterstitialAd: { createForAdRequest: mockCreateAd },
  AdEventType: { CLOSED: 'closed', ERROR: 'error' },
}));
jest.mock('../src/store/usePurchaseStore', () => ({
  __esModule: true,
  default: { getState: () => ({ isAdsRemoved: mockIsAdsRemoved }) },
}));

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  mockIsAdsRemoved = false;
  mockInitialize.mockResolvedValue([]);
  mockCreateAd.mockReturnValue(mockAd);
});

it('initializes once, waits before loading, and lets puzzles continue while pending', async () => {
  let resolveInitialization!: (value: unknown[]) => void;
  mockInitialize.mockReturnValue(new Promise((resolve) => {
    resolveInitialization = resolve;
  }));
  const { usePuzzleAd } = require('../src/hooks/usePuzzleAd');
  const first = usePuzzleAd();
  const second = usePuzzleAd();
  const onFinished = jest.fn();

  first.showAdIfReady(onFinished);
  second.showAdIfReady(onFinished);
  expect(mockInitialize).toHaveBeenCalledTimes(1);
  expect(mockCreateAd).not.toHaveBeenCalled();
  expect(mockAd.load).not.toHaveBeenCalled();
  expect(onFinished).toHaveBeenCalledTimes(2);

  resolveInitialization([]);
  await flushPromises();
  expect(mockCreateAd).toHaveBeenCalledWith('test-interstitial', {
    requestNonPersonalizedAdsOnly: true,
  });
  expect(mockAd.load).toHaveBeenCalledTimes(1);

  first.showAdIfReady(onFinished);
  await flushPromises();
  expect(mockInitialize).toHaveBeenCalledTimes(1);
  expect(mockAd.show).toHaveBeenCalledTimes(1);
});

it('continues without ads and retries initialization after a failure', async () => {
  mockInitialize.mockRejectedValueOnce(new Error('SDK unavailable'));
  const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    const { usePuzzleAd } = require('../src/hooks/usePuzzleAd');
    const { showAdIfReady } = usePuzzleAd();
    const onFinished = jest.fn();

    showAdIfReady(onFinished);
    await flushPromises();
    expect(onFinished).toHaveBeenCalledTimes(1);
    expect(mockAd.load).not.toHaveBeenCalled();

    showAdIfReady(onFinished);
    await flushPromises();
    expect(mockInitialize).toHaveBeenCalledTimes(2);
    expect(mockAd.load).toHaveBeenCalledTimes(1);
  } finally {
    warning.mockRestore();
  }
});

it('skips SDK initialization for an ad removal purchase', () => {
  mockIsAdsRemoved = true;
  const { usePuzzleAd } = require('../src/hooks/usePuzzleAd');
  const onFinished = jest.fn();

  usePuzzleAd().showAdIfReady(onFinished);
  expect(onFinished).toHaveBeenCalledTimes(1);
  expect(mockInitialize).not.toHaveBeenCalled();
  expect(mockCreateAd).not.toHaveBeenCalled();
});

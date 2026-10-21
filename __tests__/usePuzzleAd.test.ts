const mockInitialize = jest.fn();
const mockCreateAd = jest.fn();
const mockAd = {
  loaded: true,
  load: jest.fn(),
  show: jest.fn().mockResolvedValue(undefined),
  addAdEventListener: jest.fn(() => jest.fn()),
};
let mockUser: { adsRemoved: boolean } | null = { adsRemoved: false };

jest.mock('react-native-google-mobile-ads', () => ({
  __esModule: true,
  default: () => ({ initialize: mockInitialize }),
  TestIds: { INTERSTITIAL: 'test-interstitial' },
  InterstitialAd: { createForAdRequest: mockCreateAd },
  AdEventType: { CLOSED: 'closed', ERROR: 'error' },
}));
jest.mock('../src/store/useUserStore', () => ({
  useUserStore: { getState: () => ({ user: mockUser }) },
}));

const renderPuzzleAd = () => {
  const React = require('react') as typeof import('react');
  const renderer = require('react-test-renderer') as typeof import('react-test-renderer');
  const { usePuzzleAd } = require('../src/hooks/usePuzzleAd');
  let result!: ReturnType<typeof import('../src/hooks/usePuzzleAd').usePuzzleAd>;
  let root!: import('react-test-renderer').ReactTestRenderer;
  const Consumer = () => {
    result = usePuzzleAd();
    return null;
  };

  renderer.act(() => {
    root = renderer.create(React.createElement(Consumer));
  });
  renderer.act(() => root.unmount());
  return result;
};

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  mockUser = { adsRemoved: false };
  mockInitialize.mockResolvedValue([]);
  mockCreateAd.mockReturnValue(mockAd);
});

it('initializes once, waits before loading, and lets puzzles continue while pending', async () => {
  let resolveInitialization!: (value: unknown[]) => void;
  mockInitialize.mockReturnValue(new Promise((resolve) => {
    resolveInitialization = resolve;
  }));
  const first = renderPuzzleAd();
  const second = renderPuzzleAd();
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
    const { showAdIfReady } = renderPuzzleAd();
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

it('skips SDK initialization when the server user has ads removed', () => {
  mockUser = { adsRemoved: true };
  const onFinished = jest.fn();

  renderPuzzleAd().showAdIfReady(onFinished);
  expect(onFinished).toHaveBeenCalledTimes(1);
  expect(mockInitialize).not.toHaveBeenCalled();
  expect(mockCreateAd).not.toHaveBeenCalled();
});

it('skips ads until server user information is available', () => {
  mockUser = null;
  const onFinished = jest.fn();

  renderPuzzleAd().showAdIfReady(onFinished);
  expect(onFinished).toHaveBeenCalledTimes(1);
  expect(mockInitialize).not.toHaveBeenCalled();
});

it('uses updated server user information even when an ad is already loaded', async () => {
  const { showAdIfReady } = renderPuzzleAd();
  const onFinished = jest.fn();

  showAdIfReady(onFinished);
  await flushPromises();
  showAdIfReady(onFinished);

  mockUser = { adsRemoved: true };
  showAdIfReady(onFinished);
  await flushPromises();

  expect(mockAd.show).not.toHaveBeenCalled();
  expect(onFinished).toHaveBeenCalledTimes(3);
});

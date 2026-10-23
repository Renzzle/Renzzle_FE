import React from 'react';
import renderer, { act } from 'react-test-renderer';
import InfiniteScrollList, { ApiCallParams } from '../src/components/common/InfiniteScrollList';

type Item = { id: number };
type FlatListProps = { data: Item[]; onEndReached: () => void };

const mockFlatListRenders: FlatListProps[] = [];

jest.mock('react-native/Libraries/Lists/FlatList', () => ({
  __esModule: true,
  default: (props: FlatListProps) => {
    mockFlatListRenders.push(props);
    return null;
  },
}));
jest.mock('react-i18next', () => {
  // Stable like the real hook, since the list refreshes whenever its callbacks change
  const translation = { t: (key: string) => key };
  return { useTranslation: () => translation };
});
jest.mock('../src/components/common/Toast/toastMessage', () => ({ showBottomToast: jest.fn() }));
jest.mock('../src/components/common/CustomText', () => () => null);

// The server pages by the last item's ID, newest first
const PAGE_SIZE = 10;
const page = (from: number): Item[] =>
  Array.from({ length: PAGE_SIZE }, (_, index) => ({ id: from - index }));

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

it('does not load the first page again from a handler rendered before it arrived', async () => {
  let resolveFirstPage!: (items: Item[]) => void;
  const apiCall = jest.fn((params: ApiCallParams) =>
    params.id == null ? Promise.resolve(page(124)) : Promise.resolve(page(params.id - 1)),
  );
  apiCall.mockImplementationOnce(
    () =>
      new Promise<Item[]>((resolve) => {
        resolveFirstPage = resolve;
      }),
  );

  await act(async () => {
    renderer.create(
      <InfiniteScrollList<Item>
        apiCall={apiCall}
        renderItem={() => <></>}
        keyExtractor={(item) => String(item.id)}
      />,
    );
  });
  // FlatList can call the handler from an earlier render before the list re-renders
  const staleEndReached = mockFlatListRenders[0].onEndReached;

  await act(async () => {
    staleEndReached();
  });
  await act(async () => {
    resolveFirstPage(page(124));
  });
  await act(async () => {
    staleEndReached();
  });

  const { data } = mockFlatListRenders[mockFlatListRenders.length - 1];
  expect(data.map((item) => item.id)).toEqual([...page(124), ...page(114)].map((item) => item.id));
  expect(apiCall).toHaveBeenCalledTimes(2);
  expect(apiCall).toHaveBeenLastCalledWith(expect.objectContaining({ id: 115 }));
});

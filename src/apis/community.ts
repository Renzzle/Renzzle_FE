import { HTTP_HEADERS, HTTP_HEADERS_VALUES, HTTP_METHODS } from './constants';

export const getPuzzle = async (
  id: number,
  size: number,
  sort: string,
  authStore: string,
) => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/community/puzzle?id=${id}&size=${size}&sort=${sort}`, {
      method: HTTP_METHODS.GET,
      headers: {
        [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS_VALUES.JSON,
        [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${authStore}`,
      },
      body: JSON.stringify({ id, size, sort }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};

export const uploadPuzzle = async (
  title: string,
  boardStatus: string,
  depth: number,
  difficulty: string,
  winColor: string,
  authStore: string,
) => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/community/puzzle`, {
      method: HTTP_METHODS.POST,
      headers: {
        [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS_VALUES.JSON,
        [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${authStore}`,
      },
      body: JSON.stringify({ title, boardStatus, depth, difficulty, winColor }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};

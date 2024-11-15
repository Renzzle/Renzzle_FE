import { HTTP_HEADERS, HTTP_HEADERS_VALUES, HTTP_METHODS } from './constants';

export const getPuzzle = async (
  authStore: string,
  size?: number,
  sort?: string,
  id?: number,
) => {
  try {
    const params = new URLSearchParams();
    if (id !== undefined) {params.append('id', id.toString());}
    if (size !== undefined) {params.append('size', size.toString());}
    if (sort !== undefined) {params.append('sort', sort);}

    const response = await fetch(`${process.env.API_URL}/api/community/puzzle?${params.toString()}`, {
      method: HTTP_METHODS.GET,
      headers: {
        [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS_VALUES.JSON,
        [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${authStore}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.errorResponse?.message || 'An unknown error occurred.';
      throw new Error(`HTTP error! status: ${response.status} / message: ${errorMessage}`);
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
      const errorData = await response.json();
      const errorMessage = errorData?.errorResponse?.message || 'An unknown error occurred.';
      const errorCode = errorData?.errorResponse?.code || 'An unknown error occurred.';
      throw new Error(`HTTP error! status: ${response.status} / code: ${errorCode} / message: ${errorMessage}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};

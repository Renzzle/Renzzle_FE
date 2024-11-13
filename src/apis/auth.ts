import { HTTP_HEADERS, HTTP_HEADERS_VALUES, HTTP_METHODS } from './constants';

export const updateEmailAuthCode = async (email: string) => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/auth/email` , {
      method: HTTP_METHODS.POST,
      headers: {
        [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS_VALUES.JSON,
      },
      body: JSON.stringify({ email }),
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

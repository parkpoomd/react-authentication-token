import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';

const baseURL = 'http://localhost:4000';

const originalRequest = async (url, config) => {
  url = `${baseURL}${url}`;
  const response = await fetch(url, config);
  const data = await response.json();
  return {response, data};
};

const refreshToken = async (authTokens) => {
  const response = await fetch('http://localhost:4000/api/token/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({refresh: authTokens.refresh}),
  });
  const data = await response.json();
  localStorage.setItem('authTokens', JSON.stringify(data));
  return data;
};

const customFetcher = async (url, config = {}) => {
  let authTokens = localStorage.getItem('authTokens')
    ? JSON.parse(localStorage.getItem('authTokens'))
    : null;

  const user = jwt_decode(authTokens.access);
  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  if (isExpired) {
    authTokens = await refreshToken(authTokens);
  }

  // Proceed with request

  config['headers'] = {
    Authorization: `Bearer ${authTokens?.access}`,
  };

  const {response, data} = await originalRequest(url, config);
  return {response, data};
};

export default customFetcher;

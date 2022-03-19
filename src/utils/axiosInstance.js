import axios from 'axios';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';

const baseURL = 'http://localhost:4000';

let authTokens = localStorage.getItem('authTokens')
  ? JSON.parse(localStorage.getItem('authTokens'))
  : null;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${authTokens?.access}`,
  },
});

axiosInstance.interceptors.request.use(async (request) => {
  if (!authTokens) {
    authTokens = localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null;
    request.headers.Authorization = `Bearer ${authTokens?.access}`;
  }

  const user = jwt_decode(authTokens.access);
  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  if (!isExpired) return request;

  const response = await axios.post(`${baseURL}/api/token/refresh`, {
    refresh: authTokens.refresh,
  });

  localStorage.setItem('authTokens', JSON.stringify(response.data));
  request.headers.Authorization = `Bearer ${response.data.access}`;
  return request;
});

export default axiosInstance;

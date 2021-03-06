import {useContext} from 'react';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import AuthContext from '../context/AuthContext';

const useFetch = () => {
  let config = {};

  let {authTokens, setAuthTokens, setUser} = useContext(AuthContext);

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
    setAuthTokens(data);
    setUser(jwt_decode(data.access));
    return data;
  };

  const callFetch = async (url) => {
    const user = jwt_decode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (isExpired) {
      authTokens = await refreshToken(authTokens);
    }

    config['headers'] = {
      Authorization: `Bearer ${authTokens?.access}`,
    };

    const {response, data} = await originalRequest(url, config);
  };

  return callFetch;
};

export default useFetch;

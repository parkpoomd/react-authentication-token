import {createContext, useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem('authTokens')
      ? jwt_decode(JSON.parse(localStorage.getItem('authTokens')))
      : null
  );
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    history.push('/login');
  };

  const loginUser = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
      history.push('/');
    } else {
      alert('Something went wrong!');
    }
  };

  // const updateToken = async () => {
  //   console.log('Update token called!');
  //   const response = await fetch('http://localhost:4000/api/token/refresh', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({refresh: authTokens?.refresh}),
  //   });

  //   const data = await response.json();

  //   if (response.status === 200) {
  //     setAuthTokens(data);
  //     setUser(jwt_decode(data.access));
  //     localStorage.setItem('authTokens', JSON.stringify(data));
  //   } else {
  //     logoutUser();
  //   }

  //   if (loading) {
  //     setLoading(false);
  //   }
  // };

  const contextData = {
    authTokens,
    user,
    loginUser,
    logoutUser,
    setUser,
    setAuthTokens,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

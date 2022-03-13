import React, {useContext} from 'react';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const {loginUser} = useContext(AuthContext);

  return (
    <div>
      <form onSubmit={loginUser}>
        <input type="text" name="username" placeholder="Enter Username" />
        <input type="password" name="password" placeholder="Enter Password" />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default LoginPage;

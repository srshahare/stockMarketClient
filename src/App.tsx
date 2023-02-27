import React, { useState, useMemo } from 'react';
import type { NotificationPlacement } from 'antd/es/notification';
import './App.css';
import Home from './containers/Home';
import Login from './containers/Login';
import { notification } from 'antd';
import Layout from './containers/Layout';

const Context = React.createContext({ name: 'Default' });

function App() {
  const [api] = notification.useNotification();

  const openNotification = () => {
    notification.error({
      message: 'Wrong Credentials!',
      description:
        'Username or Password is incorrect!',
    });
  };


  const [isAuth, setAuth] = useState(true)

  const reqEmail = "saidulushaik24@gmail.com"
  const reqPass = "Sushma@123"

  const handleLogin = (values: any) => {
    const { username, password } = values;
    if (username !== reqEmail || password !== reqPass) {
      console.log("wrong username or password")
      return openNotification()
    }
    setAuth(true)
  }
  
  return (
    <div className="App">
        {isAuth ?
          <Layout /> :
          <Login handleLogin={handleLogin} />
        }
    </div>
  );
}

export default App;

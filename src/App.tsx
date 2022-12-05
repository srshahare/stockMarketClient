import React, { useState, useMemo } from 'react';
import type { NotificationPlacement } from 'antd/es/notification';
import './App.css';
import Home from './containers/Home';
import Login from './containers/Login';
import { notification } from 'antd';

const Context = React.createContext({ name: 'Default' });

function App() {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement: NotificationPlacement) => {
    api.error({
      message: `Wrong Credentials!`,
      description: <Context.Consumer>{({ name }) => `Username or Password is incorrect!`}</Context.Consumer>,
      placement,
    });
  };

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);


  const [isAuth, setAuth] = useState(true)

  const reqEmail = "saidulushaik24@gmail.com"
  const reqPass = "Sushma@123"

  const handleLogin = (values: any) => {
    const { username, password } = values;
    if (username !== reqEmail || password !== reqPass) {
      console.log("wrong username or password")
      return openNotification('topRight')
    }
    setAuth(true)
  }

  return (
    <div className="App">
      <Context.Provider value={contextValue} >
        {contextHolder}
        {isAuth ?
          <Home /> :
          <Login handleLogin={handleLogin} />
        }
      </Context.Provider>
    </div>
  );
}

export default App;

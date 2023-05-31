import React, {useEffect, useState} from "react";
import AppRouter from "./components/AppRouter";


//stylesheet and fonts
import './styles/App.css';
import './styles/Fonts/Montserrat-VariableFont_wght.ttf';
import {AuthContext} from "./context/context";

function App() {

  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const checkLogin = ()=>{
    if(localStorage.getItem("token_Planner_EvTor")) {setIsAuth(true)};
    setIsLoading(false);
  };
  useEffect(()=>{
        checkLogin();
      },
      [isAuth]);
  return (
    <AuthContext.Provider value={{
      isAuth,
      setIsAuth,
      isLoading
    }}>
    <AppRouter />
    </AuthContext.Provider>
  );
}

export default App;

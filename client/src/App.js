import React, {useEffect, useState} from "react";
import AppRouter from "./components/AppRouter";
import {UserContext} from "./context/context";
import './styles/App.css';
import './styles/Fonts/Montserrat-VariableFont_wght.ttf';
import UserService from "./API/UserService";

function App() {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const accessToken = localStorage.getItem('token_Planner_EvTor');
    const checkLogin = async () => {
        if (accessToken && accessToken !== 'undefined') {
            setIsAuth(true);
            setUserData( await UserService.showUserProfileData());
        }
        setIsLoading(false);
    };
    useEffect(() => {
            checkLogin();
        },
        [isAuth]);
    return (
        <UserContext.Provider value={{
            isAuth,
            setIsAuth,
            userData,
            setUserData,
            isLoading
        }}>
            <AppRouter/>
        </UserContext.Provider>
    );
}

export default App;

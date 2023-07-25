import React, {useContext} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Registration from "../pages/Registration";
import Planner from "../pages/Planner";
import Login from "../pages/Login"
import ErrorPage from "../pages/ErrorPage";
import {UserContext} from "../context/context";
import Loader from "./UI/Loader/Loader";
import AboutApp from "../pages/AboutApp";
import Invites from "../pages/Invites";

const AppRouter = () => {

const {isAuth, isLoading} = useContext(UserContext);
if(isLoading){
    return (<div className="basicLoader">
        <Loader/>
    </div>)
}
    return (
        <BrowserRouter>
            {isAuth
            ?
                <Routes>
                    <Route path="/" element={<Navigate to="/planner"/>} />
                    <Route path="/planner" element={<Planner />} />
                    <Route path="/invites" element={<Invites />} />
                    <Route path="/error" element={<ErrorPage />} />
                    <Route path="aboutApp" element={<AboutApp/>}>

                </Route>
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            :
                <Routes>
                    <Route path="/" element={<Navigate to="/login"/>} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/error" element={<ErrorPage />} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>}
        </BrowserRouter>
    )
};
export default AppRouter;
import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registration from "../pages/Registration";
import Planner from "../pages/Planner";
import Login from "../pages/Login"
import ErrorPage from "../pages/ErrorPage";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/registration" element={<Registration />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/login" element={<Login />} />
                <Route path="/error" element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    )
};
export default AppRouter;
import React, {useContext} from "react";
import classes from "./Header.module.css";
import BigButton from "../UI/button/BigButton";
import userService from "../../API/UserService";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/context";
import MedButton from "../UI/button/MedButton";
import NavBar from "../UI/NavBar/NavBar";

const Header = () => {
    const {setIsAuth} = useContext(AuthContext);
    const navigate = useNavigate();
    const logoutHandle =()=>{
        userService.logout();
        setIsAuth(false);
        navigate("/");
    };
    const aboutAppHandle =() =>{

    }
    return (
        <header>
            <div className={classes.navLogout}>
                <NavBar/>
                <BigButton children="LogOut" color="blue" onClick={logoutHandle} />
            </div>
        </header>)
};

export default Header;
import React from "react";
import classes from "./NavBar.module.css";
import {Link} from "react-router-dom";
import MedButton from "../button/MedButton";

const NavBar = ()=>{

    return(
    <div className={classes.divNavBar}>
        <ul className={classes.navBar}>
            <li>
                <Link to="/" className={classes.linkMain}>
                    Planner
                </Link>
            </li>
            <li>
                <Link to="/aboutApp" className={classes.link}>
                    About app
                </Link>
            </li>

        </ul>
    </div>)
};
export default NavBar;
import React from "react";
import classes from "./Info.module.css";
import {Link} from "react-router-dom";
const Info =()=>{
    return(
        <article className={classes.article}>
            <h1>About the app</h1>

                <h2>Welcome and thank you for visiting my web page</h2>
                <div className={classes.aboutMe}>
                    <h3>My name is</h3>
                    <div className={classes.name}>Evgeniy Toropitsyn (EvTor)</div>
                    <h4>Please visit my </h4>
                    <Link to="https://www.linkedin.com/in/evgeniy-toropitsyn/"><div className={classes.link}>LinkedIn profile</div></Link>
                    <h4>Or look at my other projects on</h4>
                    <Link to="https://github.com/EvTor/"><div className={classes.link}>GitHub</div></Link>
                </div>

    </article>)
};
export default Info;
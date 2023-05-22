import React from "react";
import classes from "./Loader.module.css";

const Loader = () => {
    return (
        <div className={classes.divLoader}>
            <div className={classes.loader}>
                <div className={classes.loaderMini}></div>
            </div>
        </div>
    )
};

export default Loader;
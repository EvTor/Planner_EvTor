import React from "react";
import classes from "./Loader.module.css";

const Loader = () => {
    return (
        <div className={classes.divLoder}>
            <div className={classes.loader}></div>
            <div className={classes.loaderMini}></div>
        </div>
    )
};

export default Loader;
import React from "react";
import classes from "./Button.module.css";
const SmallButton = ({ children, ...props }) => {
    return (
        <button className={classes.smallBtn} {...props}>
            {children}
        </button>
    )
}
export default SmallButton;
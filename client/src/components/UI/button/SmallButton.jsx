import React from "react";
import classes from "./SmallButton.module.css";
const SmallButton = ({ children, ...props }) => {
    return (
        <button className={classes.SmallBtn} {...props}>
            {children}
        </button>
    )
}
export default SmallButton;
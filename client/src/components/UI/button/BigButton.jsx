import React from "react";
import classes from './Button.module.css'
const BigButton = ({ children, ...props }) => {
    return (
        <button className={classes.bigBtn} {...props}>
            {children}
        </button>
    )
}
export default BigButton;
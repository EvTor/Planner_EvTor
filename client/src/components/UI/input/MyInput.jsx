import React from "react";
import classes from "./MyInput.module.css"
const MyInput = ({ children, ...props }) => {
    return (
        <label className={classes.myLabel}>
            {children}
            <input className={classes.myInput} {...props} />
        </label>
    )
}

export default MyInput;
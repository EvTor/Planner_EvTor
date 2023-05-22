import React from "react";
import classes from "./Button.module.css";

const MedButton =({children, ...props})=>{
    return(
        <button className={
            props.delete
            ?`${classes.medBtn} ${classes.delete}`
            :classes.medBtn
            } {...props}>
            {children}
        </button>)
};
export default MedButton;


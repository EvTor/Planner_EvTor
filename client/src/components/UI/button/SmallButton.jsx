import React from "react";
import classes from "./Button.module.css";
const SmallButton = ({ children, color, onClick }) => {
    const buttonColor = ()=>{
        if(color === "blue")
        {return classes.blueButton}
        if(color === "grey")
        {return classes.greyButton}
        if(color === "red")
        {return classes.redButton}
        if(color === "blue-red")
        {return classes.blueRedButton}
    };
    return (
        <button
            onClick={onClick}
            className={`${classes.smallBtn} ${buttonColor()}`}
        >
            {children}
        </button>
    )
}
export default SmallButton;
import React from "react";
import classes from './Button.module.css'
const BigButton = ({ children, color, onClick, sizeChange }) => {
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
    const buttonSizeChange = ()=>{
        if(sizeChange)
        {return classes.sizeChange}
    }
    return (
        <button onClick={onClick}
            className={`${classes.bigBtn} ${buttonColor()} ${buttonSizeChange()}`}
        >
            {children}
        </button>
    )
}
export default BigButton;
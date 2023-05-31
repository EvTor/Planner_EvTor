import React from "react";
import classes from "./Select.module.css";
const Select = ({children, ...props})=>{
    return(
        <div className={classes.divSelect}>
<select className={classes.mySelect} {...props}>
    {children}
</select>
        </div>
    )
}
export default Select;
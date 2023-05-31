import React from "react";
import classes from "./Input.module.css"
const Input = (props) => {


    return (
        <div className={classes.inputDiv}>
        <label>
            {props.children}
        </label>
            <input
                type={props.type}
                value={props.value}
                placeholder={props.placeHolder}
                onChange={props.onChange}
                className={
                props.validationError
                    ?`${classes.myInput} ${classes.validationErr}`
                    :`${classes.myInput}`
                }
            />
</div>
    )
}

export default Input;
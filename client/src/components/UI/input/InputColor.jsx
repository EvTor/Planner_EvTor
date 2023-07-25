import React from 'react';
import classes from "./InputColor.module.css";

const InputColor = (props) => {
    return (
        <div className={classes.inputDiv}>
            <input
                type={props.type}
                value={props.value}
                onChange={props.onChange}
                className={classes.myInput}
            />
        </div>
    );
};

export default InputColor;
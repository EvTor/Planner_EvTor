import React, {useEffect} from "react";
import classes from "./FlashMessage.module.css";
const FlashMessage = ({text, sendForm, setSendForm, formDecoration, setFormDecoration, subsequentAction}) => {
useEffect(()=>{
if(sendForm && formDecoration === "success"){
    const timeOut = setTimeout(()=>{
         subsequentAction();
         setSendForm(false);
         setFormDecoration("initial")}, 1100);
    return () => clearTimeout(timeOut);
}
    }, [sendForm])
    return(
        <div className={formDecoration === "success"
        ?classes.success
        :`${classes.success} ${classes.fail}`}>
            {text}
        </div>)
};
export default FlashMessage;
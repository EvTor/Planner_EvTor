import React, {useEffect} from "react";
import classes from "./FlashMessage.module.css";
const FlashMessage = ({text, sendForm, setSendForm, successForm, setSuccessForm, setModalActive}) => {
useEffect(()=>{
if(sendForm){
    const timeOut = setTimeout(()=>{setModalActive(false); setSendForm(false); setSuccessForm(false);console.log("flash")}, 1100);
    return () => clearTimeout(timeOut);
}
    }, [sendForm])
    return(
        <div className={successForm
        ?classes.success
        :`${classes.success}${classes.fail}`}>
            {text}
        </div>)
};
export default FlashMessage;
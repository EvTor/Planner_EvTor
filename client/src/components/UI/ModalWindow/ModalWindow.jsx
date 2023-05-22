import React from "react";
import classes from "./ModalWindow.module.css";
const ModalWindow = ({active, setActive, children})=>{
    return(
        <div className={
            active
                ?`${classes.modal} ${classes.active}`
                :`${classes.modal}`
        }
             onClick={()=>setActive(false)}>
        <div className={
            active
                ?`${classes.modalContent} ${classes.active}`
                :`${classes.modalContent}`}
             onClick={e=>e.stopPropagation()}>
            {children}
        </div>
    </div>
    )
};
export default ModalWindow;
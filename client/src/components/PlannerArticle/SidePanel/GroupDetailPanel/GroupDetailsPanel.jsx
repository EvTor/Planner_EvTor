import React from "react";
import classes from "./GroupDetailsPanel.module.css"
import Medbutton from "../../../UI/button/MedButton";

const GroupDetailsPanel = ({setModalActive, setGroupForm, setEventForm, groups, clickedGroup}) => {


    return (
        <div className={classes.groupPanel}>
            <div className={classes.title}>
                <h1>Groups</h1>
            </div>

            <div className={classes.buttons}>
                <Medbutton onClick={()=>{clickedGroup(false); setGroupForm(true);setEventForm(false); setModalActive(true)}} children="Create new"/>
            </div>
            <div className={classes.groupList}>
            {groups.map((group)=>
                <div className={classes.groupsDiv} onClick={()=>{clickedGroup(group); setGroupForm(true); setEventForm(false); setModalActive(true)}}>{group.title}</div>
            )}
        </div>
        </div>
    )
};
export default GroupDetailsPanel;
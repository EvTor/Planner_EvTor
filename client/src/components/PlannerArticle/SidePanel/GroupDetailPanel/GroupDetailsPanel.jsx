import React from "react";
import classes from "./GroupDetailsPanel.module.css"

import SmallButton from "../../../UI/button/SmallButton";

const GroupDetailsPanel = ({setModalActive, setGroupForm, setEventForm, groups, clickedGroup}) => {


    return (
        <div className={classes.groupPanel}>
            <div className={classes.title}>
                <h1>Groups</h1>
            <div>
                <SmallButton onClick={()=>{clickedGroup(false); setGroupForm(true);setEventForm(false); setModalActive(true)}} color="blue" children="Create new"/>
            </div>
            </div>
            <div className={classes.groupList}>
            {groups.map((group)=>
                <div key={group._id} className={classes.groupsDiv} onClick={()=>{clickedGroup(group); setGroupForm(true); setEventForm(false); setModalActive(true)}}>{group.title}</div>
            )}
            </div>
        </div>
    )
};
export default GroupDetailsPanel;
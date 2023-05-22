import React, { useState } from "react";
import classes from "./SidePanel.module.css";
import EventDetailsPanel from "./EventDetailsPanel/EventDetailsPanel";
import GroupDetailsPanel from "./GroupDetailPanel/GroupDetailsPanel";
const SidePanel = ({ users, groups, dayEventsDetails, setModalActive, setGroupForm, clickedGroup, setEventForm}) => {

    return (
        <div className={classes.sidePanelDiv}>
            <GroupDetailsPanel groups={groups} setModalActive={setModalActive} setGroupForm={setGroupForm} setEventForm={setEventForm} clickedGroup={clickedGroup}/>
            <EventDetailsPanel dayEventsDetails={dayEventsDetails} users={users} setModalActive={setModalActive} setEventForm={setEventForm} setGroupForm={setGroupForm}/>
        </div>
    )
};
export default SidePanel;
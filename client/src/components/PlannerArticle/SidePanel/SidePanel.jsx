import React, { useState } from "react";
import classes from "./SidePanel.module.css";
import EventDetailsPanel from "./EventDetailsPanel/EventDetailsPanel";
import GroupDetailsPanel from "./GroupDetailPanel/GroupDetailsPanel";
const SidePanel = ({ users, groups, dayEventsDetails }) => {

    return (
        <div className={classes.sidePanelDiv}>
            <GroupDetailsPanel groups={groups} />
            <EventDetailsPanel dayEventsDetails={dayEventsDetails} users={users} />
        </div>
    )
};
export default SidePanel;
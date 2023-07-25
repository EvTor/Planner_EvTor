import React, { useState, forwardRef } from "react";
import classes from "./SidePanel.module.css";
import EventDetailsPanel from "./EventDetailsPanel/EventDetailsPanel";
import GroupDetailsPanel from "./GroupDetailPanel/GroupDetailsPanel";
const SidePanel = ({ users, groups, dayEventsDetails, setModalActive, setGroupForm, clickedGroup, setEventForm, clickedEditEvent, invites, setInvitesForm, height, setInvites}, ref) => {

    return (
        <div ref={ref} className={classes.sidePanelDiv} style={{height: height}}>
            <div className={classes.sidePanelFlex}>

            <GroupDetailsPanel groups={groups}
                               setModalActive={setModalActive}
                               setGroupForm={setGroupForm}
                               setEventForm={setEventForm}
                               clickedGroup={clickedGroup}/>
            <EventDetailsPanel dayEventsDetails={dayEventsDetails}
                               users={users}
                               setModalActive={setModalActive}
                               setEventForm={setEventForm}
                               setGroupForm={setGroupForm}
                               setInvitesForm={setInvitesForm}
                               clickedEditEvent={clickedEditEvent}
                               invites={invites}
                               setInvites={setInvites}/>

        </div>
        </div>
    )
};
export default forwardRef(SidePanel);
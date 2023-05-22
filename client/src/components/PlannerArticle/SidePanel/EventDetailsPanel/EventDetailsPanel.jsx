import React from "react";
import classes from "./EventDetailsPanel.module.css";
import MyEvent from "../../../UI/event/MyEvent";
import Service from "../../../../service/service";
import Medbutton from "../../../UI/button/MedButton";
const EventDetailsPanel = ({ dayEventsDetails, users, setEventForm, setGroupForm, setModalActive }) => {

    return (
        <div className={classes.eventPanelDiv}>
            <h1>Events</h1>
            <Medbutton onClick={()=>{setEventForm(true); setGroupForm(false); setModalActive(true)}} children="New event"/>
            <Medbutton onClick={()=>{setEventForm(true); setGroupForm(false); setModalActive(true)}} children="Show invites"/>
            {dayEventsDetails
                ?
                <>
                    <h4>{Service.dayFormatter(dayEventsDetails.dayId)}</h4>
                    <div className={classes.eventListDiv}>
                        {dayEventsDetails.events.map(e =>
                            <MyEvent locationInPanel="true" key={`${e._id}panel`} exactEvent={e} users={users} />
                            )
                        }
                    </div>

                </>
                : null}
        </div>
    )
};
export default EventDetailsPanel;

import React from "react";
import classes from "./EventDetailsPanel.module.css";
import MyEvent from "../../../UI/event/MyEvent";
import Service from "../../../../service/service";
const EventDetailsPanel = ({ dayEventsDetails, users }) => {

    return (
        <div className={classes.eventPanelDiv}>
            <h1>Events</h1>
            {dayEventsDetails
                ?
                <>
                    <h4>{Service.dayFormatter(dayEventsDetails.dayId)}</h4>
                    <div className={classes.eventListDiv}>
                        {dayEventsDetails.events.map(e =>
                            <MyEvent locationInPanel="true" key={`${e._id}panel`} exactEvent={e} users={users} />)}
                    </div>
                </>
                : null}
        </div>
    )
};
export default EventDetailsPanel;

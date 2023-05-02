import React, { useState, useEffect } from "react";

import EventService from "../../../API/EventService";
import classes from "./MyCard.module.css"
import MyEvent from "../event/MyEvent";
const MyCard = ({ id, style, children }) => {

    const [events, setEvents] = useState([{}]);
    useEffect(() => {
        getEvents()
    }, [id]);

    async function getEvents() {
        const getAll = await EventService.showMyEvents();
        const dayEvents = getAll.filter(event => {
            const certainEventStart = event.startDate.slice(0, 10);
            if (certainEventStart === id)
                return event
        });
        console.log(dayEvents)
        setEvents(dayEvents)
    };

    const markCurrentDay = () => {
        const calendarTime = new Date(id);
        const currentTime = new Date();
        const calendarDate = `${calendarTime.getFullYear().toString()}-${calendarTime.getMonth().toString()}-${calendarTime.getDate().toString()}`;
        const currentDate = `${currentTime.getFullYear().toString()}-${currentTime.getMonth().toString()}-${currentTime.getDate().toString()}`;
        if (calendarDate === currentDate)
            return classes.divMarkCurrentDay

    }

    return (
        <div style={style} className={`${classes.divMyCard} ${markCurrentDay()}`}>
            <div className={classes.dayNumber}>{children}</div>


            {
                events.slice(0, 3).map(e =>
                    <MyEvent key={e._id} description={e.description} startDate={e.startDate} endDate={e.endDate} color={e.color} />
                )
            }
            {
                events.length > 3
                    ? <div className={classes.showMore}>Show more</div>
                    : null
            }

        </div >
    )
};
export default MyCard;
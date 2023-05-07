import React, { useState } from "react";
import classes from "./MyCard.module.css"
import MyEvent from "../event/MyEvent";
const MyCard = ({ currentDayEvents, id, style, dayNumber, clickedDay }) => {

    const markCurrentDay = () => {
        const calendarTime = new Date(id);
        const currentTime = new Date();
        const calendarDate = `${calendarTime.getFullYear().toString()}-${calendarTime.getMonth().toString()}-${calendarTime.getDate().toString()}`;
        const currentDate = `${currentTime.getFullYear().toString()}-${currentTime.getMonth().toString()}-${currentTime.getDate().toString()}`;
        if (calendarDate === currentDate)
            return classes.divMarkCurrentDay
    };

    const [activeDay, setActiveDay] = useState(false);
    const markActiveDay = () => {
        if (activeDay) { return classes.divMarkActiveDay }
        else { return null }
    };
    const dayIdAndEvents = {
        dayId: id,
        events: currentDayEvents
    };
    return (
        <div onClick={() => { clickedDay(dayIdAndEvents); setActiveDay(true) }} className={`${classes.divMyCard} ${markCurrentDay()} ${markActiveDay()}`} style={style}>
            <div className={classes.dayNumber}>{dayNumber}</div>


            {
                currentDayEvents.slice(0, 3).map(e =>
                    <MyEvent locationInCard="true" key={`${e._id}card`} exactEvent={e} />
                )
            }
            {
                currentDayEvents.length > 3
                    ? <div className={classes.showMore}>Show more</div>
                    : null
            }

        </div >
    )
};
export default MyCard;
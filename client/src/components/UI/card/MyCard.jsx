import React, {useEffect, useState} from "react";
import classes from "./MyCard.module.css"
import MyEvent from "../event/MyEvent";
const MyCard = ({ currentDayEvents, id, style, dayNumber, clickedDay, dayEventsDetails, eventFormDecoration }) => {

    const markCurrentDay = () => {
        const calendarTime = new Date(id);
        const currentTime = new Date();
        const calendarDate = `${calendarTime.getFullYear().toString()}-${calendarTime.getMonth().toString()}-${calendarTime.getDate().toString()}`;
        const currentDate = `${currentTime.getFullYear().toString()}-${currentTime.getMonth().toString()}-${currentTime.getDate().toString()}`;
        if (calendarDate === currentDate)
            return classes.divMarkCurrentDay
    };
    const markActiveDay =()=>{
        if(dayEventsDetails){
            if(dayEventsDetails.dayId === id)
            { return classes.divMarkActiveDay}
        }
    };

    const dayIdAndEvents = {
        dayId: id,
        events: currentDayEvents
    };

    useEffect(()=>{
        if((eventFormDecoration === "success" && dayIdAndEvents.dayId === dayEventsDetails.dayId) ||
            (eventFormDecoration === "success" && dayEventsDetails === undefined)){
            clickedDay(dayIdAndEvents);
        }},[eventFormDecoration]);

    return (
        <div onClick={() => { clickedDay(dayIdAndEvents) }} className={`${classes.divMyCard} ${markCurrentDay()} ${markActiveDay()}`} style={style}>
            <div className={classes.dayNumber}>{dayNumber}</div>


            {
                currentDayEvents.sort((a,b)=>{
                    if(
                        (parseInt(a.startDate.slice(11, 16).split(':').join(''))
                            > parseInt(b.startDate.slice(11, 16).split(':').join('')))
                    ){return 1}
                    if(
                        (parseInt(a.startDate.slice(11, 16).split(':').join(''))
                            < parseInt(b.startDate.slice(11, 16).split(':').join('')))
                    ){return - 1}
                    return 0
                }).slice(0, 3).map(e =>
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
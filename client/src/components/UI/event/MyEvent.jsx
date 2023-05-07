import React from "react";
import classes from "./MyEvent.module.css";
import Service from "../../../service/service";
const MyEvent = ({ exactEvent, locationInPanel, locationInCard, users }) => {

    const showTime = (date) => {
        const dateISO = new Date(date);
        const localDate = dateISO;
        let hours = localDate.getHours().toString();
        if (hours.length < 2) { hours = `0${hours}` }
        let minutes = localDate.getMinutes().toString();
        if (minutes.length < 2) { minutes = `0${minutes}` }
        return `${hours}:${minutes}`;
    }

    const guestList = users?.filter(user => {
        return exactEvent.user.some(guest => {
            return guest.user_id === user.id
        })
    })



    return (
        <>
            {locationInCard
                ?
                <>
                    <div className={classes.eventInCardDiv} style={{ backgroundColor: Service.backgroundColor(exactEvent) }}>
                        <div className={classes.timeInCard}>
                            {showTime(exactEvent.startDate)} {showTime(exactEvent.endDate)}
                        </div>
                        <div className={classes.descriptionInCard}>
                            {exactEvent.description}
                        </div>
                    </div>
                </>
                : null
            }
            {locationInPanel
                ?
                <>
                    <div className={classes.eventInPanelDiv} style={{ backgroundColor: Service.backgroundColor(exactEvent) }}>
                        <div className={classes.descriptionInPanel}>
                            {exactEvent.description}
                        </div>
                        <div className={classes.timeInPanel}>
                            {showTime(exactEvent.startDate)} - {showTime(exactEvent.endDate)}
                        </div>
                        <div className={classes.guestList}>
                            Guest list: {guestList.map(user =>
                                <span key={user.id}>{`${user.firstName} ${user.lastName}, `}</span>)}
                        </div>
                    </div>
                </>
                : null
            }

        </>
    )
};
export default MyEvent;
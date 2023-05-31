import React from "react";
import classes from "./MyEvent.module.css";
import Service from "../../../service/service";
import SmallButton from "../button/SmallButton";
const MyEvent = ({ exactEvent,
                     locationInPanel,
                     locationInCard,
                     locationInInvite,
                     users,
                     clickedEditEvent,
                     setEventForm,
                     setGroupForm,
                     setModalActive,
                     clickedAcceptInvite,
                     clickedDeclineInvite}) => {

    const showTime = (date) => {
        if(date.slice(11, 16)[0] === "0")
        {return date.slice(12, 16)}
        else {return date.slice(11, 16)}
    };
    const showDate = (date) => {
        return date.slice(0, 10)
    };

    const guestList = users?.filter(user => {
        return exactEvent.user.some(guest => {
            return guest.user_id === user.id
        })
    });

    return (
        <>
            {locationInCard
                ?
                    <div className={classes.eventInCardDiv} style={{ backgroundColor: Service.backgroundColor(exactEvent) }}>
                        <div className={classes.timeInCard}>
                            <div>{`${showTime(exactEvent.startDate)} ${showTime(exactEvent.endDate)}`}</div>
                        </div>
                        <div className={classes.descriptionInCard}>
                            <div>{exactEvent.description}</div>
                        </div>
                    </div>
                : null
            }
            {locationInPanel || locationInInvite
                ?
                    <div className={classes.eventInPanelDiv} style={{ backgroundColor: Service.backgroundColor(exactEvent) }}>
                        <div className={classes.descriptionInPanel}>
                            {exactEvent.description}
                        </div>
                        <div className={classes.timeInPanel}>
                            {locationInPanel
                                ?`${showTime(exactEvent.startDate)} - ${showTime(exactEvent.endDate)}`
                                :`${showDate(exactEvent.startDate)} at ${showTime(exactEvent.startDate)} - ${showTime(exactEvent.endDate)}`
                            }
                        </div>
                        <div className={classes.guestList}>
                            Guest list: {guestList.map(user =>
                                <span key={user.id}>{`${user.firstName} ${user.lastName}, `}</span>)}
                        </div>
                        {locationInPanel
                        ?
                            <div className={classes.buttons}>
                                <SmallButton children="edit delete" color="blue-red" onClick={()=>{
                                    clickedEditEvent(exactEvent);
                                    setEventForm(true);
                                    setGroupForm(false);
                                    setModalActive(true);
                                }}/>
                            </div>
                            :
                            <div className={classes.buttons}>
                                <SmallButton children="accept" color="blue" onClick={()=>{
                                    clickedAcceptInvite(exactEvent);
                                }}/>
                                <SmallButton children="decline" color="red" onClick={()=>{
                                    clickedDeclineInvite(exactEvent);
                                }}/>
                            </div>
                        }
                    </div>
                : null
            }

        </>
    )
};
export default MyEvent;
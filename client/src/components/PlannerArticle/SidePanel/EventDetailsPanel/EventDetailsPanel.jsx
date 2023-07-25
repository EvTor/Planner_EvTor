import React, {useEffect, useState} from "react";
import classes from "./EventDetailsPanel.module.css";
import MyEvent from "../../../UI/event/MyEvent";
import Service from "../../../../service/service";
import SmallButton from "../../../UI/button/SmallButton";
import EventService from "../../../../API/EventService";
import {API_URL} from "../../../../API/config";
const EventDetailsPanel = ({ dayEventsDetails, users, setEventForm, setGroupForm, setModalActive, setInvitesForm, clickedEditEvent, invites, setInvites }) => {
    const[selectDayMessage, setSelectDayMessage] = useState(false);
    const createNewEventHandle=()=>{
        if(dayEventsDetails){
            setEventForm(true);
            setGroupForm(false);
            setModalActive(true);
        } else{
            setSelectDayMessage(true);
        }
    };
    const showInvitesHandle = async ()=>{
        setInvites(await EventService.showNotAcceptedEvents());
        setInvitesForm(true);
        setModalActive(true)
    };
    useEffect(()=>{
        if(dayEventsDetails){setSelectDayMessage(false)}
    },[dayEventsDetails]);
    return (
        <div className={classes.eventPanelDiv}>
            <div className={classes.titlePanel}>
                <h1>Events</h1>
                    <div className={classes.buttons}>
                    <SmallButton onClick={createNewEventHandle} color="blue" children="New event"/>
                        {invites.length > 0
                            ?<>
                                {invites.length > 1
                                ?<SmallButton onClick={showInvitesHandle} color="red" children={`Show ${invites.length} invites!`}/>
                                :<SmallButton onClick={showInvitesHandle} color="red" children="Show my invite!"/>
                                }
                            </>
                            :<>
                                <SmallButton onClick={showInvitesHandle} color="grey" children="Check invites"/>
                            </>
                        }

                    </div>
                {selectDayMessage
                    ?<div className={classes.selectDayMessage}>Please select a day from the calendar</div>
                    :null
                }
            </div>
            <div className={classes.bodyPanel}>
            {dayEventsDetails
                ?
                <>
                    <h4>{Service.dayFormatter(dayEventsDetails.dayId)}</h4>
                    <div className={classes.eventListDiv}>
                        {dayEventsDetails.events.sort((a,b)=>{
                            if(
                                (parseInt(a.startDate.slice(11, 16).split(':').join(''))
                                    > parseInt(b.startDate.slice(11, 16).split(':').join('')))
                                ){return 1}
                            if(
                                (parseInt(a.startDate.slice(11, 16).split(':').join(''))
                                    < parseInt(b.startDate.slice(11, 16).split(':').join('')))
                                ){return - 1}
                            return 0
                        }).map(event =>
                            <MyEvent locationInPanel="true"
                                     key={`${event._id}panel`}
                                     exactEvent={event}
                                     users={users}
                                     clickedEditEvent={clickedEditEvent}
                                     setEventForm={setEventForm}
                                     setGroupForm={setGroupForm }
                                     setModalActive={setModalActive}
                            />
                            )
                        }
                    </div>

                </>
                : null}
        </div>
        </div>
    )
};
export default EventDetailsPanel;

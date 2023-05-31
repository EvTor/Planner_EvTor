import React, {useState, useEffect, useRef, useLayoutEffect} from "react";
import classes from "./PlannerArticle.module.css";
import Calendar from "./Calendar/Calendar";
import EventService from "../../API/EventService";
import Loader from "../UI/Loader/Loader";
import UserService from "../../API/UserService";
import GroupService from "../../API/GroupService";
import SidePanel from "./SidePanel/SidePanel";
import ModalWindow from "../UI/ModalWindow/ModalWindow";
import GroupForm from "../GroupForm/GroupForm";
import EventForm from "../EventForm/EventForm";
import InvitesForm from "../InvitesForm/InvitesForm";
const PlannerArticle = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [users, setUsers] = useState([]);
    const addUsersToList = async () => {
        setIsLoading(true);
        setUsers(await UserService.getUsersNames());
        setIsLoading(false);
    };

    const [events, setEvents] = useState([]);
    const [eventForm, setEventForm] = useState(false);
    const [dayEventsDetails, setDayEventsDetails] = useState(false);

    const clickedDay = (currentDayEvents) => {
        setDayEventsDetails(currentDayEvents);
    };

    const [sendEventForm, setSendEventForm] = useState(false);
    const [eventFormDecoration, setEventFormDecoration] = useState("initial");
    const [eventEdit, setEventEdit] = useState(false);
    const clickedEditEvent=(event)=>{
        setEventEdit(event);
    };
    const updateEventList = async () => {
        setIsLoading(true);
        setEvents(await EventService.showMyEvents());
        setIsLoading(false);
    };
    useEffect(() => {
        if (eventFormDecoration === "success")
        {
            const timeOut = setTimeout(()=>{updateEventList()}, 1000);
            return () => clearTimeout(timeOut);
        }
    }, [eventFormDecoration]);



    const [groups, setGroups] = useState([]);
    const [groupForm, setGroupForm] = useState(false);
    const [sendGroupForm, setSendGroupForm] = useState(false);
    const [groupFormDecoration, setGroupFormDecoration] = useState("initial");
    const [groupEdit, setGroupEdit] = useState(false);
    const clickedGroup = (group) => {
        setGroupEdit(group);
    };
    const updateGroupList = async () => {
        setIsLoading(true);
        setGroups(await GroupService.showMyGroups());
        setIsLoading(false);
    };
    useEffect(() => {
        if (groupFormDecoration === "success")
        {
            const timeOut = setTimeout(()=>{updateGroupList()}, 1000);
            return () => clearTimeout(timeOut);
        }
    }, [groupFormDecoration]);

    useEffect(() => {
        updateGroupList();
        addUsersToList();
        updateEventList();
        updateInvitesList();
    }, []);


    const [invites, setInvites] = useState([]);
    const [invitesForm, setInvitesForm] = useState(false);
    const updateInvitesList = async () => {
        setIsLoading(true);
        setInvites(await EventService.showNotAcceptedEvents());
        setIsLoading(false);
    };
    const [acceptedInvite, setAcceptedInvite] = useState(false);
    const [declinedInvite, setDeclinedInvite] = useState(false);

    const clickedAcceptInvite = (exactEvent)=>{
        setAcceptedInvite(exactEvent);
    };
    const clickedDeclineInvite =(exactEvent)=>{
        setDeclinedInvite(exactEvent);
    };
    const [successfullyAcceptedInvite, setSuccessfullyAcceptedInvite] = useState(false);
    const [successfullyDeclinedInvite, setSuccessfullyDeclinedInvite] = useState(false);

    useEffect(()=>{
        if(successfullyAcceptedInvite){
            updateInvitesList();
            updateEventList();
            setSuccessfullyAcceptedInvite(false);
        }
    },[successfullyAcceptedInvite]);

    useEffect(()=>{
        if(successfullyDeclinedInvite){
            updateInvitesList();
            setSuccessfullyDeclinedInvite(false);
        }
    },[successfullyDeclinedInvite]);


    const [modalActive, setModalActive] = useState(false);




    const ref = useRef(null);
    const [calendarHeight, setCalendarHeight] = useState(0);
    useLayoutEffect(()=>{
        setCalendarHeight(ref.current.clientHeight);
    }, []);

    return (
        <article className={classes.plannerArticle}>
            {isLoading
                ?
                <div className={classes.loading}>
                    <Loader />
                </div>
                :
                <>
                    <SidePanel users={users}
                               groups={groups}
                               dayEventsDetails={dayEventsDetails}
                               setModalActive={setModalActive}
                               setEventForm={setEventForm}
                               clickedEditEvent={clickedEditEvent}
                               setGroupForm={setGroupForm}
                               clickedGroup={clickedGroup}
                               setInvitesForm={setInvitesForm}
                               height={calendarHeight}
                               invites={invites}
                               setInvites={setInvites}
                    />
                    <div ref={ref}>
                        <Calendar  events={events} clickedDay={clickedDay} dayEventsDetails={dayEventsDetails} eventFormDecoration={eventFormDecoration}/>
                    </div>
                </>
            }
                    <ModalWindow active={modalActive} setActive={setModalActive}>
                        {groupForm
                                ?<GroupForm
                                modalActive={modalActive}
                                setModalActive={setModalActive}
                                setGroupForm={setGroupForm}
                                users={users}
                                sendGroupForm={sendGroupForm}
                                setSendGroupForm={setSendGroupForm}
                                groupFormDecoration={groupFormDecoration}
                                setGroupFormDecoration={setGroupFormDecoration}
                                groupEdit={groupEdit}
                            />
                            :null}
                        {eventForm
                                ?<EventForm
                                modalActive={modalActive}
                                setModalActive={setModalActive}
                                setEventForm={setEventForm}
                                users={users}
                                groups={groups}
                                sendEventForm={sendEventForm}
                                setSendEventForm={setSendEventForm}
                                eventFormDecoration={eventFormDecoration}
                                setEventFormDecoration={setEventFormDecoration}
                                eventEdit={eventEdit}
                                setEventEdit={setEventEdit}
                                dayEventsDetails={dayEventsDetails}
                            />
                            :null}

                        {invitesForm
                                ?<InvitesForm
                                modalActive={modalActive}
                                setInvitesForm={setInvitesForm}
                                invites={invites}
                                users={users}
                                acceptedInvite={acceptedInvite}
                                setAcceptedInvite={setAcceptedInvite}
                                declinedInvite={declinedInvite}
                                setDeclinedInvite={setDeclinedInvite}
                                clickedAcceptInvite={clickedAcceptInvite}
                                clickedDeclineInvite={clickedDeclineInvite}
                                setSuccessfullyAcceptedInvite={setSuccessfullyAcceptedInvite}
                                setSuccessfullyDeclinedInvite={setSuccessfullyDeclinedInvite}
                            />
                        :null}
                    </ModalWindow>

        </article>
    )
};
export default PlannerArticle;
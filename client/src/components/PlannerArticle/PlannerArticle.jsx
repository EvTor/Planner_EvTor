import React, { useState, useEffect } from "react";
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
const PlannerArticle = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [events, setEvents] = useState([]);
    const addEventsToList = async () => {
        setIsLoading(true);
        setEvents(await EventService.showMyEvents());
        setIsLoading(false);
    };
    const [users, setUsers] = useState([]);
    const addUsersToList = async () => {
        setIsLoading(true);
        setUsers(await UserService.getUsersNames());
        setIsLoading(false);
    }
    const [groups, setGroups] = useState([]);
    const [sendGroupForm, setSendGroupForm] = useState(false);
    const [successGroupForm, setSuccessGroupForm] = useState(false);
    const [groupEdit, setGroupEdit] = useState(false);
    const clickedGroup = (group) => {
        setGroupEdit(group);
    };

    const addGroupsToList = async () => {
        setIsLoading(true);
        setGroups(await GroupService.showMyGroups());
        setIsLoading(false);
    };
    useEffect(() => {

        if (successGroupForm)
        {
            const timeOut = setTimeout(()=>{addGroupsToList();console.log("plann")}, 1000);
            return () => clearTimeout(timeOut);

        }
    }, [successGroupForm]);

    useEffect(() => {
        addGroupsToList();
        addUsersToList();
        addEventsToList();
    }, []);

    const [dayEventsDetails, setDayEventsDetails] = useState(null);
    const clickedDay = (currentDayEvents) => {
        setDayEventsDetails(currentDayEvents);
    };



    const [modalActive, setModalActive] = useState(false);

    const [groupForm, setGroupForm] = useState(false);
    const [eventForm, setEventForm] = useState(false);
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
                               setGroupForm={setGroupForm}
                               clickedGroup={clickedGroup}
                    />
                    <Calendar events={events} clickedDay={clickedDay} />
                </>
            }
                    <ModalWindow active={modalActive} setActive={setModalActive}>
                        {groupForm
                                ?<GroupForm
                                modalActive={modalActive}
                                setModalActive={setModalActive}
                                users={users}
                                sendGroupForm={sendGroupForm}
                                setSendGroupForm={setSendGroupForm}
                                successGroupForm = {successGroupForm}
                                setSuccessGroupForm = {setSuccessGroupForm}
                                groupEdit = {groupEdit}
                            />
                            :null}
                        {eventForm
                                ?<EventForm
                                modalActive={modalActive}
                                setModalActive={setModalActive}
                                users={users}
                                sendGroupForm={sendGroupForm}
                                setSendGroupForm={setSendGroupForm}
                                successGroupForm = {successGroupForm}
                                setSuccessGroupForm = {setSuccessGroupForm}
                                groupEdit = {groupEdit}
                            />
                            :null}
                    </ModalWindow>

        </article>
    )
};
export default PlannerArticle;
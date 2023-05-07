import React, { useState, useEffect } from "react";
import classes from "./PlannerArticle.module.css";
import Calendar from "./Calendar/Calendar";
import EventService from "../../API/EventService";
import Loader from "../UI/Loader/Loader";
import UserService from "../../API/UserService";
import GroupService from "../../API/GroupService";
import SidePanel from "./SidePanel/SidePanel";
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
    const addGroupsToList = async () => {
        setIsLoading(true);
        setGroups(await GroupService.showMyGroups());
        setIsLoading(false);
    };
    useEffect(() => {
        addUsersToList();
        addEventsToList();
        addGroupsToList();
    }, []);

    const [dayEventsDetails, setDayEventsDetails] = useState(null);
    const clickedDay = (currentDayEvents) => {
        setDayEventsDetails(currentDayEvents);
    };

    return (
        <article className={classes.plannerArticle}>
            {isLoading
                ?
                <>
                    <Loader />
                </>
                :
                <>
                    <SidePanel users={users} groups={groups} dayEventsDetails={dayEventsDetails} />
                    <Calendar events={events} clickedDay={clickedDay} />
                </>
            }
        </article>
    )
};
export default PlannerArticle;
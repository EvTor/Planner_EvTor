import React, {useEffect, useState} from "react";
import classes from "./EventForm.module.css";
import Input from "../UI/input/Input";
import MedButton from "../UI/button/MedButton";
import Loader from "../UI/Loader/Loader";
import SmallButton from "../UI/button/SmallButton";
import FlashMessage from "../UI/FlashMessage/FlashMessage";
import EventService from "../../API/EventService";
import Service from "../../service/service";
import Select from "../UI/input/Select";

const EventForm=({users,
                     groups,
                     modalActive,
                     setEventForm,
                     setModalActive,
                     sendEventForm,
                     setSendEventForm,
                     eventFormDecoration,
                     setEventFormDecoration,
                     eventEdit,
                     setEventEdit,
                     dayEventsDetails})=>{

    const [email, setEmail] = useState('');
    const [emailForMatching, setEmailForMatching] = useState('');
    const [newMember, setNewMember] = useState(false);
    const [description, setDescription] = useState('');
    const [allFriendsFromGroups, setAllFriendsFromGroups] = useState([]);
    const [listOfMembers, setListOfMembers] = useState([]);
    const [loadingName, setLoadingName] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [emptyDescription, setEmptyDescription] = useState(false);
    const [emptyListOfMembers, setEmptyListOfMembers] = useState(false);
    const [flashMessageText, setFlashMessageText] = useState('');

    const [startTime, setStartTime] = useState('');
    const [emptyStartTime, setEmptyStartTime] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [emptyEndTime, setEmptyEndTime] = useState(false);
    const [endDate, setEndDate] = useState('');
    const [color, setColor] = useState('grey');


    useEffect(()=>{
        if (eventEdit){
            setDescription(eventEdit.description);
            const eventMembersWithoutFounder = eventEdit.user.map(member => member.user_id).slice(1);
            const listOfUsers = users.filter(user=>{
                return eventMembersWithoutFounder.some(member => {
                    return member === user.id
                })
            });
            setListOfMembers(listOfUsers);
            setStartTime(eventEdit.startDate.slice(11, 16));
            setEndTime(eventEdit.endDate.slice(11, 16));
            setColor(eventEdit.color);
        }
        else {setDescription('');
            setListOfMembers([])}
    }, [eventEdit]);

    useEffect(()=>{
        setLoadingName(true);
        const timeOut = setTimeout(()=>{setEmailForMatching(email); setLoadingName(false);}, 500);
        return () => clearTimeout(timeOut);
    }, [email]);

    useEffect(()=>{
        matchTypedUser();
    }, [emailForMatching])

    useEffect(()=>{
        if(!modalActive){
            setEmail('');
            setEmailForMatching('');
            setNewMember(false);
            setDescription('');
            setListOfMembers([]);
            setLoadingName(false);
            setLoadingRequest(false);
            setEmptyDescription(false);
            setEmptyListOfMembers(false);
            setFlashMessageText('');
            setStartTime('');
            setEndTime('');
            setColor('grey');
            setEventFormDecoration("initial")
            setEventEdit(false);
            setEmptyStartTime(false);
            setEmptyEndTime(false);
            setEventForm(false);
        }
    }, [modalActive]);

    const transformToDate = (time)=>{
        if(dayEventsDetails)
        return `${dayEventsDetails.dayId}T${time}:00.000+00:00`
    };

    useEffect(()=>{
        setStartDate(transformToDate(startTime));
        setEndDate(transformToDate(endTime));
    }, [startTime, endTime]);

    const matchTypedUser = () =>{
        const matchedUsers = users.filter(user =>
        {if (user.email === emailForMatching)
        {return user}});
        if(Array.isArray(matchedUsers) && matchedUsers.length)
        {setNewMember(matchedUsers[0])}
        else {setNewMember(false)}
    };

    const startTimeHandle =(e)=>{
        setStartTime(e.target.value);
        setEmptyStartTime(false);
    };
    const endTimeHandle =(e)=>{
        setEndTime(e.target.value);
        setEmptyEndTime(false);
    };

    const membersHandle =(e)=>{
        setEmail(e.target.value);
        setEmptyListOfMembers(false);
    };
    const descriptionHandle =(e)=>{
        setDescription(e.target.value);
        setEmptyDescription(false);
    };
    const colorHandle =(e)=>{
        setColor(e.target.value);

    };

    const handleSubmit =(e, req)=>{
        e.preventDefault();
        if(description.length < 1){
            setEmptyDescription(true);
        };
        if(listOfMembers.length < 1){
            setEmptyListOfMembers(true);
        };
        if(startTime.length < 1 ){
            setEmptyStartTime(true);
        };
        if(endTime.length < 1 || parseInt(startTime.split(':').join('')) > parseInt(endTime.split(':').join(''))){
            setEmptyEndTime(true);
        };

        if(description.length >= 1 && listOfMembers.length >= 1 && startTime.length > 1 && endTime.length > 1
            && parseInt(startTime.split(':').join('')) < parseInt(endTime.split(':').join('')))
        {
            const listOfMembersId = listOfMembers.map(member => member.id)
            const body = {
                description,
                user: listOfMembersId,
                startDate,
                endDate,
                color
            };
            setLoadingRequest(true);

            let submit = null;

            if(req === "create") {
                submit = EventService.createNewEvent(body);
            };
            if(req === "edit")
            {submit = EventService.updateCertainEvent(eventEdit._id, body);
            };
            if(req === "delete")
            {submit = EventService.deleteEvent(eventEdit._id);
            };


            submit.then(data =>
            {console.log(data);
                setSendEventForm(true);
                setEventFormDecoration("success");
                setFlashMessageText(data);
                setLoadingRequest(false);
            })
                .catch(error =>
                {console.log(error);
                    setSendEventForm(true);
                    setEventFormDecoration("fail");
                    setFlashMessageText(error.message);
                    setLoadingRequest(false);
                })
        };
    };

    const addMemberToList =()=>{

        if(listOfMembers.filter(member=> member.id === newMember.id).length > 0)
        {return false}
        else {setListOfMembers([...listOfMembers, {...newMember}])};
        setEmail('');
    };

    const removeMemberFromList =(member)=>{
        const filteredArray = listOfMembers.filter(eachMember=>{
            if(eachMember.id !== member.id){
                return eachMember
            }
        })
        setListOfMembers(filteredArray)
    };

    const subsequentAction = () =>{
        if(modalActive){
            setModalActive(false);
        };
    };

    const listOfAllFriends = ()=>{
        const groupsMembersWithoutFounder = groups.map((group)=>{
            return group.user.map(member => member.user_id).slice(1)
        });
        const friendsIDs = [... new Set(Array.prototype.concat.apply([], groupsMembersWithoutFounder))];
        const listOfFriends = users.filter(user=>{
            return friendsIDs.some(member => {
                return member === user.id
            })
        });
        return listOfFriends;
    }

    useEffect(()=>{
        setAllFriendsFromGroups(listOfAllFriends());
    },[])

    const addFriendToList=(friend)=>{
        if(listOfMembers.filter(member=> member.id === friend.id).length > 0)
        {return false}
        else {setListOfMembers([...listOfMembers, {...friend}])};
    };

    const addGroupFriendsToList=(group)=>{
        const groupMembersWithoutFounder = group.user.map((user)=>{
            return user.user_id
        }).slice(1);

        const listOfFriends = users.filter(user=>{
            return groupMembersWithoutFounder.some(member => {
                return member === user.id
            })
        });

        const validatedList = listOfFriends.filter(friend =>{
            if(listOfMembers.filter(member=> member.id === friend.id).length > 0)
            {return false}
            else {return friend};
        });

        if(validatedList.length > 0){
            const updatedList = listOfMembers.concat(validatedList);
            setListOfMembers(updatedList);
        }
    };

    return(
        <form className={
            eventFormDecoration === "initial"
                ?`${classes.eventForm} ${classes.decorationInitial}`
                : eventFormDecoration === "success"
                    ?`${classes.eventForm} ${classes.decorationSuccess}`
                    :`${classes.eventForm} ${classes.decorationFail}`
        }>
            {eventEdit
                ?<h1>Update event</h1>
                :<h1>Create new event</h1>}
            {dayEventsDetails
                ? <h4>{Service.dayFormatter(dayEventsDetails.dayId)}</h4>
                :null

            }

            <div className={classes.startEndTime}>
            <Input
                children="Start time"
                type="time"
                value={startTime}
                validationError={emptyStartTime}
                onChange = {startTimeHandle}
            />
                <Input
                    children="End time"
                    type="time"
                    value={endTime}
                    validationError={emptyEndTime}
                    onChange = {endTimeHandle}
                />
        </div>
            <Input
                children="Event description"
                type="string"
                value={description}
                placeHolder="Enter description"
                validationError={emptyDescription}
                onChange = {descriptionHandle}
            />
            <div className={classes.eventColor}>
            <div>Color of the event:</div>
            <Select onChange={colorHandle} style={{backgroundColor: color}}>
                {Service.cardColors().map((color, index) =>
                <option key={`${index}color`} value={color} style={{backgroundColor: color}}></option>
                )}
            </Select>
        </div>
            <div className={classes.groupsAndFriends}>
            <h2>Share this event with:</h2>

                <div>
                    <h4>My groups</h4>
                    <div className={classes.listOfMembers}>
                        {groups.map(group=>
                            <div className={classes.member} key={group._id} onClick={e=> {e.preventDefault();addGroupFriendsToList(group)}}>
                                {group.title}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h4>My friends</h4>
                    <div className={classes.listOfMembers}>
                        {allFriendsFromGroups.map(friend=>
                            <div className={classes.member} key={friend.id} onClick={e=> {e.preventDefault(); addFriendToList(friend)}}>
                                {`${friend.firstName} ${friend.lastName}`}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Input
                children="Or find user by email"
                type="email"
                value={email}
                placeHolder="Enter the email"
                validationError={emptyListOfMembers}
                onChange = {membersHandle}
            />
            <div className={classes.foundName}>
                {email.length > 0
                    ?<>
                        {loadingName
                            ? <Loader/>
                            : <>
                                {newMember
                                    ?
                                    <>
                                        <div
                                            className={classes.name}>{`${newMember.firstName} ${newMember.lastName}`}</div>
                                        <SmallButton onClick={e=> {e.preventDefault(); addMemberToList()}} color="blue" children="+ Add"/>
                                    </>
                                    : <span className={classes.userNotFound}>User was not found</span>}
                            </>
                        }
                    </>
                    :null
                }
            </div>
            <h3>List of guests</h3>
            <div className={classes.listOfMembers}>

                {listOfMembers.map((member)=>
                    <div key={member.id} className={classes.memberLine}>
                        <div className={classes.member} key={member.id}>
                            {`${member.firstName} ${member.lastName}`}

                        </div>
                        <SmallButton onClick={e=> {e.preventDefault(); removeMemberFromList(member)}} color="red" children="-remove" />
                    </div>
                )}
            </div>

            {eventEdit
                ?<div className={classes.editButtons}>
                    <MedButton children="Edit" color="blue" onClick={e=> { handleSubmit(e, "edit")}}/>
                    <MedButton children="Delete" color="red" onClick={e=> {e.preventDefault(); if (window.confirm('Are you sure you wish to delete this item?'))handleSubmit(e, "delete")}}/>
                </div>
                :<MedButton children="Create" color="blue" onClick={e=> {handleSubmit(e, "create")}}/>
            }

            <div className={classes.resultRequest}>
                {loadingRequest
                    ?<Loader/>
                    :<>
                        {sendEventForm
                            ?<FlashMessage
                                text={flashMessageText}
                                sendForm={sendEventForm}
                                setSendForm={setSendEventForm}
                                formDecoration={eventFormDecoration}
                                setFormDecoration={setEventFormDecoration}
                                subsequentAction={subsequentAction} />
                            :null
                        }
                    </>
                }
            </div>
        </form>)
};
export default EventForm;
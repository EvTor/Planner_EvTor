import React, {useEffect, useState} from "react";
import classes from "./GroupForm.module.css";
import Input from "../UI/input/Input";
import MedButton from "../UI/button/MedButton";
import GroupService from "../../API/GroupService";
import Loader from "../UI/Loader/Loader";
import SmallButton from "../UI/button/SmallButton";
import FlashMessage from "../UI/FlashMessage/FlashMessage";

const GroupForm=({users,
                     modalActive,
                     setGroupForm,
                     setModalActive,
                     sendGroupForm,
                     setSendGroupForm,
                     groupFormDecoration,
                     setGroupFormDecoration,
                     groupEdit})=>{

    const [email, setEmail] = useState('');
    const [emailForMatching, setEmailForMatching] = useState('');
    const [newMember, setNewMember] = useState(false);
    const [title, setTitle] = useState('');
    const [listOfMembers, setListOfMembers] = useState([]);
    const [loadingName, setLoadingName] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [emptyGroupName, setEmptyGroupName] = useState(false);
    const [emptyListOfMembers, setEmptyListOfMembers] = useState(false);
    const [flashMessageText, setFlashMessageText] = useState('');

    useEffect(()=>{
        if (groupEdit){
            setTitle(groupEdit.title);
            const groupMembersWithoutFounder = groupEdit.user.map(member => member.user_id).slice(1);
            const listOfUsers = users.filter(user=>{
                return groupMembersWithoutFounder.some(member => {
                    return member === user.id
                })
            });
            setListOfMembers(listOfUsers);
        }
        else {setTitle('');
            setListOfMembers([])}
    }, [groupEdit]);

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
            setTitle('');
            setListOfMembers([]);
            setLoadingName(false);
            setLoadingRequest(false);
            setEmptyGroupName(false);
            setEmptyListOfMembers(false);
            setGroupFormDecoration("initial")
            setFlashMessageText('');
            setGroupForm(false);
        }
    }, [modalActive])
    const matchTypedUser = () =>{
            const matchedUsers = users.filter(user =>
                {if (user.email === emailForMatching)
                {return user}});
        if(Array.isArray(matchedUsers) && matchedUsers.length)
        {setNewMember(matchedUsers[0])}
        else {setNewMember(false)}
    };

    const membersHandle =(e)=>{
        setEmail(e.target.value);
        setEmptyListOfMembers(false);
    };
    const groupNameHandle =(e)=>{
        setTitle(e.target.value);
        setEmptyGroupName(false);
    };

    const handleSubmit =(e, req)=>{
    e.preventDefault();
    if(title.length < 1){
        setEmptyGroupName(true);
    };
    if(listOfMembers.length < 1){
        setEmptyListOfMembers(true);
    };

    if(title.length >= 1 && listOfMembers.length >= 1){

        const listOfMembersId = listOfMembers.map(member => member.id)
        const body = {
            title,
            user: listOfMembersId
        };
        setLoadingRequest(true);

        let submit = null;

        if(req === "create") {
            submit = GroupService.createNewGroup(body);
        };
        if(req === "edit")
        {submit = GroupService.updateCertainGroup(groupEdit._id, body);
        };
        if(req === "delete")
        {submit = GroupService.deleteGroup(groupEdit._id);
        };


        submit.then(data =>
            {console.log(data);
            setEmail('');
            setListOfMembers([]);
            setTitle('');
            setSendGroupForm(true);
            setGroupFormDecoration("success");
            setFlashMessageText(data);
            setLoadingRequest(false);
        })
            .catch(error =>
            {console.log(error);
            setEmail('');
            setListOfMembers([]);
            setTitle('');
            setSendGroupForm(true);
            setGroupFormDecoration("fail");
            setFlashMessageText(error.message);
            setLoadingRequest(false);
            })
        };
    };

    const addMemberToList =(e)=>{
    e.preventDefault();
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

    return(
        <form className={
            groupFormDecoration === "initial"
                ?`${classes.groupForm} ${classes.decorationInitial}`
                : groupFormDecoration === "success"
                    ?`${classes.groupForm} ${classes.decorationSuccess}`
                    :`${classes.groupForm} ${classes.decorationFail}`
        }>
            {groupEdit
            ?<h1>Update <br/> {groupEdit.title}</h1>
            :<h1>Create <br/> new group</h1>}

            <Input
                children="Group name"
                type="string"
                value={title}
                placeHolder="Enter the group name"
                validationError={emptyGroupName}
                onChange = {groupNameHandle}
            />

            <Input
                children="Add members"
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
                                        <SmallButton onClick={addMemberToList} color="blue" children="+ Add"/>
                                    </>
                                    : <span className={classes.userNotFound}>User was not found</span>}
                            </>
                        }
                    </>
                    :null
                }
            </div>
                <h3>List of members</h3>
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

            {groupEdit
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
                {sendGroupForm
                    ?<FlashMessage
                        text={flashMessageText}
                        sendForm={sendGroupForm}
                        setSendForm={setSendGroupForm}
                        formDecoration={groupFormDecoration}
                        setFormDecoration={setGroupFormDecoration}
                        subsequentAction={subsequentAction } />
                    :null
            }
                </>
            }
        </div>
    </form>)
};
export default GroupForm;
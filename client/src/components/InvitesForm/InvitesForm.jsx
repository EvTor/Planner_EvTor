import React, {useEffect, useState} from "react";
import classes from "./InvitesForm.module.css";
import MyEvent from "../UI/event/MyEvent";
import eventService from "../../API/EventService";
import Loader from "../UI/Loader/Loader";

const InvitesForm = ({
        modalActive,
        setInvitesForm,
        invites,
        users,
        acceptedInvite,
        setAcceptedInvite,
        declinedInvite,
        setDeclinedInvite,
        clickedAcceptInvite,
        clickedDeclineInvite,
        setSuccessfullyAcceptedInvite,
        setSuccessfullyDeclinedInvite}
)=>{

    const [loadingRequest, setLoadingRequest] = useState(false);

    useEffect(()=>{
        if(!modalActive){
            setInvitesForm(false);
        }
    }, [modalActive]);


    const handleAcceptInviteInDB = ()=>{
        setLoadingRequest(true);
        eventService.acceptEvent(acceptedInvite._id)
            .then(data =>
                {console.log(data.message);
                setSuccessfullyAcceptedInvite(true);
                setAcceptedInvite(false);
                setLoadingRequest(false);
            })
            .catch(error =>
                {console.log(error.message);
                setSuccessfullyAcceptedInvite(false);
                setAcceptedInvite(false);
                setLoadingRequest(false);
            })
    };
    const handleDeclineInviteInDB = ()=>{
        setLoadingRequest(true);
        eventService.rejectEvent(declinedInvite._id)
            .then(data =>
            {console.log(data);
                setSuccessfullyDeclinedInvite(true);
                setDeclinedInvite(false);
                setLoadingRequest(false);
            })
            .catch(error =>
            {console.log(error);
                setSuccessfullyDeclinedInvite(false);
                setDeclinedInvite(false);
                setLoadingRequest(false);
            })
    };

    useEffect(()=>{
        if(acceptedInvite){
            handleAcceptInviteInDB();
        }
    },[acceptedInvite]);

    useEffect(()=>{
        if(declinedInvite){
            handleDeclineInviteInDB();
        }
    },[declinedInvite]);

    return(
        <div className={classes.invitesForm}>
            {invites.length > 0
            ?<>
                    <div className={classes.title}>
                    <h1>My invites</h1>
                    </div>
                    <div className={classes.listOfInvites}>
                        {
                            loadingRequest
                                ?<div className={classes.divLoader}><Loader/></div>
                                :<>
                        {invites.map(invite=>
                        <MyEvent
                            key={invite._id}
                            users={users}
                            locationInInvite="true"
                            exactEvent={invite}
                            clickedAcceptInvite={clickedAcceptInvite}
                            clickedDeclineInvite={clickedDeclineInvite}/>
                    )}
                                </>
                        }
                    </div>

                </>
            :<h1>You do not have any invites</h1>}


    </div>
    )};

export default InvitesForm;
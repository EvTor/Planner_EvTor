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
                {console.log(data);
                setSuccessfullyAcceptedInvite(true);
                setAcceptedInvite(false);
                setLoadingRequest(false);
            })
            .catch(error =>
                {console.log(error);
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
            setAcceptedInvite(false);
        }
    },[acceptedInvite]);

    useEffect(()=>{
        if(declinedInvite){
            handleDeclineInviteInDB();
            setDeclinedInvite(false);
        }
    },[declinedInvite]);

    return(
        <div className={classes.invitesForm}>
            {invites
            ?<>
                    <div className={classes.title}>
                    <h1>My invites</h1>
                    </div>
                    <div className={classes.listOfInvites}>
                        {
                            loadingRequest
                                ?<div className={classes.divLoader}><Loader/></div>
                                :
                                <>
                                {invites
                                ?<>
                                    {invites.sort((a,b)=>{
                                            if(
                                                (parseInt(a.startDate.slice(0, 10).split('-').join('')+
                                                        a.startDate.slice(11, 16).split(':').join(''))
                                                    > parseInt(b.startDate.slice(0, 10).split('-').join('')+
                                                        b.startDate.slice(11, 16).split(':').join('')))
                                            ){return 1}
                                            if(
                                                (parseInt(a.startDate.slice(0, 10).split('-').join('')+
                                                        a.startDate.slice(11, 16).split(':').join(''))
                                                    < parseInt(b.startDate.slice(0, 10).split('-').join('')+
                                                        b.startDate.slice(11, 16).split(':').join('')))
                                            ){return - 1}
                                            return 0
                                        }).map(invite=>
                                            <MyEvent
                                                key={invite._id}
                                                users={users}
                                                locationInInvite="true"
                                                exactEvent={invite}
                                                clickedAcceptInvite={clickedAcceptInvite}
                                                clickedDeclineInvite={clickedDeclineInvite}/>
                                        )}
                                        </>
                                    :null
                                }

                                </>
                        }
                    </div>

                </>
            :<h1>You do not have any invites</h1>}


    </div>
    )};

export default InvitesForm;
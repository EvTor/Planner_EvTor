import React from "react";
import classes from "./InvitesForm.module.css";
import MyEvent from "../UI/event/MyEvent";

const InvitesForm = ({modalActive, setModalActive, invites, users})=>{

    return(
        <div className={classes.invitesForm}>
            {invites
            ?<>
                    <div className={classes.title}>
                    <h1>My invites</h1>
                    </div>
                    <div className={classes.listOfInvites}>
                {invites.map(invite=>
                        <MyEvent key={invite._id} users={users} locationInInvite="true" exactEvent={invite}/>
                    )}
                    </div>
                </>
            :<h1>You do not have any invites</h1>}


    </div>
    )};

export default InvitesForm;
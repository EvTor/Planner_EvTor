import React, {useEffect, useState} from 'react';
import InvitesForm from "../components/InvitesForm/InvitesForm";
import ModalWindow from "../components/UI/ModalWindow/ModalWindow";
import Header from "../components/Header/Header";
import {useNavigate} from "react-router-dom";
import UserService from "../API/UserService";
import EventService from "../API/EventService";
import Loader from "../components/UI/Loader/Loader";

const Invites = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [modalActive, setModalActive] = useState(true);

    useEffect(() => {
        if (!modalActive) {
            navigate('/planner')
        }
    }, [modalActive])
    const [invitesForm, setInvitesForm] = useState(false);
    const [invites, setInvites] = useState([]);
    const updateInvitesList = async () => {
        setIsLoading(true);
        const fetchInvites = await EventService.showNotAcceptedEvents();
        setInvites(fetchInvites);
        if (fetchInvites.length === 0) {
            navigate('/')
        }
        setIsLoading(false);
    };
    const [users, setUsers] = useState([]);
    const addUsersToList = async () => {
        setIsLoading(true);
        setUsers(await UserService.getUsersNames());
        setIsLoading(false);
    };

    const [acceptedInvite, setAcceptedInvite] = useState(false);
    const [declinedInvite, setDeclinedInvite] = useState(false);
    const clickedAcceptInvite = (exactEvent) => {
        setAcceptedInvite(exactEvent);
    };
    const clickedDeclineInvite = (exactEvent) => {
        setDeclinedInvite(exactEvent);
    };
    const [successfullyAcceptedInvite, setSuccessfullyAcceptedInvite] = useState(false);
    const [successfullyDeclinedInvite, setSuccessfullyDeclinedInvite] = useState(false);
    useEffect(() => {
        addUsersToList();
        updateInvitesList();
    }, [acceptedInvite, declinedInvite]);

    useEffect(() => {
        if (successfullyAcceptedInvite) {
            updateInvitesList();
            setSuccessfullyAcceptedInvite(false);
        }
    }, [successfullyAcceptedInvite]);

    useEffect(() => {
        if (successfullyDeclinedInvite) {
            updateInvitesList();
            setSuccessfullyDeclinedInvite(false);
        }
    }, [successfullyDeclinedInvite]);
    return (
        <>
            {isLoading
                ?
                <div className="basicLoader">
                    <Loader/>
                </div>
                :
                <>
                    <Header/>
                    <ModalWindow active={modalActive} setActive={setModalActive}>
                        <InvitesForm
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
                        /></ModalWindow>
                </>
            }
        </>
    );
};

export default Invites;
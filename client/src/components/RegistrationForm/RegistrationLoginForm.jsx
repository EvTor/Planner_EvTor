import React, {useContext, useEffect, useState} from "react";
import classes from './RegistrationLoginForm.module.css'
import BigButton from "../UI/button/BigButton";
import MyInput from "../UI/input/Input";
import UserService from "../../API/UserService";
import {Link, useNavigate} from "react-router-dom";
import FlashMessage from "../UI/FlashMessage/FlashMessage";
import Loader from "../UI/Loader/Loader";
import MedButton from "../UI/button/MedButton";
import {UserContext} from "../../context/context";


const RegistrationLoginForm = ({ registration, login }) => {

    const [firstName, setFirstName] = useState('');
    const [notValidFirstName, setNotValidFirstName] = useState(false);
    const [lastName, setLastName] = useState('');
    const [notValidLastName, setNotValidLastName] = useState(false);
    const [email, setEmail] = useState('');
    const [notValidEmail, setNotValidEmail] = useState(false);
    const [password, setPassword] = useState('');
    const [notValidPassword, setNotValidPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notValidConfirmPassword, setNotValidConfirmPassword] = useState(false);

    const [sendForm, setSendForm] = useState(false);
    const [formDecoration, setFormDecoration] = useState("initial");

    const [loadingRequest, setLoadingRequest] = useState(false);
    const [flashMessageText, setFlashMessageText] = useState('');

    const navigate = useNavigate();

    const {setIsAuth, userData, setUserData} = useContext(UserContext);

    const firstNameHandleChange =(e)=> {
        setFirstName(e.target.value);
        setNotValidFirstName(false);
    };

    const lastNameHandleChange =(e)=> {
        setLastName(e.target.value);
        setNotValidLastName(false);
    };

    const emailHandleChange =(e)=> {
        setEmail(e.target.value);
        setNotValidEmail(false);
    };

    const passwordHandleChange =(e)=> {
        setPassword(e.target.value);
        setNotValidPassword(false);
    };

    const confirmPasswordHandleChange =(e)=> {
        setConfirmPassword(e.target.value);
        setNotValidConfirmPassword(false);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoadingRequest(true);
        if(firstName.length < 1){
            setNotValidFirstName(true)
        };
        if(lastName.length < 1){
            setNotValidLastName(true);
        };
        if(email.length < 1){
            setNotValidEmail(true);
        };
        if(password.length < 1){
            setNotValidPassword(true);
        };
        if(confirmPassword.length < 1 || confirmPassword !== password){
            setNotValidConfirmPassword(true);
        };


        if (registration && firstName.length >= 1 && lastName.length >= 1 && email.length >= 3 && password.length >= 3 &&
            confirmPassword.length > 1 && confirmPassword === password) {
            const body = {
                firstName,
                lastName,
                email,
                password
            }

            UserService.registration(body)
                .then((data) => {
                    console.log(data);
                    setFlashMessageText(data.message);
                    setSendForm(true);
                    setFormDecoration("success");
                    setLoadingRequest(false);

                })
                .catch((error)=>{
                    console.log(error);
                    setFlashMessageText(error);
                    setSendForm(true);
                    setFormDecoration("fail");
                    setLoadingRequest(false);
                })
        };
        if (login && email.length >= 3 && password.length >= 3) {
            const body = {
                email,
                password
            }
            UserService.login(body)
                .then((data) => {
                    console.log(data);
                    //setFlashMessageText(data.message);
                    setSendForm(true);
                    setFormDecoration("success");
                    setUserData(data.user);
                    setLoadingRequest(false);})
                .catch((error)=>{
                    console.log(error);
                    //setFlashMessageText(error);
                    setSendForm(true);
                    setFormDecoration("fail");
                    setLoadingRequest(false);
                })
        }
    };

    const subsequentAction = () =>{
        if(registration && sendForm && formDecoration === "success")
        {navigate("/login")};
        if(login && sendForm && formDecoration === "success")
        {setIsAuth(true);
            navigate("/planner")};
    };

    return (
        <div className={classes.background}>

            <form className={
                formDecoration === "initial"
                    ?`${classes.myForm} ${classes.decorationInitial}`
                    : formDecoration === "success"
                        ?`${classes.myForm} ${classes.decorationSuccess}`
                        :`${classes.myForm} ${classes.decorationFail}`
            }>
                <h1>{registration
                    ? "Registration"
                    : "Login"
                }</h1>
                <div className={classes.divInputs}>
                    {registration
                        ? <>
                            <div className={classes.nameSurname}>
                                <MyInput
                                    children="Name"
                                    type="text"
                                    value={firstName}
                                    placeHolder="Your last name"
                                    validationError={notValidFirstName}
                                    onChange={firstNameHandleChange}
                                />
                                <MyInput
                                    children="Surname"
                                    type="text"
                                    value={lastName}
                                    placeHolder="Your first name"
                                    validationError={notValidLastName}
                                    onChange={lastNameHandleChange}

                                />
                            </div>
                        </>
                        : null}

                    {registration || login
                        ? <>
                            <MyInput
                                children="E-mail"
                                type="text"
                                value={email}
                                placeHolder="Enter your e-mail"
                                validationError={notValidEmail}
                                onChange={emailHandleChange}
                                autocomplete="username"
                            />
                            <MyInput
                                children="Password"
                                type="password"
                                value={password}
                                placeHolder="3 characters minimum"
                                validationError={notValidPassword}
                                onChange={passwordHandleChange}
                                autocomplete="new-password"
                            />
                        </>
                        : null
                    }
                    {registration
                        ? <>
                            <MyInput
                                children="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                placeHolder="3 characters minimum"
                                validationError={notValidConfirmPassword}
                                onChange={confirmPasswordHandleChange}
                                autocomplete="new-password"
                            />
                        </>
                        : null}

                </div>
                {login
                    ? <div className={classes.LoginReg}>
                        <BigButton
                            onClick={handleSubmit}
                            children="Login"
                            color="blue"
                            style={{ display: "block", margin: "1rem auto" }} />
                        <div className={classes.Account}>
                            <h4 style={{ textAlign: "center" }}>Don't have an account?</h4>
                            <Link to="/registration" className={classes.Link}>
                                <MedButton
                                    children="Create new account"
                                    color="grey"
                                />
                            </Link>
                        </div>

                    </div>
                    : null}
                {registration
                    ? <div className={classes.LoginReg}>
                        <BigButton
                            onClick={handleSubmit}
                            children="Create new account"
                            color="blue" />
                        <div className={classes.Account}>
                            <h4 style={{ textAlign: "center" }}>Already registered?</h4>
                            <Link to="/login" className={classes.Link}>
                                <MedButton
                                    children="Login"
                                    color="grey"
                                />
                            </Link>
                        </div>
                    </div>
                    : null}

                <div className={classes.resultRequest}>

                    {loadingRequest
                        ?<Loader/>
                        :<>
                            {sendForm
                                ?<FlashMessage
                                    text={flashMessageText}
                                    sendForm={sendForm}
                                    setSendForm={setSendForm}
                                    formDecoration={formDecoration}
                                    setFormDecoration={setFormDecoration}
                                    subsequentAction={subsequentAction}
                                />
                                :null
                            }
                        </>
                    }
                </div>
            </form>
        </div>
    )
};
export default RegistrationLoginForm;
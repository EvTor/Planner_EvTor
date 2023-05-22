import React, { useState } from "react";
import classes from './RegistrationLoginForm.module.css'
import MyButton from "../UI/button/BigButton";
import MyInput from "../UI/input/Input";
import UserService from "../../API/UserService";
import { Link } from "react-router-dom";


const RegistrationLoginForm = ({ registration, login }) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (registration) {
            const body = {
                firstName,
                lastName,
                email,
                password
            }

            UserService.registration(body).then((data) => console.log(data))
        }
        if (login) {
            const body = {
                email,
                password
            }
            UserService.login(body).then((data) => console.log(data))
        }

    };

    return (
        <div className={classes.background}>
            <form className={classes.Myform}>
                <h1>Welcome</h1>
                <div className={classes.divInputs}>
                    {registration
                        ? <>
                            <h2>Registration</h2>
                            <MyInput
                                children="Name"
                                type="text"
                                value={firstName}
                                onChange={event => setFirstName(event.target.value)}
                            />
                            <MyInput
                                children="Surname"
                                type="text"
                                value={lastName}
                                onChange={event => setLastName(event.target.value)}
                            />
                        </>
                        : null}
                    {login
                        ? <h2>Login</h2>
                        : null}

                    {registration || login
                        ? <>
                            <MyInput
                                children="E-mail"
                                type="text"
                                value={email}
                                onChange={event => setEmail(event.target.value)}
                            />
                            <MyInput
                                children="Password"
                                type="text"
                                value={password}
                                onChange={event => setPassword(event.target.value)}
                            />
                        </>
                        : null
                    }
                    {registration
                        ? <>
                            <MyInput
                                children="Confirm Password"
                                type="text"
                                value={confirmPassword}
                                onChange={event => setConfirmPassword(event.target.value)}
                            />
                        </>
                        : null}

                </div>
                {login
                    ? <>
                        <MyButton
                            onClick={handleSubmit}
                            children="Login"
                            style={{ display: "block", margin: "1rem auto" }} />
                        <div className={classes.Account}>
                            <h4 style={{ textAlign: "center" }}>Don't have an account?</h4>
                            <Link to="/registration" className={classes.Link}>
                                <MyButton
                                    children="Create new account"
                                />
                            </Link>
                        </div>

                    </>
                    : null}
                {registration
                    ? <>
                        <MyButton
                            onClick={handleSubmit}
                            children="Create new account"
                            style={{ display: "block", margin: "1rem auto" }} />
                        <div className={classes.Account}>
                            <h4 style={{ textAlign: "center" }}>Already registered?</h4>
                            <Link to="/login" className={classes.Link}>
                                <MyButton
                                    children="Login"
                                />
                            </Link>
                        </div>
                    </>
                    : null}


            </form>
        </div>
    )
};
export default RegistrationLoginForm;
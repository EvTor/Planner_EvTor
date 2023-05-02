import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import RegistrationLoginForm from "../components/RegistrationForm/RegistrationLoginForm";


const Registration = () => {

    return (
        <div>
            <RegistrationLoginForm registration={true} />
        </div >
    );
}

export default Registration;

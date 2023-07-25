import React, {useContext} from "react";
import userService from "../../API/UserService";
import {Link, useNavigate} from "react-router-dom";
import { UserContext} from "../../context/context";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Logo from "./img/Logo.png"
import Button from 'react-bootstrap/Button';
const Header = () => {
    const {userData, setIsAuth} = useContext(UserContext);
    const navigate = useNavigate();
    const logoutHandle = async () => {
        await userService.logout();
        setIsAuth(false);
        navigate("/");
    };
    return (
        <header>
            <Navbar collapseOnSelect expand="lg" bg="primary" data-bs-theme="dark">
                <Container>
                    <Link to="/planner">
                    <Navbar.Brand >
                        <img
                            alt=""
                            src={Logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />
                        <strong>Planner EvTor</strong>
                    </Navbar.Brand>
                </Link>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/aboutApp">About app</Link>
                    </Nav>
                        <Nav>
                            <Navbar.Text>
                                Signed in as: <strong class="me-2"> {userData.firstName} {userData.lastName}  </strong>
                            </Navbar.Text>
                                <Button variant="secondary" onClick={logoutHandle}>Logout</Button>
                        </Nav>

                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </header>)
};

export default Header;
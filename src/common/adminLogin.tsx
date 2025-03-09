import React, { useState } from "react";
import { AuthService } from "../services/AuthService";
import {useHistory } from "react-router-dom";
import Swal from 'sweetalert2'

const Login: React.FC = () => {
    const initialState = { email: "", password: "" };
    const history = useHistory();
    const [userData, setUserData] = useState(initialState);
    const [disabledBtn, setDesableBtn] = useState<boolean>(false);
    const submitLogin = () => {
        if (!userData.email) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter user email!',
            });
            return;
        }
        if (!userData.password) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter user password!',
            });
            return;
        } else {
            AuthService.userLogin(userData.email, userData.password)
                .then((res) => {
                    if (res.user) {
                        setDesableBtn(false)
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Please verify your account!',
                        });
                    }
                }).catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Invalid login credentials. Please check your email and password.',
                        });
                });
        }
    };



    return (
        <React.Fragment>
            <div className="content-wrapper ">
                <main>
                    <main className="login-bg">

                        <div className="login-form-area">
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-xl-7 col-lg-8">
                                        <div className="login-form">

                                            <div className="login-heading">
                                                <span>Login</span>
                                                <p>Enter Login details to get access</p>
                                            </div>

                                            <div className="input-box">
                                                <div className="single-input-fields">
                                                    <label>Username or Email Address</label>
                                                    <input type="text" placeholder="Username / Email address" onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                                                </div>
                                                <div className="single-input-fields">
                                                    <label>Password</label>
                                                    <input type="password" placeholder="Enter Password" onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-end">
                                                <button className="submit-btn3 d-flex align-items-center" onClick={submitLogin}>Login</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </main>
                </main>
            </div>

        </React.Fragment>
    );
};

export default Login;

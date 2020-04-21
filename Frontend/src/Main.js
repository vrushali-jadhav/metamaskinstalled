import React, { Component } from "react";
import { Route } from "react-router-dom";
import LoginForm from "./loginForm";
import './App.css';
import Register from "./Register";
import RegisterInfo from "./RegisterInfo";
import TakePhoto from "./TakePhoto";
import TakeRegisterPhoto from "./TakeRegisterPhoto";
import Welcome from "./Welcome";
import VerifyEmail from "./VerifyEmail";
import { Link, Redirect } from 'react-router-dom';
import MainHome from "./MainHome";

class Main extends Component {
    render() {
        return (
            <div>
                <div>
                    <Route exact path="/" component={MainHome}/>
                    <Route exact path="/Login" component={LoginForm} />
                    <Route exact path="/RegisterInfo" component={RegisterInfo} />
                    <Route exact path="/TakePhoto" component={TakePhoto} />
                    <Route exact path="/welcome" component={Welcome} />
                    <Route exact path="/verifyemail" component={VerifyEmail} />
                    <Route exact path="/takeregisterphoto" component={TakeRegisterPhoto} />
                </div>
            </div>
        );
    }
}
//Export The Main Component
export default Main;

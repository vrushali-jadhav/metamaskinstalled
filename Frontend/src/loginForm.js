import React from 'react';
import renderHTML from 'react-render-html';
import inputFields from './inputFields';
import SubmitButton from './submitButton';
import UserStorage from './stores/UserStorage';
import { Link, Redirect } from 'react-router-dom';
import Register from './Register';
import swal from "sweetalert2";
import './App.css';
import InputFields from './inputFields';
import VoterContract from './VoterContract';
var CryptoJS = require("crypto-js");

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            privatekey: '',
            buttonDisabled: false
        }
    }

    setInputValue(property, val) {
        this.setState({
            [property]: val
        })
    }

    async doLogin() {
        if (!this.state.username)
            return;
        if (!this.state.password)
            return;
        if (!this.state.privatekey)
            return;
        this.setState({
            buttonDisabled: true
        })
 
        try {
            console.log("in dologin: " +this.state.username);
            console.log("passwrd: " +this.state.password);
            console.log("pk: " +this.state.privatekey);
            let res = await fetch('http://localhost:3003/login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                })
            });
            
            let result = await res.json();
            console.log("result: "+result);

            if (result && result.success) {
                // let redirectVar = null;
                UserStorage.isLoggedIn = true;
                UserStorage.username = result.username;
                
                console.log("Log in successful..");

                //get voterid from SQL
                let res = await fetch('http://localhost:3003/getVoterId', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: result.username,
                    })
                });

                let result2 = await res.json();
                if (result2 && result2.success){
                    var id = result2.voterid;
                    console.log("Voter id: " + id);
                
                    //get user json from blockchain and decrypt using private key
                    const voter = await VoterContract.methods.getVoterInformation(id).call();
                    console.log("Got the voter from blockchain: "+voter);
                    var bytes  = CryptoJS.AES.decrypt(voter.hash, this.state.privatekey);
                    var voterinfo = bytes.toString(CryptoJS.enc.Utf8);
                    console.log("Voter information after decrption: ", voterinfo);
                    
                    this.props.history.push({
                        pathname: "/takephoto",
                        state: {
                            voterinfo: voterinfo
                        }
                    });
                }
                else{
                    swal.fire({
                        icon: 'error',
                        title: 'Login failed',
                        text: 'Voter ID not found in DB',
                        confirmButtonText: "OK"
                    });
                    this.props.history.push("/Login");
                }
            }

            else if (result && result.success === false) {
                swal.fire({
                    icon: 'error',
                    title: 'Login failed',
                    text: 'Username password did not match',
                    confirmButtonText: "OK"
                });
                this.props.history.push("/Login");
            }

            else{
                console.log("nothing");
            }
        }
        catch (e) {

        }
    }

    render() {
        let redirectVar = null;
        if (UserStorage.username) {
            redirectVar = <Redirect to="/welcome" />
        }
        return (


            <div className='container'>
                {/* {redirectVar} */}
                {/* <div className="body"> */}
                <div className="header">
                    <ul className="navbar-nav" id="navg">
                        <li className="nav-item">
                            <Link to="/RegisterInfo" className="nav-link reg" id="log"> Register
                    </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/Login" className="nav-link" id="log"> Login
                    </Link>
                        </li>
                        {/* <li className="nav-item">
                        <a className="nav-link active" id="hom" >Home</a>
                    </li> */}
                        <li className="nav-item">
                            <a className=" brand">Electronic</a>
                        </li>
                        <li className="nav-item">
                            <a className=" colorb">Ballot</a>
                        </li>
                    </ul>
                </div>
                <div className="row">
                    <div className="pitchline" id="pitch">
                        <div id="Main">Online election perfection!</div>
                        <div id="about">Our E-Voting solution is here for you.</div>
                    </div>
                </div>

                <div className="maps"></div>
                <div className="qoute">
                    <div className="h3" className="since-title"> Helping People Connect
                    <br></br>Since 2020
                    <p>Security & Trust</p>
                    </div>
                </div>
                <div className="logindetails">Enter credentials
                    <InputFields type='text' placeholder='Username'
                        value={this.state.username ? this.state.username : ''}
                        onChange={(val) => this.setInputValue('username', val)}
                    />
                    <InputFields type='password' placeholder='Password'
                        value={this.state.password ? this.state.password : ''}
                        onChange={(val) => this.setInputValue('password', val)}
                    />
                    <InputFields type='text' placeholder='Metamask account private key'
                        value={this.state.privatekey ? this.state.privatekey : ''}
                        onChange={(val) => this.setInputValue('privatekey', val)}
                    />
                    <SubmitButton
                        text='Login'
                        disabled={this.state.buttonDisabled}
                        onClick={() => this.doLogin()}
                    />
                </div>

                <div className="row">
                    < div className="reviews">
                        <div className="reviewtitle">
                            <div className=" h3 titlemessage"> Straight from the horses mouth! </div>
                            <span></span>
                            <p>ElectronicBallot has been rated 4.8 out of 5 stars with 430000+ reviews</p>
                        </div>
                        <div className="col-md-4 customer">
                            <div className="photoandstar">
                                <div className="custname">Vrushali</div>
                                <div className="custphoto1"></div>
                                <div className="stars">
                                    <span className="fa fa-star checked"></span>
                                    <span className="fa fa-star checked"></span>
                                    <span className="fa fa-star checked"></span>
                                    <span className="fa fa-star checked"></span>
                                    <span className="fa fa-star checked"></span>
                                </div>
                            </div>
                            <div className="review">
                                When nothing else worked, ElectronicBallot came to the rescue.
                </div>
                        </div>
                        <div className="col-md-4 customer">
                            <div className="photoandstar">
                                <div className="custname">Nistha</div>
                                <div className="custphoto2"></div>
                                <div className="stars">
                                    <span className="fa fa-star checked"></span>
                                    <span className="fa fa-star checked"></span>
                                    <span className="fa fa-star checked"></span>
                                    <span className="fa fa-star checked"></span>
                                    <span className="fa fa-star checked"></span>
                                </div>
                            </div>
                            <div className="review">
                                Easy and hassle free.
                </div>
                        </div>
                        <div className="col-md-4 customer">
                            <div className="photoandstar">
                                <div className="custname">Aditya</div>
                                <div className="custphoto3"></div>
                                <div className="stars">
                                    <span className="fa fa-star checked"></span>
                                    <span className="fa fa-star checked"></span>
                                    <span className="fa fa-star checked"></span>
                                    <span className="fa fa-star checked"></span>
                                    <span className="fa fa-star checked"></span>
                                </div>
                            </div>
                            <div className="review">
                                ElectronicBallot has reduced the voting time by 90%.
                </div>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>

        );
    }
}

export default LoginForm;

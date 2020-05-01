import React, { Component } from "react";
import axios from 'axios';
import renderHTML from 'react-render-html';
import { Link, Redirect } from 'react-router-dom';
import RegisterStorage from "./stores/RegisterStorage";
import swal from "sweetalert2";
import './Register.css';
import './takephoto.css';
import web3 from './web3';
import VoterContract from './VoterContract';
var CryptoJS = require("crypto-js");

class TakeRegisterPhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: this.props.location.state.password,
            username:this.props.location.state.username,
            fname: this.props.location.state.fname,
            lname: this.props.location.state.lname,
            dob: this.props.location.state.dob,
            gender: this.props.location.state.gender,
            email: this.props.location.state.email,
            metaaddress: '',
            privateKey: '',
            publicKey: ''
        }
        this.captureImage = this.captureImage.bind(this)
    }

    async captureImage() {
        if (!this.state.username)
        return;

        try{
                console.log('in capture image ')
                var data = {}
                data.username= this.state.username

                const response = await axios.post('http://localhost:5000/api/register',data)
            
                console.log(" response.data" + response)
                console.log(" response.data" + JSON.stringify(response.data))

                let jsonres = response.data;
                console.log("jres: " +jsonres);
                
                let cont = jsonres.content;
                console.log("cont: " + cont)

                let fv = cont.feature_vector;
            
                console.log("type1: " + typeof(fv));
                console.log("Response from fr: "+fv);
               
            
                let result = response.data.success;
                
                    if (result) 
                    {
                        console.log("image upload success");
                        swal.fire({
                            icon: 'success',
                            title: 'Congrats!! Image Taken!',
                            text: 'You have succesfully uploaded your image!',
                            confirmButtonText: "OK"
                        });

                        //create metamask account
                        console.log("creating an account..");
                        var responsemeta = await web3.eth.accounts.create(web3.utils.randomHex(32));
                        console.log("responsemeta: "+responsemeta);
                        this.state.metaaddress = responsemeta.address;
                        console.log(this.state.metaaddress);
                        this.state.privateKey = responsemeta.privateKey;
                        console.log(this.state.privateKey);
                        

                        swal.mixin({
                            confirmButtonText: 'Next &rarr;',
                            showCancelButton: true,
                            progressSteps: ['1', '2']
                        }).queue([
                            {
                                title: 'Step 1',
                                text: 'Kindly safely save the private key displayed in next step. It is required for login.'
                            },
                            {
                                title: 'Step 2',
                                text: this.state.privateKey
                            }
                        ]).then((result) => {
                            if (result.value) {
                            const answers = JSON.stringify(result.value)
                            swal.fire({
                                title: 'All done!',
                                confirmButtonText: 'Lovely!'
                            })
                            }
                        })

                        //store information in DB
                        try {
                            let res = await fetch('http://localhost:3003/voterinfopost', {
                                method: 'post',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    password: this.state.password,
                                    username:this.state.username,
                                    metamaskaddrss: this.state.metaaddress
                                })
                            });
                            
                            let result = await res.json();
                            console.log("response from db: ", result);

                            if(result.msg == "Username already taken")
                            {
                                swal.fire({
                                    icon: 'error',
                                    title: 'Username is taken',
                                    text: 'Try Again',
                                    confirmButtonText: "OK"
                                });
                                this.props.history.push("/RegisterInfo");
                            }

                            if (result && result.success) {
                                //send information to blockchain
                                console.log("Voterid is : "+result.voterid);
                                
                                var voterinfo = {
                                        fv: fv,
                                        password: this.state.password,
                                        username: this.state.username,
                                        fname: this.props.location.state.fname,
                                        lname: this.props.location.state.lname,
                                        dob: this.props.location.state.dob,
                                        gender: this.props.location.state.gender,
                                        id: result.msg
                                }

                                console.log("Type of private key var in register: "+ typeof(this.state.privateKey));
                                var voterinfocipher = CryptoJS.AES.encrypt(JSON.stringify(voterinfo), this.state.privateKey);
                                console.log("Encrypted info: ", voterinfocipher.toString());

                                
                                //store ciphertext on blockchain
                                var accounts = await web3.eth.getAccounts();
                                console.log("web3", accounts);
                                console.log("aing: "+ accounts[0]);
                                web3.eth.defaultAccount = accounts[0];
                                
                                await VoterContract.methods.register(result.voterid, voterinfocipher.toString()).send({from: accounts[0]});
                                
                                swal.fire({
                                    icon: 'success',
                                    title: 'Congratulations!',
                                    text: 'Voter information stored on blockchain',
                                    confirmButtonText: "OK"
                                });
                                
                                this.props.history.push("/Login");
                            }
                
                            else if (result && result.success === false) {
                                console.log("registration failed ")
                                swal.fire({
                                    icon: 'error',
                                    title: 'Failed to store registration data in database',
                                    text: 'Try Again',
                                    confirmButtonText: "OK"
                                });
                                this.props.history.push("/RegisterInfo");
                            }
                        }
                        catch (e) {
                
                        }
                    }
                    else{
                        console.log("image upload failed");
                    }
                
        }catch(e){

        }
    }

    render() {
      return (
       
 <div className ="container">
        <div className= "header">
            <li className="nav-item">
                <a className=" brand">Electronic</a>
            </li>
            <li className="nav-item">
                <a className="colorb">Ballot</a>
            </li>
            <Link to="/AdminLogin" className="nav-item nav-link admin" id="log"> Setup-Campaign
            </Link>
            <Link to="/RegisterInfo" className="nav-item nav-link reg" id="log"> Register
            </Link>
            <Link to="/Login" className="nav-item nav-link log" id="log"> Login
            </Link>
        </div>

    <div className="row">
        <div className="pitchline" id="pitch">
            <div id="Main">Online election perfection!</div>
            <div id="about">Our E-Voting solution is here for you.</div>
        </div>
    </div>  

    <div className="row">
            <div className="information" >
                <div className="registerimagever col-md-6"></div>
                <div className="qoutetakephoto">
                    <div className ="h3" className="since-title"> Helping People Connect
                        <br></br>Since 2020
                        <p>Security & Trust</p>
                    </div>
            </div>
            </div>
            <div className="canvasphoto" id="canvas" >
            <div className="phototext">Photo:</div>
                    <video className="videoclass" id="videoForImage" autoPlay width="250px" height="200px"></video>
                    <div></div>
                    <button className="btn" id="capture" onClick={this.captureImage}>Capture</button>
            </div>
    </div>
    </div>   
      );
    }
  }
  //Export The Main Component
  export default TakeRegisterPhoto;
  
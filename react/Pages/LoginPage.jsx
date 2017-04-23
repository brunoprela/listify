import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';
import SwitchableHeader from '../Elements/SwitchableHeader.jsx';
// import userServices from '../../services/userServices.js';

class LoginPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            loginUser : '',
            loginPass : '',
            registerUser : '',
            registerPass : '',
            headerSide : 'LEFT'
        };
        this.updateFormVal = this.updateFormVal.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.registerUser = this.registerUser.bind(this);
    }

    componentWillMount() {
      this.props.showNavbar(false);
    }

    updateFormVal(event){
        var updatedField = event.target.name;
        var updatedValue = event.target.value;
        this.setState((prevState) => {
            prevState[updatedField] = updatedValue;
            return prevState;
        })
    }

    registerUser(username, password){
        this.props.registerUser(this.state.registerUser, this.state.registerPass);
    }

    loginUser(){
        this.props.loginUser(this.state.loginUser, this.state.loginPass);
    }

    didSwitchHeader(headerSide) {
      this.setState({headerSide: headerSide})
    }

    render(){
      var logo = require('../../public/assets/List.svg');
      var switchableHeaderStyle = {
        marginLeft: "20px",
        marginBottom:"40px"
      }
        return (
            <div className = "LoginPage">
                <div className='UserAuthContainer'>
                  <div className = "WelcomeSection">
                    <img className = "WelcomeLogo" src = {logo} />
                    <h2>Welcome to Listify</h2>
                    <div>
                      <p>1. Create a Poll</p>
                      <p>2. Have people rank their preferences</p>
                      <p>3. See what you've all agreed upon!</p>
                    </div>

                  </div>
                    <div className='SignInForm'>
                      <div className = "LoginHeader">
                        <SwitchableHeader
                                          leftTitle = "Login"
                                          rightTitle = "Sign up"
                                          didSwitchHeader = {this.didSwitchHeader.bind(this)}
                                          />
                      </div>
                      {this.state.headerSide === 'LEFT' &&
                        <div className='form'>
                            <div className='form-group'>
                                <input className='username'
                                       name='loginUser'
                                       placeholder='username'
                                       value={this.state.loginUser}
                                       onChange={this.updateFormVal}
                                />
                            </div>
                            <div className='form-group'>
                                <input className='password'
                                       type='password'
                                       name='loginPass'
                                       placeholder='password'
                                       value={this.state.loginPass}
                                       onChange={this.updateFormVal}
                                />
                            </div>
                            <button className='login-button' onClick={this.loginUser}>Sign In</button>
                        </div>
                        }
                    </div>

                    {this.state.headerSide === 'RIGHT' &&

                    <div className='RegisterForm'>
                        <div className='form'>
                            <div className='form-group'>
                                <input className='username'
                                       name='registerUser'
                                       placeholder='username'
                                       value={this.state.registerUser}
                                       onChange={this.updateFormVal}
                                />
                            </div>
                            <div className='form-group'>
                                <input className='password'
                                       type='password'
                                       name='registerPass'
                                       placeholder='password'
                                       value={this.state.registerPass}
                                       onChange={this.updateFormVal}
                                />
                            </div>
                            <button className='signup-button' onClick={this.registerUser}>Register</button>
                        </div>
                    </div>
                    }
                </div>
                <div className="errorMessage">
                    {this.props.errorMessage &&
                    <p style = {{color:"red"}}>{this.props.errorMessage}</p>
                    }
                </div>
            </div>

        )
    }
}

export default withRouter(LoginPage);

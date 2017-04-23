import React, { Component } from 'react';
import CreateListPage from './Pages/CreateListPage.jsx';
import EditRankingsPage from './Pages/EditRankingsPage.jsx';
import LoginPage from './Pages/LoginPage.jsx'
import ViewConsensusRankingPage from './Pages/ViewConsensusRankingPage.jsx';
import Navbar from './Elements/Navbar.jsx';
import { withRouter } from 'react-router';
import userServices from '../services/userServices.js';
import rankingServices from '../services/rankingServices.js'

class App extends Component {
	constructor(props){
        super(props);
        this.state = {
            user : undefined,
            test : "test data",
						showNavbar : true,
            list : {
                creator: '',
                title: '',
                description: '',
                rankings: [],
                completed: false,
                public: false,
                all_items: [],
            },

            errorMessage : ''
        };
        this.loginUser = this.loginUser.bind(this);
        this.logout = this.logout.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.loadEditPage = this.loadEditPage.bind(this);
        this.updateEditPage = this.updateEditPage.bind(this);
    }

    componentWillMount(){
        userServices.getCurrentUser()
            .then((res) => {
                if (res.content.loggedIn) {
                    this.setState({user : res.content.user});
                }
            });
    }

    updateEditPage(request){
        request.then((response) => {
            this.setState((prevState) => {
                prevState.list = response.content.list;
                return prevState
            });
        })
    }

    loginUser(username, password){
        userServices.login(username, password)
            .then((res) => {
                if (res.success){
                    this.setState((prevState) => {
                        prevState.user = res.content.user;
                        return prevState;
                    });
                    this.props.router.push('/');
                }
            }).catch((err) => {
                this.setState({errorMessage: err.error.err});
            });
    }

	logout() {
        userServices.logout().then((res) => {
            if (res.success){
                this.setState((prevState) => {
                    prevState.user = 'Not Logged In';
                    return prevState;
                });
                this.setState({ errorMessage : '' });
                this.props.router.push('/signin');
            }
        });
	}

  registerUser(username, password){
      userServices.register(username, password).then((res) => {
          if (res.success) {
              this.loginUser(username, password);
          }
      }).catch((err) => {
          this.setState({errorMessage : err.error.err});
      });
  }

	profile() {
		this.props.router.push('/your');
	}

  loadEditPage() {
      rankingServices.loadEditPage().then((resp) => {
          this.setState((prevState) => {
              prevState.list = resp.content.list;
              return prevState;
          });
      });
  }

	showNavbar(show) {
		this.setState({showNavbar:show});
	}

	render(){
    return (
			<div id = "app">
				{this.state.showNavbar &&
					<Navbar
							logout = {this.logout.bind(this)}
							profile = {this.profile.bind(this)}
						/>
				}
				<div className="content">
					{React.cloneElement(this.props.children, {
                        userServices : userServices,
                        rankingServices : rankingServices,
                        user : this.state.user,
                        loginUser : this.loginUser,
                        errorMessage : this.state.errorMessage,
                        registerUser : this.registerUser,
                        loadEditPage : this.loadEditPage,
                        updateEditPage : this.updateEditPage,
												showNavbar : this.showNavbar.bind(this),
												profile : this.profile.bind(this),
												logout : this.logout.bind(this)
                    })}
				</div>
			</div>
        );
    }
};

App.propTypes = {
    children : React.PropTypes.any.isRequired
};

export default withRouter(App);

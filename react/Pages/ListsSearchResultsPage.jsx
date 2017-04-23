import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import ViewableList from '../Elements/Lists/ViewableList.jsx';
import Navbar from '../Elements/Navbar.jsx';
import BottomRightButton from '../Elements/BottomRightButton.jsx';
import SwitchableHeader from '../Elements/SwitchableHeader.jsx';
import SearchableNavbar from '../Elements/SearchableNavbar.jsx';
import { withRouter } from 'react-router';
import listServices from '../../services/listServices.js';

class ListsSearchResultsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {foundLists:[], searchString: this.props.params.searchString};
    }

    componentWillMount() {
        this.props.showNavbar(false);
        var searchString = this.props.params.searchString;
        this.searchLists(searchString);
    }

    componentWillUnmount() {
        this.props.showNavbar(true);
    }

    searchLists(searchString) {
        var path = "/lists/search/"+searchString;
        this.props.router.push(path);
        listServices.search(searchString).then((res) => {
            if (res.success){
                var lists = res.content.lists;
                this.setState({foundLists:lists, searchString:searchString});
            } else {
                this.setState({foundLists:[], searchString:searchString});
            }
        });
    }

    didClickOnListCard(list) {
        var path = "lists/"+list._id+"/consensus";
        this.props.router.push(path);
    }

    //navigate to create rankings page
    navigateToCreateRankingsPage() {
        this.props.router.push("lists/create");
    }

    render() {
        const foundLists = this.state.foundLists;
        const headerTitle = 'Search Results for "' + this.state.searchString + '" | '+foundLists.length+' results';
        var user_id = this.props.user && this.props.user._id ? this.props.user._id : null;
        return (
            <div>
                <SearchableNavbar
                    logout = {this.props.logout}
                    profile = {this.props.profile}
                    searchLists = {this.searchLists.bind(this)}
                />
                <div className = "EditRankingsPage">
                    <div className = "EditRankingRankingList" >
                        <h2>{headerTitle}</h2>
                        {this.state.foundLists && this.state.foundLists.length > 0 &&
                        <ViewableList id={1}
                                      didClickOnListCard = {this.didClickOnListCard.bind(this)}
                                      lists = {foundLists}
                                      showRankingNumber = {false}
                                      user_id = {user_id}/>
                        }
                    </div>
                </div>
                <BottomRightButton title = {"Create Ranking"} onClick = {this.navigateToCreateRankingsPage.bind(this)}/>
            </div>
        );
    }
}

export default withRouter(ListsSearchResultsPage);

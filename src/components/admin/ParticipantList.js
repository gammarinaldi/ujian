import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import { Redirect } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { sortingJSON } from '../../actions';
import { USERS_PARTICIPANT } from '../../supports/api-url/apisuburl';
import SideBar from './SideBar';
import queryString from 'query-string';

class ParticipantList extends Component {

    state = { 
        listParticipant: [],
        searchListParticipant: [],
        activePage: 1,
        itemPerPage: 10,
        eventName: '',
        totalParticipant: 0
     }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

    componentDidMount() {
        if(this.props.myRole === "ADMIN") {
            this.showParticipant();
        }
    }

    showParticipant = () => {
        var params = queryString.parse(this.props.location.search);
        console.log(params.id);
        this.setState({
            eventName: params.item
        });
        this.setState({
            totalParticipant: params.totalParticipant
        });
        axios.post(API_URL_1 + USERS_PARTICIPANT, {
            id: params.id
        })
        .then((res) => {
            console.log(res);
            this.setState({ 
                listParticipant: res.data,
                searchListParticipant: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    onKeyUpSearch = () => {
        var query = this.refs.query.value;
        var arrSearch;
        console.log(this.state.listParticipant);

        arrSearch = this.state.listParticipant.filter((e) => {
            return e.username.toLowerCase().includes(query.toLowerCase())
        })

        if(arrSearch.length === 0) {
            arrSearch = this.state.listParticipant.filter((e) => {
                return e.fullname.toLowerCase().includes(query.toLowerCase())
            })
        }

        if(arrSearch.length === 0) {
            arrSearch = this.state.listParticipant.filter((e) => {
                return e.email.toLowerCase().includes(query.toLowerCase())  
            })
        }

        if(arrSearch.length === 0) {
            arrSearch = this.state.listParticipant.filter((e) => {
                return e.phone.toLowerCase().includes(query.toLowerCase())  
            })
        }
        
        this.setState({ searchListParticipant: arrSearch })
    }
  
    renderListParticipant = () => {
        var indexOfLastTodo = this.state.activePage * this.state.itemPerPage;
        var indexOfFirstTodo = indexOfLastTodo - this.state.itemPerPage;
        var sortedListActivity = this.state.searchListParticipant.sort(this.props.sortingJSON('id', 'desc'));
        var renderedProjects = sortedListActivity.slice(indexOfFirstTodo, indexOfLastTodo);

        var listJSXActivity = renderedProjects.map((item) => {

            return (
                <tr>   
                    <td><center>{item.id}</center></td>
                    <td>{item.username}</td>
                    <td>{item.fullname}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                </tr>
            )

        })
        
        return listJSXActivity;
    }
        
    render() {
        
        if(this.props.username !== "") {
            
            return(
                <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>

                    <div className="row">

                        <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                        <SideBar active='Manage Events' />
                        </div>

                        <div className="col-10 card bg-light" style={{ padding: "20px" }}>
                            
                        <div className="row">
                            <div className="col-lg-12">
                            <h2>Participant List of <strong>{this.state.eventName}</strong></h2>
                            <hr/>
                            </div>
                        </div>
                        <div className="row">
                            
                        <div style={{ fontSize: "13px", marginLeft: "20px", marginTop: "10px" }} 
                            className="col-lg-8 card shadow p-3 mb-5 bg-white rounded">
                            <br/>
                            <div style={{ fontSize: "16px" }}>Total Participant: {this.state.totalParticipant} pax</div>
                            <br/><br/>
                            <form id="searchForm">
                            <input type="text" className="form-control form-control-lg" style={{ fontSize: "12px" }} 
                                    placeholder="Search"
                                    ref="query" onKeyUp={() => {this.onKeyUpSearch()}} />
                            </form>
                            <br/>
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th><center>UID</center></th>
                                            <th><center>Username</center></th>
                                            <th><center>Fullname</center></th>
                                            <th><center>Email</center></th>
                                            <th><center>Phone</center></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {this.renderListParticipant()}
                                    </tbody>
                                </table>
                                <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={this.state.itemPerPage}
                                    totalItemsCount={this.state.searchListParticipant.length}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChange.bind(this)}
                                />
                            </div>
                        </div>

                        </div>

                        </div>

                    </div>

                </div>
            )
        } else {
            return (
                <Redirect to="/login" />
            )
        }
    }

}

const mapStateToProps = (state) => {
    return { username: state.auth.username, myRole: state.auth.role }
}

export default connect(mapStateToProps, { sortingJSON })(ParticipantList);
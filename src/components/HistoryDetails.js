import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import { convertToRupiah } from '../actions';

class HistoryDetails extends Component {

    state = { listOrderDetails: [] }

    componentDidMount() {
        this.showOrderDetails();
    }

    id = () => {
        var params = queryString.parse(this.props.location.search);
        return params.id;
    }

    invoice = () => {
        var params = queryString.parse(this.props.location.search);
        return params.invoice;
    }

    showOrderDetails = () => {
        axios.get(API_URL_1 + '/orderdetails/' + this.id(), {
            params: {
                username: this.props.username
            }
        }).then((res) => {
            this.setState({
                listOrderDetails: res.data.itemDetails
            })
        }).catch((err) => {
            console.log(err)
        })
    }
  
    renderListOrderDetails = () => {
        var listJSXOrderDetails = this.state.listOrderDetails.map((item) => {

            return (
                <tr>   
                    <td><center>{item.id}</center></td>
                    <td><center>{item.category}</center></td>
                    <td><center>{item.item}</center></td>
                    <td><center><img src={item.img} alt={item.category} width={150} height={150} /></center></td>
                    <td><center>{item.qty}</center></td>
                    <td><center>{this.props.convertToRupiah(item.price)}</center></td>
                </tr>
            )
        })
        
        return listJSXOrderDetails;
    }
        
    render() {
        
        if(this.props.username !== "") {

            if(this.props.myRole === "ADMIN") {
                return(
                    <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>
                        <div className="row">
                            <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                                <div className="list-group">
                                    <a href="/" className="list-group-item">Dashboard</a>
                                    <a href="/admin/manageproducts" className="list-group-item">Manage Products</a>
                                    <a href="/admin/manageusers" className="list-group-item">Manage Users</a>
                                    <a href="/admin/managetrx" className="list-group-item active">Manage Transactions</a>
                                    <a href="/admin/managecategory" className="list-group-item">Manage Category</a>
                                    <a href="/admin/managelocation" className="list-group-item">Manage Location</a>
                                    <a href="/admin/viewactivitylog" className="list-group-item">View Activity Log</a>
                                </div>
                            </div>
                            <div className="col-lg-10 card bg-light" style={{ padding: "20px" }}>
                            <h4>Manage Transaction</h4>
                            <hr/>
                            
                            <div className="card bg-light" style={{ fontSize: "13px", paddingLeft: "20px" }}>
                                <div className="col-lg-10 text-center" style={{ paddingTop: "20px" }}>
                                    <h2 className="section-heading">Transaction Details</h2>
                                    <h3 className="section-subheading text-muted">{this.invoice()}</h3>
                                </div>
                                <br/>
                                <div class="table-responsive col-lg-10 shadow p-3 mb-5 bg-white rounded">
                                    <table className="table table-bordered table-hover">
                                        <thead className="thead-dark">
                                            <tr>
                                            <th scope="col"><center>Id</center></th>
                                                <th scope="col"><center>Category</center></th>
                                                <th scope="col"><center>Item</center></th>
                                                <th scope="col"><center>Image</center></th>
                                                <th scope="col"><center>Qty</center></th>
                                                <th scope="col"><center>Harga</center></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {this.renderListOrderDetails()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            </div>
                        </div>
                    </div>
                )
            } else {
                return(
                    <div className="card bg-light" style={{ fontSize: "13px", paddingLeft: "20px" }}>
                    <div className="col-lg-6 align-self-center">
                        <div className="col-lg-12 text-center" style={{ paddingTop: "20px" }}>
                            <h2 className="section-heading text-uppercase">Transaction Details</h2>
                            <h3 className="section-subheading text-muted">{this.invoice()}</h3>
                        </div>
                        <br/>
                        <div className="table-responsive col-lg-12 shadow p-3 mb-5 bg-white rounded">
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                    <th scope="col"><center>Id</center></th>
                                        <th scope="col"><center>Category</center></th>
                                        <th scope="col"><center>Item</center></th>
                                        <th scope="col"><center>Image</center></th>
                                        <th scope="col"><center>Qty</center></th>
                                        <th scope="col"><center>Harga</center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.renderListOrderDetails()}
                                </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                )
            }
            
            
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

export default connect(mapStateToProps, { convertToRupiah })(HistoryDetails);
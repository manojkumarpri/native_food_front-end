import React, { Component } from 'react'
import api from './api';
import './userinfo.css';
//import CryptoJS from 'crypto-js';
class userinfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: "",
            user: JSON.parse(sessionStorage.getItem('user')),
            file: '',
            imagePreviewUrl: 'https://cdn3.iconfinder.com/data/icons/black-easy/512/538303-user_512x512.png',
            userOrder:[],
        }
        this.log = this.logout.bind(this);
        //this.state.image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog";
        this.state.image = "https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png";
        console.log("initial user info",this.state.user);
        this.change=this.change.bind(this);
        if(this.state.user){
            this.state.imagePreviewUrl=this.state.user.user_image;
            //console.log(this.state.imagePreviewUrl);
        }
        // Decrypt
        // var ciphertext=localStorage.getItem('user');
        // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
        // var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        // this.state.user=decryptedData;
        //console.log(this.state.user);
    }
    componentDidMount(){
        //console.log(localStorage.getItem('uname'));
        
        if(this.state.user){
            api.get('/ordersBy/'.concat(this.state.user.user_id)).then(response=>{
                console.log("Response data: ",response.data);
                //this.state.userOrder=response.data;
                this.setState({userOrder:response.data});
                console.log("User Orders in state: ",this.state.userOrder);
            }).catch(error=>{
                console.log(error);
            })
        }
        if(this.state.userOrder.invoice_number){
            console.log(this.state.userOrder);
        }
    }
    //logout
    logout() {
        sessionStorage.clear('user');
        alert("You logout successfully");
        window.location.reload(true);
        this.props.history.push('/');
    }
    // change user info
    change(){
        console.log("user profile after change",this.state.user);
        api.put('/users/'.concat(this.state.user.user_id),this.state.user);
        sessionStorage.clear('user');
        sessionStorage.setItem('user',JSON.stringify(this.state.user));
        window.location.reload(true);
        alert("profile changed successfully");
    }
 
    // change image
    changeImage(e){
        let reader = new FileReader();
        let file = e.target.files[0];
    
        reader.onloadend = () => {
          this.setState({
            file: file,
            imagePreviewUrl: reader.result
            
          });
          
        }
        console.log(this.state.imagePreviewUrl);
        //this.setState({imagePreviewUrl:imagePreviewUrl});
        reader.readAsDataURL(file)
    }

    render() {
       if(this.state.user){
        return (
            <div style={{minHeight:"250px"}}>
               
                 <button className="btn btn-outline-warning btn-md " onClick={() => this.logout()} style={{ alignItems: "" }}>Logout</button>
                <br />
                 
                 {/*<div className="row">
                    <div className="col-sm-2">
                        <p>kjddswwwwgcgsdcugsdcsbcjkscsdugccbxcjscusgdcgcsdkjddswwwwgcgsdcugsdcsbcjkscsdugccbxcjscusgdcgcsd</p>
                    </div>
                 </div>   */}
                <div >
    <div className="row my-2">
        <div className="col-lg-8 order-lg-2">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a href="" data-target="#profile" data-toggle="tab" className="nav-link ">Profile</a>
                </li>
                <li className="nav-item">
                    <a href="" data-target="#orders" data-toggle="tab" className="nav-link">Orders</a>
                </li>
                <li className="nav-item">
                    <a href="" data-target="#edit" data-toggle="tab" className="nav-link ">Edit-Info</a>
                </li>
            </ul>
            <div className="tab-content py-4">
                <div className="tab-pane" id="profile">
                    <h5 className="mb-3">User Profile</h5>
                    <div className="row">
                        <div className="col-md-12">
                            <h6>Address</h6>
                            <p>
                            {this.state.user.address}
                            </p>
                            <h6>Mobile Number:</h6>
                            <p>
                            {this.state.user.mobile_number}
                            </p>
                            <h6>E-mail:</h6>
                            <p>
                            {this.state.user.email}
                            </p>
                        </div>
                
                       {/*  <div className="col-md-6">
                            <h6>Recent badges</h6>
                            <a href="#" className="badge badge-dark badge-pill">html5</a>
                            <a href="#" className="badge badge-dark badge-pill">react</a>
                            <a href="#" className="badge badge-dark badge-pill">codeply</a>
                            <a href="#" className="badge badge-dark badge-pill">angularjs</a>
                            <a href="#" className="badge badge-dark badge-pill">css3</a>
                            <a href="#" className="badge badge-dark badge-pill">jquery</a>
                            <a href="#" className="badge badge-dark badge-pill">bootstrap</a>
                            <a href="#" className="badge badge-dark badge-pill">responsive-design</a>
                            <hr/>
                            <span className="badge badge-primary"><i className="fa fa-user"></i> 900 Followers</span>
                            <span className="badge badge-success"><i className="fa fa-cog"></i> 43 Forks</span>
                            <span className="badge badge-danger"><i className="fa fa-eye"></i> 245 Views</span>
                        </div>
                        <div className="col-md-12">
                            <h5 className="mt-2"><span className="fa fa-clock-o ion-clock float-right"></span> Recent Activity</h5>
                            <table className="table table-sm table-hover table-striped">
                                <tbody>                                    
                                    <tr>
                                        <td>
                                            <strong>Abby</strong> joined ACME Project Team in <strong>`Collaboration`</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Gary</strong> deleted My Board1 in <strong>`Discussions`</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Kensington</strong> deleted MyBoard3 in <strong>`Discussions`</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>John</strong> deleted My Board1 in <strong>`Discussions`</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Skell</strong> deleted his post Look at Why this is.. in <strong>`Discussions`</strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> */}
                    </div>
                </div>
                {/* profile ends */}
                {/* orders starts */}
                <div className="tab-pane" id="orders">
                    <div className="alert alert-info alert-dismissable">
                     <strong>Your Order History</strong> 
                    </div>
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th>S No</th>
                                <th>Food Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total Price</th>
                                <th>Order Status</th>
                                <th>Payment Method</th>
                            </tr>
                        </thead>
                        <tbody>
                       {this.state.userOrder.map((uo,index) =>
                          
                            <tr key="uo.invoice_number">
                               
                                <td>
                                    {index+1}
                                </td>
                                <td>
                                    {uo.food_name}
                                </td>
                                <td>
                                    {uo.quantity}
                                </td>
                                <td>
                                    {uo.price}
                                </td>
                                <td>
                                    {uo.total_price}
                                </td>
                                <td>
                                    {uo.order_status}
                                </td>
                                <td>
                                    {uo.payment_option}
                                </td>
                            </tr>
                             )}
                        </tbody> 
                    </table>
                </div>
                {/* ordere ends */}
                {/* edit-info starts */}
                <div className="tab-pane" id="edit">
                    <form role="form">
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">User name</label>
                            <div className="col-lg-9">
                                <input type="text" className="form-control" value={this.state.user.username} onChange={event => this.setState({ user: Object.assign(this.state.user, { "username": event.target.value }) })} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">E-mail</label>
                            <div className="col-lg-9">
                                <input type="text" className="form-control" value={this.state.user.email} onChange={event => this.setState({ user: Object.assign(this.state.user, { "email": event.target.value }) })} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Mobile Number</label>
                            <div className="col-lg-9">
                            <input type="text" className="form-control" value={this.state.user.mobile_number} onChange={event => this.setState({ user: Object.assign(this.state.user, { "mobile_number": event.target.value }) })} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Address</label>
                            <div className="col-lg-9">
                                <input type="text" className="form-control" value={this.state.user.address} onChange={event => this.setState({ user: Object.assign(this.state.user, { "address": event.target.value }) })} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Security Question</label>
                            <div className="col-lg-9">
                                <input type="text" className="form-control" value={this.state.user.security_question} onChange={event => this.setState({ user: Object.assign(this.state.user, { "security_question": event.target.value }) })} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Security Answer</label>
                            <div className="col-lg-9">
                                <input type="text" className="form-control" value={this.state.user.security_answer} onChange={event => this.setState({ user: Object.assign(this.state.user, { "security_answer": event.target.value }) })} />
                            </div>
                        </div>
                      
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label"></label>
                            <div className="col-lg-9">
                                <a type="reset" className="btn btn-secondary" value="Cancel" title="No changes?" href="/userinfo">Cancel</a>
                                <button className="btn btn-primary" onClick={()=>this.change()} title="Update changes?">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        {/* change user image */}
        <div className="col-lg-3 order-lg-1 text-center">
        
            <img src={this.state.imagePreviewUrl} className="mx-auto img-fluid img-circle d-block" width="30%" height="30%" alt="avatar"/>
            <br/>
            <h1>Hello {this.state.user.username}</h1>
            {/* <h6 className="mt-2">Upload a different photo</h6> */}
            {/* <label className="custom-file">
                <input type="file" id="file" className="custom-file-input" onChange={(e)=>this.changeImage(e)}/>
                <span className="custom-file-control">Choose file</span>
            </label> */}
        </div>
    </div>
</div>
            </div>
        );
        } else{
            return(
                <div>
                    <h1>Oops.Login again to continue</h1>
                </div>
            )
        }   

    }
}
export default userinfo;

import React, { Component } from 'react'
import StarRatingComponent from 'react-star-rating-component';
import api from './api';
import paypal from "./images/paypal.png";
import PaypalExpressBtn from 'react-paypal-express-checkout';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';


class Checkout extends Component{

	constructor(props) {
		super(props);
		this.state = {
			paymentID:'',
			payment:'',
			rating: 1,
			isVisible: false,
			rating: 1,
            paymentID:'',
            payment: '',
            user: JSON.parse(sessionStorage.getItem('user')),
            newaddress: false,
            delivery_address: "",
            checkout:JSON.parse(localStorage.getItem('checkout')),
            order: {
                "provider_id": [], "food_id": [],
                "price": [], "quantity": [],
                "indexOf": [], "provider_address": [], "food_image": [], "food_name": [],"provider_mobile_number": [], "order_status": "dispatched", "user_id": 0, "user_mobile_number": "", "delivery_address": "", "total_price": 0, "payment_option": "", "invoice_number": "", "delivered_on": "30 Minutes","user_email":""
            },
            grand_total:0,
            ordered_on:Date,
            total:0,
            gst:0,
			sgst:0,
			cgst:0,
            modalShow:false,
            feedback:{ 
                    "available":0,
                    "food_id":0,
                    "rating":0
				},
			paymentShow:false,
        }
        
        // this.state.userdata = JSON.parse(localStorage.getItem("user"));
        // console.log(this.state.userdata);
        if (this.state.checkout){
            this.state.grand_total=this.state.checkout.total_price;
            this.state.gst=(this.state.checkout.total_price*5)/100;
            
			this.state.sgst=(this.state.checkout.total_price*(2.5))/100;
			this.state.cgst=(this.state.checkout.total_price*(1.5))/100;
            //console.log(gst);
            this.state.grand_total =this.state.checkout.total_price+25+this.state.gst+this.state.sgst+this.state.cgst;
            this.state.grand_total=(Number(this.state.grand_total).toFixed(1));
			console.log(this.state.grand_total);
			console.log(this.state.checkout);
        }
         this.newAddress = this.newAddress.bind(this);
        // this.payment = this.payment.bind(this);
        // this.confirmOrder = this.confirmOrder.bind(this);
         this.changeAddress = this.changeAddress.bind(this);
        if (this.state.user && this.state.checkout) {
            this.state.delivery_address = this.state.user.address;
            console.log(this.state.checkout);
        }
       console.log(this.state.startDate);
	}
	updateModal(isVisible) {
    	this.state.isVisible = isVisible;
      	this.forceUpdate();
    }
	//for toggle new address textarea
    newAddress() {
        this.setState({ newaddress: true });
    }
    // for add new address
    changeAddress() {
        var address = this.state.delivery_address;
        this.setState({ newaddress: false });
        alert("Your delivery address changed successfully!!!")
        console.log(address);
        console.log(this.state.date);
	}
	// show payment
	showPayment(){
		this.setState({paymentShow:true});
	}
	confirmOrder() {
		//this.fb();
        console.log(this.state.paymentID);
        console.log(this.state.payment);
        for (var i=0;i<this.state.checkout.food_id.length;i++){
            this.state.order.provider_id.push(this.state.checkout.provider_id[i]);
            this.state.order.food_id.push(this.state.checkout.food_id[i]);
            this.state.order.price.push(this.state.checkout.price[i]);
            this.state.order.quantity.push(this.state.checkout.quantity[i]);
            this.state.order.food_image.push(this.state.checkout.food_image[i]);
            this.state.order.food_name.push(this.state.checkout.food_name[i]);
            this.state.order.provider_mobile_number.push(this.state.checkout.provider_mobile_number[i]);
            this.state.order.provider_address.push(this.state.checkout.provider_address[i]);
            this.state.order.user_id=this.state.checkout.user_id;
            this.state.order.user_mobile_number=this.state.checkout.user_mobile_number;
            this.state.order.user_email=this.state.checkout.email;
            this.state.order.delivery_address=this.state.delivery_address;
            this.state.order.total_price=this.state.grand_total;
            this.state.order.payment_option=this.state.payment;
            this.state.order.indexOf.push(this.state.checkout.indexOf[i]);
            this.state.order.invoice_number=Date.now();
        }
        console.log(this.state.order);
        api.post('/order',this.state.order).then(response =>{
            console.log("Order updated successfully");
        }).catch(error =>{
            console.log(error);
        })
        alert("Your order placed successfully!!! Happy Day");
        axios.get('http://api.msg91.com/api/sendhttp.php?country=91&sender=MSGIND&route=4&mobiles='+this.state.order.user_mobile_number+'&authkey=243177AyunGcNGL5bc6ed47&message= Hai! '+this.state.user.username+'.Your order placed successfully.Please pay '+this.state.order.total_price+' and get your food. Your invoice number is '+this.state.order.invoice_number+' use it for future reference.',{headers: {'crossDomain':true}});
		
		//this.state.modalShow=true;
		//this.setState({modalShow:true});
		//console.log(this.state.modalShow);
		this.props.history.push('/');
    }
    onStarClick(nextValue, prevValue, name) {
		this.setState({rating: nextValue});
		this.state.rating=nextValue;
		//console.log(nextValue);
		//this.close();
      }
    close(){
        this.state.feedback.rating=this.state.rating;
         for(var i=0;i<this.state.checkout.food_id.length;i++) {
            
            this.state.feedback.available=(this.state.checkout.available[i])-(this.state.checkout.quantity[i]);
            this.state.feedback.food_id=this.state.checkout.food_id[i];
            //console.log("Food already available in provider store "+this.state.checkout.available[i]);
            //console.log("quantity checkout "+this.state.checkout.quantity[i]);
			//console.log("available after quantity update "+this.state.feedback.available);
			console.log(this.state.feedback);
            api.put('/foodUpdate/'+this.state.checkout.provider_id[i], this.state.feedback). then(response =>{
				console.log(response.data);
				console.log("hello");
            }).catch(err =>{
                console.log(err);
            })
        }
        console.log("star rating and available and food id: "+this.state.feedback.rating);
		this.confirmOrder();
		//this.setState({modalShow:false});
		//this.state.modalShow=false;
        //this.props.history.push('/');
	}
	
	onToken = (token) => {
		fetch('/save-stripe-token', {
		  method: 'POST',
		  body: JSON.stringify(token),
		}).then(response => {
		  response.json().then(data => {
			alert(`We are in business, ${data.email}`);
			this.fb();
		  });
		});
	  }
	//  star(){
	// 	 console.log("hello");
	// 	 this.state.modalShow=true;
	// 	this.setState({modalShow:true});
	// 	console.log(this.state.modalShow)
	//  }
	fb(cod){
		this.setState({payment:cod});
		//(this.modal).modal('show');
		
	}
    render(){
		if(this.state.checkout) {
		const {rating} = this.state;
		const onSuccess = (payment) => {
            // Congratulation, it came here means everything's fine!
            		console.log("The payment was succeeded!", payment);
            		// You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
					this.state.paymentID=payment.paymentID;
					this.fb("paypal");
				}
 
        const onCancel = (data) => {
            // User pressed "cancel" or close Paypal's popup!
			console.log('The payment was cancelled!', data);
			alert("Try again!!!");
            // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
        }
 
        const onError = (err) => {
            // The main Paypal's script cannot be loaded or somethings block the loading of that script!
            console.log("Error!", err);
            // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
            // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
        }
 
        let env = 'sandbox'; // you can set here to 'production' for production
        let currency = 'USD'; // or you can set this value from your props or state
        let total = 1; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
        // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/
 
        const client = {
            sandbox:    'AZOydPphjOEGhm-gS8iPiBdESForP9ExEeUsUXQkOg4Y_TM97VH9ZKUrpUbkt_ePXbmCEm1wVC1-2vHm',
            production: 'YOUR-PRODUCTION-APP-ID',
        }
        // In order to get production's app-ID, you will have to send your app to Paypal for approval first
        // For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):
        //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
        // For production app-ID:
        //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/
 
        // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
        return(
            <div>
             <div className="privacy">
		<div className="container">
			
			<h3 className="tittle-w3l">Checkout
				<span className="heading-style">
					<i></i>
					<i></i>
					<i></i>
				</span>
			</h3>
		
			<div className="checkout-right">
				<h4>Your shopping cart contains:
					{this.state.checkout?(
					<span>{this.state.checkout.food_id.length} 
					{this.state.checkout.food_id.length>1?(" items"):
						(" item")
					}
					</span>
					):(
						<h4>Nothing to show</h4>
					)}
				</h4>
				<div className="table-responsive">
					<table className="timetable_sub">
						<thead>
							<tr>
								<th>S. No.</th>
								
								<th>Product Name</th>
								{/* <th>Product</th> */}
								<th>Quantity</th>
								

								<th>Price</th>
								<th>Total</th>
								{/* <th>Remove</th> */}
							</tr>
						</thead>
						{this.state.checkout?(
						<tbody>
						{this.state.checkout.food_id.map((c,index) =>
							<tr className="rem1">
								<td className="invert">{index+1}</td>
								
								{/* <td className="invert-image">
									<a >
										<img width="40%" height="50%" src={this.state.checkout.food_image[index]} alt=" " className="img-responsive"/>
									</a>
								</td> */}
								<td className="invert">{this.state.checkout.food_name[index]}</td>
								<td className="invert">
									{/* <div className="quantity">
										<div className="quantity-select">
											<div className="entry value-minus">&nbsp;</div>
											<div className="entry value">
												<span>1</span>
											</div>
											<div className="entry value-plus active">&nbsp;</div>
										</div>
									</div> */}
									{this.state.checkout.quantity[index]}
								</td>
								
								<td className="invert">{this.state.checkout.price[index]}</td>
								<td className="invert">{this.state.checkout.price[index]* this.state.checkout.quantity[index]}</td>
								{/* <td className="invert">
									<div className="rem">
										<div className="close1"> </div>
									</div>
								</td> */}
							</tr>
						)}
						</tbody>
						):[]}
					</table>
				</div>
			</div>
<br/>
<br/>
								{/* total starts */}
			<div className="row">
				<div className="col-8">
				</div>
				<div className="col-sm-4" style={{border:"1px solid", textAlign:"justify"}}>

					 <div className="row">
						  <div className="col-6">
								<label>Total price</label>
						  </div>
						  <div className="col-6">
								<label>Rs.{this.state.checkout.total_price}</label>
						  </div>
					 </div>

					 <div className="row">
						  <div className="col-6">
								<label>GST</label>
						  </div>
						  <div className="col-6">
								<label>Rs.{this.state.gst}</label>
						  </div>
					 </div>

					<div className="row">
						  <div className="col-6">
								<label>SGST</label>
						  </div>
						  <div className="col-6">
								<label>Rs.{this.state.sgst}</label>
						  </div>
					 </div>

					<div className="row">
						  <div className="col-6">
								<label>CGST</label>
						  </div>
						  <div className="col-6">
								<label>Rs.{this.state.cgst}</label>
						  </div>
					</div>

					<div className="row">
						  <div className="col-6">
								<label>Packing fee</label>
						  </div>
						  <div className="col-6">
								<label>Rs.25</label>
						  </div>
					 </div>
<hr/>
					 <div className="row">
						  <div className="col-6">
								<label>Grand total</label>
						  </div>
						  <div className="col-6">
								<label>Rs.{this.state.grand_total}</label>
						  </div>
					 </div>
				</div>
			</div>
					{/* total ends */}

							{/* address starts */}
			<div className="checkout-left">
				<div className="row">
					<div className="col-sm-6">
						<h4>{this.state.delivery_address}</h4>
					</div>
					<div className="col-sm-6">
					<button className="btn btn-info" onClick={() => this.newAddress()}>New Address</button><br /><br />
						{this.state.newaddress ? (
							<div>
								<textarea style={{ backgroundColor: "#dadfe8" }} onChange={event => this.setState({ delivery_address: event.target.value })} /><br /><br />
								<button className="btn btn-success" onClick={() => this.changeAddress()}>Change</button>
							</div>
						) : []
						}
					</div>
				</div>		
			</div>
			{/* address ends */}
				<div className="clearfix"> </div>
			</div>
		</div>
		<div className="checkout-right-basket">
			<a onClick={()=> this.showPayment()} className="btn btn-primary">Make a Payment
				{/* <span className="fa fa-hand-o-right" aria-hidden="true"></span> */}
			</a>
		</div>
			{this.state.paymentShow === true?(
				<div style={{minHeight:"500px"}}>
				<ul className="nav nav-pills nav-fill">
					<li className="nav-item">
						<a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Cash on delivery (COD)</a>
					</li>
					<li className="nav-item disabled">
						<a className="nav-link" id="home-tab" data-toggle="" href="#profile" role="tab" aria-controls="home" aria-selected="true">Stripe Checkout</a>
					</li>
				
					<li className="nav-item">
						<a className="nav-link " id="home-tab" data-toggle="tab" href="#settings" role="tab" aria-controls="home" aria-selected="true">Paypal Account</a>
					</li>
				</ul>
	
			 {/* Tab panes  */}
				<div className="tab-content">
						{/* tab 1*/}
					<div className="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
						<div>
							<div className="vertical_post check_box_agile">
								<h5>COD</h5>
								<div className="checkbox" style={{padding:"50px"}}>
									<div className="check_box_one cashon_delivery">
										<label className="anim">
										{/* <a ref={modal=> this.modal = modal} data-toggle="modal" data-target="#feedback">
							<span className="fa fa-unlock-alt" aria-hidden="true"></span> fb </a> */}
										{/* <button onClick={()=>this.fb()}>fb</button> */}
											<button className="btn btn-info" onClick={()=> this.fb("cod")} data-toggle="modal" data-target="#feedback">COD</button>
											
											<span> We also accept Credit/Debit card on delivery. Please Check with the agent.</span>
										</label>
									</div>

								</div>
							</div>
						</div>
					</div>
						{/* tab 2  */}
					<div className="tab-pane disabled" id="profile" role="tabpanel" aria-labelledby="profile-tab">
					<div style={{padding:"50px"}}>
						<StripeCheckout
							token={this.onToken}
							stripeKey="pk_test_7Yx1hK8cWQh1flMaqeAiQTcv"
							name="SmartShopping"
							description="Shopping Product Application"
							image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRtpO609q3ZGjn8kwk1_IW1rfk1EDwkumw0eo-YV8Q5mqsNoD-xQ"
							panelLabel="Donate"
							amount={this.state.grand_total} // cents
							currency="INR"
							locale="auto"
							zipCode={true}
							billingAddress={true}
						><br />
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button className="btn btn-primary"><i className="fab fa-cc-stripe"></i>&nbsp;Pay With Card</button>
                        </StripeCheckout>
						</div>
					</div>

							{/* tab 3 */}

					<div className="tab-pane" id="settings" role="tabpanel" aria-labelledby="settings-tab">
							<div className="row" style={{padding:"50px"}}>
									<div className="col-md-6">
										<img className="pp-img" src={paypal} alt="Image Alternative text" title="Image Title"/>
										<p>Important: You will be redirected to PayPal's website to securely complete your payment.</p>
										<a className="btn btn-primary">Checkout via Paypal</a>
									</div>
									<div className="col-md-6 number-paymk">
										<PaypalExpressBtn client={client} currency={'USD'} total={this.state.grand_total} />
									</div>
								</div>
							</div>
				</div>
				</div>
			):[]}

			<div>

				<div className="modal fade" id="feedback" tabIndex="-1" role="dialog">
                                <div className="modal-dialog">
                                
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal" onClick={()=> this.close()}>&times;</button>
                                        </div>
                                        <div className="modal-body modal-body-sub_agile">
                                          
                                            <div className="modal_body_left modal_body_left1">
                                                <h3 className="agileinfo_sign">Rate Us </h3>
                                               
													<div>
															<h2>Please give the rating</h2>
																<StarRatingComponent 
																	name="rate1" 
																	starCount={5}
																	value={rating}
																	onStarClick={this.onStarClick.bind(this)}
																/>
													</div>
												 
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                    </div>
                            
                                </div>
                            </div>
					</div>
            </div>
		);
	  } else {
		  return(
			  <div>
				<h2>You must login and add product to continue</h2>
				<a href="/">
				<span>Click here to </span>
				Go Home!!!</a>
			  </div>
		  );
	  }
    }
}

export default Checkout;
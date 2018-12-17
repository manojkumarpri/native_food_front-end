import React, { Component } from 'react';
import './foodorder.css';
import api from './api';
import StarRatingComponent from 'react-star-rating-component';

class FoodOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFood: [],
            providerList: [],
            cartShow: [],
            addShow: false,
            quantitySeleceted: 0,
            count: 0,
            cart: {"provider_id":[],"food_id":[],
            "price":[],"quantity":[],
            "indexOf":[],"provider_address":[],"food_image":[],"food_name":[],"available":[],"provider_mobile_number":[],"order_status":"ordered"},
            indexOf: 0,
            modalShow: false,
            i: 0,
            cartButton: [],
            provider_id:0,
            food_id:0,
            price:0,
            provider_address:"",
            food_image:"",
            food_name:"",
            available:0,
            provider_mobile_number:0,
            total_price:0,
            food_quantity:0,
            selected_provider:[],
            //foodList:JSON.parse(localStorage.getItem('food_list')),
            foodList:[],
            foodList1:JSON.parse(localStorage.getItem('filterdFood')),
            provider:false,
            p_index:0,
            foodTable:[],
        }
        Object.assign(this.state.cart,JSON.parse(localStorage.getItem('cart')));
        this.addCart = this.addCart.bind(this);
        this.selectProvider = this.selectProvider.bind(this);   
        this.goCart=this.goCart.bind(this);
        if(this.state.foodList1) {
            console.log(this.state.foodList1);
        }
        
    }
    // get food details by id
    componentDidMount() {
           window.scrollTo(0,0)
        if(this.state.foodList1.length>0){
            this.state.foodList=this.state.foodList1;
            var id=this.state.foodList[0].food_id[this.state.foodList[0].indexOf];
            console.log(id);
            this.setState({food_id:id});
            api.get('/items/' + id)
                .then(response => {
                    this.setState({ selectedFood: response.data });
                    console.log("Selected food details are:", this.state.selectedFood);
                    this.setState({ food_image: this.state.selectedFood.food_image });
                    this.setState({ food_name: this.state.selectedFood.food_name });
                })
                .catch(error => {
                    console.log(error)
                }
                );
        } else {
            //this.setState({food_id:this.state.foodList.food_id});
            this.state.food_id=this.state.foodList1.food_id;
            console.log(this.state.food_id);
            api.get('/provider/'+this.state.foodList1.food_id).then(response =>{
                this.setState({ selectedFood: response.data });
                this.setState({ foodList: response.data });
                console.log("food list: ",this.state.foodList);
                //console.log("Selected food details are:", this.state.selectedFood);
                this.setState({ food_image: this.state.foodList1.food_image });
                this.setState({ food_name: this.state.foodList1.food_name });
            }).catch(error=>{
                console.log(error);
            })
        }

        // get food list
        api.get('/items').then(response =>{
            console.log(response.data);
            this.setState({ foodTable: response.data });
        }).catch(error=>{
            console.log(error);
        })
        // get provider list
        // api.get('/provider/' + this.state.food_id).then(response => {
        //     this.setState({ providerList: response.data });
        //     this.state.providerList.map((p, index) => {
               
        //     })
        //     //console.log("Provider list is: ", this.state.providerList);
        // })
    }
    // select provider
    selectProvider(provider_id, index) {
        //var provider_id = event.target.value;
        console.log("index: "+index + ' ' + "provider_id: "+ provider_id);
        this.setState({provider_id:provider_id});  
        this.moreByProvider();  
        // selected provider index
        this.state.p_index=index;
        this.state.provider=true;
        }
    // add to cart
    addCart(p, i,fid) {
        
        console.log(p);
        console.log("food id of  seleceted food: "+fid);
        console.log("index of selected food: "+p.food_id.indexOf(fid));
        //this.state.selected_provider=p;
        console.log("index of selected provider: "+i);
        this.state.food_id=fid;
        
        // for set selected food image in more by provider
        for(var i=0;i<this.state.foodTable.length;i++) {
            if(this.state.foodTable[i].food_id === fid) {
                this.state.food_image=this.state.foodTable[i].food_image;
                this.state.food_name=this.state.foodTable[i].food_name;
            }
        }
        
        //index of selected food from provider list
        this.setState({ indexOf: p.food_id.indexOf(fid) });
        // price of selected food from provider list
        this.setState({ price: p.price[p.food_id.indexOf(fid)] });
        // selected provider address
        this.setState({ provider_address: p.provider_address });
        // selected food available value from provider list
        this.setState({available:p.available[p.food_id.indexOf(fid)]});
        // selected provider mobile number
        this.setState({provider_mobile_number:p.provider_mobile_number});
        
        // var price=this.state.p[0].price
        // this.setState({price:price})
        
        // selected food index
        this.setState({ i: p.food_id.indexOf(fid) });
       
        this.moreByProvider();
 
    }

    // close modal for empty quantity
    close() {
        
        // set initial count to zero
        this.setState({ count: 0 });
        console.log('count' +this.state.count)
        // set food quantity to zero
        this.setState({food_quantity:0});
        console.log('food_quantity: '+this.state.food_quantity)
        this.setState({ quantitySeleceted: 0 });
        this.setState({ cartButton: false });

    }
    // + button
    add() {
       
        var indexOf = this.state.indexOf;
        // selected food index
        var i = this.state.i;
        
        if(parseInt((this.state.cart.food_id).includes(this.state.food_id)) ){
            i=this.state.cart.food_id.indexOf(this.state.food_id);
            console.log('hello1');
            if ((this.state.foodList[i].available[indexOf]) > (this.state.cart.quantity[i])) {
                console.log('hello2');
                this.state.count++;
                //this.setState({ quantitySeleceted: (this.state.cart.quantity[i]) });
                // console.log(this.state.quantitySeleceted);
                this.state.cart.quantity[i]=this.state.cart.quantity[i]+1;
                this.setState({food_quantity:this.state.cart.quantity[i]});
                console.log(this.state.cart.quantity[i]);
            } else {
                alert("The selected food is no more available");
            }
        } else {
                if ((this.state.foodList[this.state.p_index].available[i]) > this.state.count) {
                        this.state.count++;
                        this.setState({ quantitySeleceted: this.state.count });
                        this.setState({food_quantity:this.state.count});
                        console.log(this.state.quantitySeleceted);
                        
                    } else {
                        alert("The selected food is no more available");
                    }
            }
    }

    // - button
    sub() {
        var indexOf = this.state.indexOf;
        var i = this.state.i;
        console.log(this.state.cart.length)
       console.log(this.state.cart.food_id.length)
       console.log(parseInt((this.state.cart.food_id[i])) === (this.state.foodList[this.state.p_index].food_id[i]))
       if(this.state.cart.food_id.length>0){
        if(parseInt((this.state.cart.food_id[i])) === (this.state.foodList[this.state.p_index].food_id[i])) {
            console.log('hi1')
            if(this.state.cart.quantity[i]>0){
            console.log('hello3');
                //this.state.count--;
                this.state.cart.quantity[i]=this.state.cart.quantity[i]-1;
                //this.setState({ quantitySeleceted: (this.state.cart.quantity[i]) });
                // console.log(this.state.quantitySeleceted);
                this.setState({food_quantity:this.state.cart.quantity[i]});
                console.log(this.state.cart.quantity[i]);
            }
        } else {
                        if (this.state.count > 0) {
                if(this.state.foodList.length>1) {
                    this.state.count--;
                    var i=this.state.i;
                    console.log(i)
                    //console.log(this.state.foodList[0].food_id[0])
                    this.setState({ quantitySeleceted: this.state.count });
                    this.setState({ total_price: this.state.quantitySeleceted*this.state.foodList[this.state.p_index].price[i] });
                    this.setState({food_quantity:this.state.count});
                    console.log(this.state.quantitySeleceted);
                } else{
                    this.state.count--;
                    var i=this.state.i;
                    console.log(i)
                    //console.log(this.state.foodList[0].food_id[0])
                    this.setState({ quantitySeleceted: this.state.count });
                    this.setState({ total_price: this.state.quantitySeleceted*this.state.foodList[this.state.p_index].price[i] });
                    this.setState({food_quantity:this.state.count});
                    console.log(this.state.quantitySeleceted);
                }
            }
        }
       } else {
           console.log('hi2')
            if (this.state.count > 0) {
                if(this.state.foodList.length>1) {
                    this.state.count--;
                    var i=this.state.i;
                    console.log(i)
                    //console.log(this.state.foodList[0].food_id[0])
                    this.setState({ quantitySeleceted: this.state.count });
                    this.setState({ total_price: this.state.quantitySeleceted*this.state.foodList[this.state.p_index].price[i] });
                    this.setState({food_quantity:this.state.count});
                    console.log(this.state.quantitySeleceted);
                } else{
                    this.state.count--;
                    var i=this.state.i;
                    console.log(i)
                    //console.log(this.state.foodList[0].food_id[0])
                    this.setState({ quantitySeleceted: this.state.count });
                    this.setState({ total_price: this.state.quantitySeleceted*this.state.foodList[this.state.p_index].price[i] });
                    this.setState({food_quantity:this.state.count});
                    console.log(this.state.quantitySeleceted);
                }
            }
        }
    }
    // send to cart
    // save to local storage
    send(){
        var i=this.state.i;
        // console.log(parseInt(this.state.cart.food_id[i]));
        // console.log(typeof(this.state.food_id));
        // console.log(parseInt((this.state.cart.food_id[i])) === (parseInt(this.state.food_id)))
        if((parseInt(this.state.cart.food_id[i])) === (parseInt(this.state.food_id))){
            console.log(this.state.cart);
        } if(!((parseInt(this.state.cart.food_id[i])) === (parseInt(this.state.food_id)))){    
                this.state.cart.provider_id.push(this.state.provider_id);
                this.state.cart.provider_mobile_number.push(this.state.provider_mobile_number);
                this.state.cart.food_id.push(this.state.food_id);
                this.state.cart.price.push(this.state.price);
                this.state.cart.quantity.push(this.state.quantitySeleceted);
                this.state.cart.indexOf.push(this.state.indexOf);
                this.state.cart.provider_address.push(this.state.provider_address);
                this.state.cart.food_image.push(this.state.food_image);
                this.state.cart.food_name.push(this.state.food_name);
                this.state.cart.available.push(this.state.available);   
                console.log(this.state.cart);
        }
        localStorage.setItem('cart',JSON.stringify(this.state.cart));
        //this.props.history.push('/cart');
        //this.close();
    }
    goCart(){
        this.props.history.push('/cart');
    }
    // more by provider
    moreByProvider(){
        console.log(this.state.selected_provider.provider_id);
        // api.get('/providerlist/'.concat(this.state.provider_id)).then(response=>{
        //     console.log(response.data);
        // }).catch(error =>{
        //     console.log(error);
        // })
    }
    render() {
        var foods = this.state.foodList[this.state.p_index];
        console.log("render works");
        if (this.state.foodList) {
            return (
                <div>
                  <br />
                    
                    {/* selected food info */}
                    
                    <div id="food_info" >
                        <div style={{ textAlign: "left" }} className="w-100 p-3">
                            <div className="row">
                                <div className="col-sm-6 col-lg-3 col-md-4 col-xs-12">
                                    <img src={this.state.food_image} alt="no img" width="250px" height="230px" style={{ padding: "25px" }} />
                                </div>
                                <div className="col-sm-6 col-lg-3 col-md-4 col-xs-12">
                                    <th>Food name</th>
                                    <p>{this.state.food_name}</p><br /><br />
                                    
                                <br /><br />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Providers list */}

                    <table className="table">
                        <thead>
                          
                            <tr>
                                <th>Select Provider</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Available</th>
                               <th scope="col" style={{textAlign:"center"}}>Provider Address</th>
                               <th scope="col">Ratings</th>
                               <th scope="col">Add Cart</th>
                            </tr>
                            
                        </thead>
                        <tbody>
                            {this.state.foodList.map((p, index) =>
                                <tr key={p.provider_id}>
                                    <th><input type="radio" name="provider" className="form-check-input" value={p.provider_id} onChange={() => this.selectProvider(p.provider_id, index)} /></th>
                                    <th scope="row">{p.price[p.indexOf]}</th>
                                    <td>{p.quantity[p.indexOf]}</td>
                                    <td>{p.available[p.indexOf]}</td>
                                    <td style={{textAlign:"center"}}>{p.provider_address}&nbsp; ({(Number(p.distance).toFixed(1))})kms</td>
                                    <td>
                                        <StarRatingComponent name="rate2"  editing={false}
                                            renderStarIcon={() => <span>✿</span>}
                                            starCount={5}
                                            value={p.rating[p.indexOf]}
                                            />
                                    </td>    
                                        <button className="btn btn-outline-info bg-light" data-toggle="modal" data-target="#cart" onClick={() => this.addCart(p, index,p.food_id[p.indexOf])}>Add to cart</button>
                                    
                                </tr>
                            )}
                        </tbody>

                    </table>
                    <div style={{textAlign:"center"}}>
                        <button  className="btn btn-outline-success" onClick={() =>this.goCart()}>Go cart</button>
                    </div>
              
                    {/* modal */}

<div class="modal fade" id="cart" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" onClick={()=>this.close()}>&times;</button>
				</div>
				<div class="modal-body modal-body-sub_agile">
					<div class="main-mailposi">
						<span class="fa fa-envelope-o" aria-hidden="true"></span>
					</div>
					<div class="modal_body_left modal_body_left1">
						<h3 class="agileinfo_sign">Cart </h3>
					
				                          {/* add cart */}
                            
                                          <pre>
                                <div>
                                    <button className="btn btn-success" onClick={() => this.add()}>+</button>
                                
                                          {/* show add */}

                                        <div>
                                        
                                        {((this.state.cart.quantity[this.state.i]) && (this.state.cart.food_id[this.state.i] === this.state.food_id) && (this.state.cart.provider_id[this.state.i] === this.state.provider_id))?(
                                            <div>
                                                {this.state.cart.quantity[this.state.i]}
                                            </div>
                                        ):(
                                            <div>
                                                    {this.state.food_quantity}
                                            </div>
                                        )}
                                        
                                    </div>

                                    <button className="btn btn-danger" onClick={() => this.sub()}>-</button><br/>
                                </div>
                            </pre>
                            <div>
                                <button className="btn btn-info" onClick={()=> this.send()}>Send to Cart</button>
                            </div>
                      
                        </div>

						<div class="clearfix"></div>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>
			
		</div>
	
                    {/* more by provider */}
                    {this.state.provider === true?(
                    <div>
                        <h4 style={{alignItems:"center"}}>More By Provider</h4>
                        <div className="row">
                        {foods.food_id.map((f,index)=>
                        
                       

                            <div className="col-sm-6 col-lg-3 col-md-4 col-xs-12 rounded" >
                                   
                                        
                                        {this.state.foodTable.map(f1=>
                                         
                                            {if(f1.food_id === f)
                                                {
                                                    return(
                                                       
                                                    <img className=" img-responsive" src={f1.food_image} alt="X" width="100%" height="80%" /> )
                                                    
                                                
                                                }
                                            }
                                                                                   
                                        )}
                                 
                                    <label>Price:</label>
                                    <p>Rs.{foods.price[index]}</p>
                                    <label>Available:</label>
                                    <p>{foods.available[index]}</p>
                                    <button className="btn btn-outline-info bg-light" data-toggle="modal" data-target="#cart" onClick={() => this.addCart(foods, index,foods.food_id[index])}>Add to cart</button>
                            </div> 
                     
                        )}
                           </div>
                    </div>
                    ):[]}
                </div>
            )
        } if (!this.state.selectedFood) {
            return (
                <div>
                    <p>Oops!!! Network error</p>
                    <button onClick={() => this.render()}>Retry</button>
                </div>
            )
        }
    }
}
export default FoodOrder;
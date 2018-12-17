import React, {component} from 'react';
import './css/bootstrap.css'
import './css/style.css'
import './css/popuo-box.css'
//import $ from 'jquery';
import api from './api';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';


class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
			visible:false,
			foodList:[],
			searchresults:[],
			id: 0,
            search: "",
            address: '',
            Items: [],
            Provi: [],
            lat: 0,
            lng: 0,
            distance: 0,
            disArray: [],
            radius: 1,
            searchToggle: false,
			popup:[],
			foodName:'',//for modal
			findFood:'',
        }
    }
    componentDidMount(){
        api.get('/items').then(response => {
            // console.log(response.data);
            this.setState({ foodList: response.data });
            console.log("Foods are: ", this.state.foodList);
        })
            .catch(error => console.log(error));


        api.get('/provider').then(response => {
            console.log("object");
            console.log(response.data)
            this.setState({ Provi: response.data })
        }).catch(err => { console.log(err) });
	}
	// location search starts
	showPosition(position) {
        // console.log(position.coords.latitude,position.coords.longitude);
        this.setState({ lat: position.coords.latitude, lng: position.coords.longitude });
        console.log(this.state.lat, this.state.lng);

        //this.transform(this.state.Provi, this.state.radius);
        let a = this.transform(this.state.Provi, this.state.radius);
        console.log(this.state.Items);
        this.setState({ disArray: a });
        console.log(this.state.disArray);
        // console.log("length of set: ",this.state.Items.size);
        console.log(a)
	}
	
	getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => { this.showPosition(position) });
            
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
    handleChange = address => {
        this.setState({ address });
        // if(this.state.address.length<=0) {
        //     this.setState({searchToggle:false});
        // }
    };

    handleSelect = address => {
    
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                this.state.lat = latLng.lat;
                this.state.lng = latLng.lng;
                this.setState({}); console.log('Success', latLng);
                let a = this.transform(this.state.Provi, this.state.radius);
                console.log(this.state.Items);
                this.setState({ disArray: a });
                console.log(this.state.disArray);
                // console.log("length of set: ",this.state.Items.size);
                console.log(a)
            })

            .catch(error => console.error('Error', error));
    };

    transform(Provi, distance) {
        this.setState({ searchToggle: true });
        var Items = [];
        var dist = [];
        if (!Provi) return [];
        if (!distance) return Provi;
        //searchTex = searchTex.toLowerCase();
        if (Provi.filter((it) => {
            var a = this.isShow(distance, this.state.lat, this.state.lng, it.lat, it.lon);
            console.log(a);
            if (a[0] === true) {
                var b = Object.assign({}, it, { distance: a[1] });
                dist.push(b);
            }
            return a[0];
        })) {
            dist.map(a => console.log(a.distance));
            if (dist.sort((a, b) => {
                return (a.distance - b.distance)
            })) {
                console.log("sorted")
                if (dist.map((a) => {
                    console.log(a.distance);
                    Items.push.apply(Items, a.food_id);
                })) {
                    this.setState({
                        Items: new Set(Items)
                    });
                    //this.setState({ searchToggle: false });
                    
                }
                return dist;
            }
        }
    }

    isShow(distance, clat, clng, lat, lng) {
        console.log("map Filter");
        console.log(distance + ' ' + clat + ' ' + clng + ' ' + lat + ' ' + lng);


        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat - clat);  // deg2rad below
        var dLon = this.deg2rad(lng - clng);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(clat)) * Math.cos(this.deg2rad(lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        console.log(d);

        if (d < distance) {
            console.log(true);
            return [true, d];

        }
        else {
            console.log(false);
            return [false, d];
        }
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
// location search ends

// search box
search(e) {
	this.setState({ search: e.target.value });
}
// cart button
cart(product){
	if(JSON.parse(sessionStorage.getItem('user'))){
	console.log(product);
	//this.state.popup=product;
	this.setState({foodName:product.food_name});
	var b = [];
	console.log(product.food_id);
	for (var i = 0; i < this.state.disArray.length; i++) {
		if ((this.state.disArray[i].food_id.includes((product.food_id)))) {
			//console.log("provider: ",this.state.disArray[i]);
			var a = Object.assign({}, this.state.disArray[i], { indexOf: this.state.disArray[i].food_id.indexOf((product.food_id)) })
			console.log(a);
			b.push(a);
			this.setState({popup:b});
		}
	}
	if(b.length>0){
		localStorage.setItem('filterdFood', JSON.stringify(b));
		console.log(JSON.parse(localStorage.getItem('filterdFood')));
		product=null;
	} else {
		localStorage.setItem('filterdFood', JSON.stringify(product));
		console.log(JSON.parse(localStorage.getItem('filterdFood')));
		b=[];
	}
	
	this.props.history.push('/foodorder');
  } else{
	  alert("you must login to continue");
	  
  }
}
find(e) {
	console.log(this.refs.topic.value);
	var food_name = this.refs.topic.value;
	//console.log(this.state.foodList);
	for(var i=0;i<this.state.foodList.length;i++){
		if( (this.state.foodList[i].food_name.toLowerCase()).includes((e.toLowerCase())) ){
			console.log(this.state.foodList[i]);
			this.state.findFood=this.state.foodList[i];
			//this.setState({findFood:this.state.foodList[i]});
			console.log(this.state.findFood);
			this.setState({visible:true});
		} else {
			//console.log("No items match");
			console.log(this.state.findFood);
			
		}
		console.log(e.length)
		if(e.length<=0){
			
			this.setState({visible:false});
		}
	}
}

    render(){         
    
        return(
            <div>

	{/* start of top carousel */}
	<div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img className="d-block w-100" src={require('./images/slide1.jpg')} alt="First slide"/>
    </div>
    <div className="carousel-item">
      <img className="d-block w-100" src={require('./images/slide4.jpg')} alt="Second slide"/>
    </div>
    <div className="carousel-item">
      <img className="d-block w-100" src={require('./images/slide3.jpg')} alt="Third slide"/>
    </div>
  </div>
  <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="sr-only">Previous</span>
  </a>
  <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="sr-only">Next</span>
  </a>
</div>


{/* end of top carousel */}
	<br/>
		<div className="header-bot_inner_wthreeinfo_header_mid">
		
		<div>
                        <PlacesAutocomplete
                            value={this.state.address}
                            onChange={this.handleChange}
                            onSelect={this.handleSelect}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div className="form-group has-search">
                                    {/* <span className="fa fa-search form-control-feedback"></span> */}
                                    <input type="text" className="form-control"
                                        {...getInputProps({
                                            placeholder: 'Search Places ...',

                                        })} autoFocus={true}
                                    />
                                    <div className="autocomplete-dropdown-container">
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                                ? 'suggestion-item--active'
                                                : 'suggestion-item';
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>

                        <span>Use my location</span>
                        <button onClick={() => this.getLocation()}><i className="fas fa-map-marker-alt fa-2x"></i></button>

                    </div>		
				{/* <div className="agileits_search">
					<form action="#" method="post">
						<input name="Search" type="search" placeholder="How can we help you today?" required=""/>
						<button type="submit" className="btn btn-default" aria-label="Left Align">
							<span className="fa fa-search" aria-hidden="true"> </span>
						</button>
					</form>
				</div> */}
			{/* <div className="clearfix"></div> */}
		</div>
	
					
	<div className="ads-grid">
		<div className="container">

			<h3 className="tittle-w3l"> Food List
				<span className="heading-style">
					<i></i>
					<i></i>
					<i></i>
				</span>
			</h3>

			<div className="side-bar col-md-3">
				<div className="search-hotel">
					<h3 className="agileits-sear-head">Search Food..</h3>
					<div >
						<input type="search" placeholder="Food name..." name="search" required="" ref="topic"  onChange={e=> this.find(e.target.value)} autoComplete="off" />
						{/* <button className="btn btn-outline-success" onClick={()=> this.find()}>Find</button> */}
					</div>
				</div>
				
        
				<div className="left-side">
					<h3 className="agileits-sear-head">Food Preference</h3>
					<ul>
						<li>
							{/* <input type="checkbox" className="checked"/> */}
							<span className="span">Vegetarian</span>
						</li>
						<li>
							{/* <input type="checkbox" className="checked"/> */}
							<span className="span">Non-Vegetarian</span>
						</li>
					</ul>
				</div>
		
		
		
				<div className="customer-rev left-side">
					<h3 className="agileits-sear-head">Customer Review</h3>
					<ul>
						<li>
							<a href="#">
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<span>5.0</span>
							</a>
						</li>
						<li>
							<a href="#">
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star-o" aria-hidden="true"></i>
								<span>4.0</span>
							</a>
						</li>
						<li>
							<a href="#">
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star-half-o" aria-hidden="true"></i>
								<i className="fa fa-star-o" aria-hidden="true"></i>
								<span>3.5</span>
							</a>
						</li>
						<li>
							<a href="#">
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star-o" aria-hidden="true"></i>
								<i className="fa fa-star-o" aria-hidden="true"></i>
								<span>3.0</span>
							</a>
						</li>
						<li>
							<a href="#">
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star-half-o" aria-hidden="true"></i>
								<i className="fa fa-star-o" aria-hidden="true"></i>
								<i className="fa fa-star-o" aria-hidden="true"></i>
								<span>2.5</span>
							</a>
						</li>
					</ul>
				</div>
			
				<div className="left-side">
					<h3 className="agileits-sear-head">Categories</h3>
					<ul>
						<li>
							{/* <input type="checkbox" className="checked"/> */}
							<span className="span">South Indian</span>
						</li>
						<li>
							{/* <input type="checkbox" className="checked"/> */}
							<span className="span">North Indian</span>
						</li>
						<li>
							{/* <input type="checkbox" className="checked"/> */}
							<span className="span">Chineese </span>
						</li>
						
					</ul>
				</div>
		
				<div className="deal-leftmk left-side">
					<h3 className="agileits-sear-head">Special Deals</h3>
					<div className="special-sec1">
						<div className="col-xs-4 img-deals">
							<img src={require('./images/d01.jpg')} alt=""/>
						</div>
						<div className="col-xs-8 img-deal1">
							<h3>Dhosa</h3>
							<p>Rs.18</p>
						</div>
						<div className="clearfix"></div>
					</div>
					<div className="special-sec1">
						<div className="col-xs-4 img-deals">
							<img src={require('./images/d02.jpg')} alt=""/>
						</div>
						<div className="col-xs-8 img-deal1">
							<h3>Pongal</h3>
							<p>Rs.90</p>
						</div>
						<div className="clearfix"></div>
					</div>
					<div className="special-sec1">
						<div className="col-xs-4 img-deals">
							<img src={require('./images/d03.jpg')} alt=""/>
						</div>
						<div className="col-xs-8 img-deal1">
							<h3>Uppuma</h3>
							<p>Rs.15</p>
						</div>
						<div className="clearfix"></div>
					</div>
					<div className="special-sec1">
						<div className="col-xs-4 img-deals">
							<img src={require('./images/d04.png')}alt=""  />
						</div>
						<div className="col-xs-8 img-deal1">
							<h3>Poori</h3>
							<p>Rs.30</p>
						</div>
						<div className="clearfix"></div>
					</div>
					<div className="special-sec1">
						<div className="col-xs-4 img-deals">
							<img src={require('./images/d05.jpg')} alt="" />
						</div>
						<div className="col-xs-8 img-deal1">
							<h3>Noodles</h3>
							<p>Rs.40</p>
						</div>
						<div className="clearfix"></div>
					</div>
				</div>
	
			</div>

			<div className="col-md-9">
		{/* find food part starts */}
		{/* {console.log("this.state.findFood")}
		{this.state.visible === true?(
					<div className="product-sec1">
						<h3 className="heading-tittle">Search Results</h3>
						
						<div className="row">
								<div className="col-sm-4">
									<img src={this.state.findFood.food_image} width="55%" height="45%" alt=""/>
									<div className="item-info-product ">
										<h4>
											<a >{this.state.findFood.food_name}</a>
										</h4>
											<div className="info-product-price">
												<span className="item_price">{this.state.findFood.price}</span>
												
												<button type="button" class="btn btn-link"  onClick={()=>this.cart(this.state.findFood)}>
												Order
											</button>
										</div>
									</div>
								</div>
						</div>			
						<div className="clearfix"></div>
					</div>
		):[]} */}
	
				{/* find food part ends */}

	{this.state.Items.size >0 || this.state.visible === true ?(
			<div>
				
					{/* map filter starts */}
					<div>
						{this.state.Items.size >0?(
							<div>
								<h3 className="heading-tittle" style={{color:"green"}}>Results</h3>
								<div className="row">
												
								{this.state.foodList.filter(f => Array.from(this.state.Items).includes(f.food_id)).map(f =>
									<div className="col-sm-4">
										<img src={f.food_image} width="55%" height="45%" alt=""/>
										<div className="item-info-product ">
										<h4>
											<p>{f.food_name}</p>
										</h4>
										<div className="info-product-price">
											<span className="item_price">{f.price}</span>
											{/* <del>{f.price+40}</del> */}
											<button type="button" class="btn btn-link"  onClick={()=>this.cart(f)}>
												Order
											</button>
										</div>

										</div>
									</div>
								)}
								</div>
							</div>
					):(
						<div className="product-sec1">
						<h3 className="heading-tittle">Search Results</h3>
						
						<div className="row">
								<div className="col-sm-4">
									<img src={this.state.findFood.food_image} width="55%" height="45%" alt=""/>
									<div className="item-info-product ">
										<h4>
											<a >{this.state.findFood.food_name}</a>
										</h4>
											<div className="info-product-price">
												<span className="item_price">{this.state.findFood.price}</span>
												{/* <del>{f2.price+40}</del> */}
												<button type="button" class="btn btn-link"  onClick={()=>this.cart(this.state.findFood)}>
												Order
											</button>
										</div>
									</div>
								</div>
						</div>			
						<div className="clearfix"></div>
					</div>
					)}
					</div>
					
					 
			</div>
	):(
				<div className="wrapper">
					
					<div className="product-sec1">
						<h3 className="heading-tittle">Breakfast</h3>
						<div className="row">
							
							{this.state.foodList.filter(f1 =>(f1.breakfast === true)).map(f2 =>
								<div className="col-sm-4" key={f2.provider_id}>
									<img src={f2.food_image} width="55%" height="40%" alt=""/>
									<div className="item-info-product ">
									<h4>
										<a href="">{f2.food_name}</a>
									</h4>
									<div className="info-product-price">
										<span className="item_price">{f2.price}</span>
										{/* <del>{f2.price+40}</del> */}
										<button type="button" class="btn btn-link"  onClick={()=>this.cart(f2)}>
										Order
									</button>
									</div>
								
									</div>
								</div>
							)}
						
						</div>
						
						
						<div className="clearfix"></div>
					</div>
	
					<div className="product-sec1 product-sec2">
						<div className="col-xs-7 effect-bg">
							<h3 className="">Pure Energy</h3>
							<h6>Enjoy our all healthy Products</h6>
							<p>Get Extra 10% Off</p>
						</div>
						<h3 className="w3l-nut-middle">Foods & Dry Fruits</h3>
						<div className="col-xs-5 bg-right-nut">
							<img src="images/nut1.png" alt=""/>
						</div>
						<div className="clearfix"></div>
					</div>
			
					<div className="product-sec1">
						<h3 className="heading-tittle">Lunch</h3>
						<div className="row">
							
							{this.state.foodList.filter(f1 =>(f1.lunch === true)).map(f2 =>
								<div className="col-sm-4">
									<img src={f2.food_image} width="55%" height="45%" alt=""/>
									<div className="item-info-product ">
									<h4>
										<a href="">{f2.food_name}</a>
									</h4>
									<div className="info-product-price">
										<span className="item_price">{f2.price}</span>
										{/* <del>{f2.price+40}</del> */}
										<button type="button" class="btn btn-link"  onClick={()=>this.cart(f2)}>
										Order
									</button>
									</div>
									
									</div>
								
								</div>
							)}
						
						</div>
					
					
						
						<div className="clearfix"></div>
					</div>
		
					<div className="product-sec1">
						<h3 className="heading-tittle">Dinner</h3>
						<div className="row">
							
							{this.state.foodList.filter(f1 =>(f1.dinner === true)).map(f2 =>
								<div className="col-sm-4">
									<img src={f2.food_image} width="55%" height="45%" alt=""/>
									<div className="item-info-product ">
									<h4>
										<a href="">{f2.food_name}</a>
									</h4>
									<div className="info-product-price">
										<span className="item_price">{f2.price}</span>
										{/* <del>{f2.price+40}</del> */}
										<button type="button" class="btn btn-link"  onClick={()=>this.cart(f2)}>
										Order
									</button>
									</div>

									</div>
									
								</div>
							)}
						
						</div>
						
						<div className="clearfix"></div>
					</div>

				</div>
			)}

			</div>
	
		</div>
	</div>

								{/* modalbox */}
						
				<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered" role="document">
					<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalCenterTitle">{this.state.foodName}</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
						</button>
						
					</div>
					<div class="modal-body">
						{this.state.popup.map((p, index) =>

							<tr key={p.provider_id}>
							{/* <th> <input type="radio" class="form-check-input" id="materialInline1" name="inlineMaterialRadiosExample" onChange={() => this.selectProvider(p.provider_id, index)}/>
								<label class="form-check-label" htmlFor="materialInline1"></label></th> */}                                
								<th><input type="checkbox" name="provider" className="form-check-input" value={p.provider_id} /></th>
								
								<th scope="row">{p.price[p.indexOf]}</th>
								<td>{p.quantity[p.indexOf]}</td>
								<td>{p.available[p.indexOf]}</td>
								<td>{p.provider_address}&nbsp; ({(Number(p.distance).toFixed(1))})kms</td>
								{/* <td>
									<StarRatingComponent name="rate2"  editing={false}
										renderStarIcon={() => <span>✿</span>}
										starCount={5}
										value={p.rating[p.indexOf]}
										/>
								</td>    
									<button className="btn btn-outline-info bg-light" onClick={() => this.addCart(p, index)}>Add to cart</button> */}
								
							</tr>
						)}
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						<button type="button" class="btn btn-primary">Save changes</button>
					</div>
					</div>
				</div>
				</div>
	{/* <div className="featured-section" id="projects">
		<div className="container">

			<h3 className="tittle-w3l">Special Offers
				<span className="heading-style">
					<i></i>
					<i></i>
					<i></i>
				</span>
			</h3>
	
			<div className="content-bottom-in">
				<ul id="flexiselDemo1">
					<li>
						<div className="w3l-specilamk">
							<div className="speioffer-agile">
								<a href="single.html">
									<img src="images/s1.jpg" alt=""/>
								</a>
							</div>
							<div className="product-name-w3l">
								<h4>
									<a href="single.html">Aashirvaad, 5g</a>
								</h4>
								<div className="w3l-pricehkj">
									<h6>$220.00</h6>
									<p>Save $40.00</p>
								</div>
								<div className="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
									<form action="#" method="post">
										<fieldset>
											<input type="hidden" name="cmd" value="_cart" />
											<input type="hidden" name="add" value="1" />
											<input type="hidden" name="business" value=" " />
											<input type="hidden" name="item_name" value="Aashirvaad, 5g" />
											<input type="hidden" name="amount" value="220.00" />
											<input type="hidden" name="discount_amount" value="1.00" />
											<input type="hidden" name="currency_code" value="USD" />
											<input type="hidden" name="return" value=" " />
											<input type="hidden" name="cancel_return" value=" " />
											<input type="submit" name="submit" value="Add to cart" className="button" />
										</fieldset>
									</form>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div className="w3l-specilamk">
							<div className="speioffer-agile">
								<a href="single.html">
									<img src="images/s4.jpg" alt=""/>
								</a>
							</div>
							<div className="product-name-w3l">
								<h4>
									<a href="single.html">Kissan Tomato Ketchup, 950g</a>
								</h4>
								<div className="w3l-pricehkj">
									<h6>$99.00</h6>
									<p>Save $20.00</p>
								</div>
								<div className="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
									<form action="#" method="post">
										<fieldset>
											<input type="hidden" name="cmd" value="_cart" />
											<input type="hidden" name="add" value="1" />
											<input type="hidden" name="business" value=" " />
											<input type="hidden" name="item_name" value="Kissan Tomato Ketchup, 950g" />
											<input type="hidden" name="amount" value="99.00" />
											<input type="hidden" name="discount_amount" value="1.00" />
											<input type="hidden" name="currency_code" value="USD" />
											<input type="hidden" name="return" value=" " />
											<input type="hidden" name="cancel_return" value=" " />
											<input type="submit" name="submit" value="Add to cart" className="button" />
										</fieldset>
									</form>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div className="w3l-specilamk">
							<div className="speioffer-agile">
								<a href="single.html">
									<img src="images/s2.jpg" alt=""/>
								</a>
							</div>
							<div className="product-name-w3l">
								<h4>
									<a href="single.html">Madhur Pure Sugar, 1g</a>
								</h4>
								<div className="w3l-pricehkj">
									<h6>$69.00</h6>
									<p>Save $20.00</p>
								</div>
								<div className="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
									<form action="#" method="post">
										<fieldset>
											<input type="hidden" name="cmd" value="_cart" />
											<input type="hidden" name="add" value="1" />
											<input type="hidden" name="business" value=" " />
											<input type="hidden" name="item_name" value="Madhur Pure Sugar, 1g" />
											<input type="hidden" name="amount" value="69.00" />
											<input type="hidden" name="discount_amount" value="1.00" />
											<input type="hidden" name="currency_code" value="USD" />
											<input type="hidden" name="return" value=" " />
											<input type="hidden" name="cancel_return" value=" " />
											<input type="submit" name="submit" value="Add to cart" className="button" />
										</fieldset>
									</form>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div className="w3l-specilamk">
							<div className="speioffer-agile">
								<a href="single2.html">
									<img src="images/s3.jpg" alt=""/>
								</a>
							</div>
							<div className="product-name-w3l">
								<h4>
									<a href="single2.html">Surf Excel Liquid, 1.02L</a>
								</h4>
								<div className="w3l-pricehkj">
									<h6>$187.00</h6>
									<p>Save $30.00</p>
								</div>
								<div className="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
									<form action="#" method="post">
										<fieldset>
											<input type="hidden" name="cmd" value="_cart" />
											<input type="hidden" name="add" value="1" />
											<input type="hidden" name="business" value=" " />
											<input type="hidden" name="item_name" value="Surf Excel Liquid, 1.02L" />
											<input type="hidden" name="amount" value="187.00" />
											<input type="hidden" name="discount_amount" value="1.00" />
											<input type="hidden" name="currency_code" value="USD" />
											<input type="hidden" name="return" value=" " />
											<input type="hidden" name="cancel_return" value=" " />
											<input type="submit" name="submit" value="Add to cart" className="button" />
										</fieldset>
									</form>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div className="w3l-specilamk">
							<div className="speioffer-agile">
								<a href="single.html">
									<img src="images/s8.jpg" alt=""/>
								</a>
							</div>
							<div className="product-name-w3l">
								<h4>
									<a href="single.html">Cadbury Choclairs, 655.5g</a>
								</h4>
								<div className="w3l-pricehkj">
									<h6>$160.00</h6>
									<p>Save $60.00</p>
								</div>
								<div className="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
									<form action="#" method="post">
										<fieldset>
											<input type="hidden" name="cmd" value="_cart" />
											<input type="hidden" name="add" value="1" />
											<input type="hidden" name="business" value=" " />
											<input type="hidden" name="item_name" value="Cadbury Choclairs, 655.5g" />
											<input type="hidden" name="amount" value="160.00" />
											<input type="hidden" name="discount_amount" value="1.00" />
											<input type="hidden" name="currency_code" value="USD" />
											<input type="hidden" name="return" value=" " />
											<input type="hidden" name="cancel_return" value=" " />
											<input type="submit" name="submit" value="Add to cart" className="button" />
										</fieldset>
									</form>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div className="w3l-specilamk">
							<div className="speioffer-agile">
								<a href="single2.html">
									<img src="images/s6.jpg" alt=""/>
								</a>
							</div>
							<div className="product-name-w3l">
								<h4>
									<a href="single2.html">Fair & Lovely, 80 g</a>
								</h4>
								<div className="w3l-pricehkj">
									<h6>$121.60</h6>
									<p>Save $30.00</p>
								</div>
								<div className="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
									<form action="#" method="post">
										<fieldset>
											<input type="hidden" name="cmd" value="_cart" />
											<input type="hidden" name="add" value="1" />
											<input type="hidden" name="business" value=" " />
											<input type="hidden" name="item_name" value="Fair & Lovely, 80 g" />
											<input type="hidden" name="amount" value="121.60" />
											<input type="hidden" name="discount_amount" value="1.00" />
											<input type="hidden" name="currency_code" value="USD" />
											<input type="hidden" name="return" value=" " />
											<input type="hidden" name="cancel_return" value=" " />
											<input type="submit" name="submit" value="Add to cart" className="button" />
										</fieldset>
									</form>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div className="w3l-specilamk">
							<div className="speioffer-agile">
								<a href="single.html">
									<img src="images/s5.jpg" alt=""/>
								</a>
							</div>
							<div className="product-name-w3l">
								<h4>
									<a href="single.html">Sprite, 2.25L (Pack of 2)</a>
								</h4>
								<div className="w3l-pricehkj">
									<h6>$180.00</h6>
									<p>Save $30.00</p>
								</div>
								<div className="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
									<form action="#" method="post">
										<fieldset>
											<input type="hidden" name="cmd" value="_cart" />
											<input type="hidden" name="add" value="1" />
											<input type="hidden" name="business" value=" " />
											<input type="hidden" name="item_name" value="Sprite, 2.25L (Pack of 2)" />
											<input type="hidden" name="amount" value="180.00" />
											<input type="hidden" name="discount_amount" value="1.00" />
											<input type="hidden" name="currency_code" value="USD" />
											<input type="hidden" name="return" value=" " />
											<input type="hidden" name="cancel_return" value=" " />
											<input type="submit" name="submit" value="Add to cart" className="button" />
										</fieldset>
									</form>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div className="w3l-specilamk">
							<div className="speioffer-agile">
								<a href="single2.html">
									<img src="images/s9.jpg" alt=""/>
								</a>
							</div>
							<div className="product-name-w3l">
								<h4>
									<a href="single2.html">Lakme Eyeconic Kajal, 0.35 g</a>
								</h4>
								<div className="w3l-pricehkj">
									<h6>$153.00</h6>
									<p>Save $40.00</p>
								</div>
								<div className="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
									<form action="#" method="post">
										<fieldset>
											<input type="hidden" name="cmd" value="_cart" />
											<input type="hidden" name="add" value="1" />
											<input type="hidden" name="business" value=" " />
											<input type="hidden" name="item_name" value="Lakme Eyeconic Kajal, 0.35 g" />
											<input type="hidden" name="amount" value="153.00" />
											<input type="hidden" name="discount_amount" value="1.00" />
											<input type="hidden" name="currency_code" value="USD" />
											<input type="hidden" name="return" value=" " />
											<input type="hidden" name="cancel_return" value=" " />
											<input type="submit" name="submit" value="Add to cart" className="button" />
										</fieldset>
									</form>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div> */}

	<div className="footer-top">
		<div className="container-fluid">
			<div className="col-xs-8 agile-leftmk">
				<h2>Get your foods delivered from local stores</h2>
				<p>Discount on your first order!</p>
				<form action="#" method="post">
					<input type="email" placeholder="E-mail" name="email" required=""/>
					<input type="submit" value="Subscribe"/>
				</form>
				<div className="newsform-w3l">
					<span className="fa fa-envelope-o" aria-hidden="true"></span>
				</div>
			</div>
			<div className="col-xs-4 w3l-rightmk">
				<img src={require('./images/tab3.png')} alt=" "/>
			</div>
			<div className="clearfix"></div>
		</div>
	</div>

	
	
            </div>
        );
    }
}
export default Home;
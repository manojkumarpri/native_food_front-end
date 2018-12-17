import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './home';
import UserInfo from './userinfo';
import Cart from './cart';
import Checkout from './checkout';
import FoodOrder from './foodorder';
//import NotFound from './notfound';


const Routes = () => (
    <BrowserRouter >
        <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/userpro' component={UserInfo}></Route>
            <Route exact path='/cart' component={Cart}></Route>
            <Route exact path='/checkout' component={Checkout}></Route>   
            <Route exact path='/foodorder' component={FoodOrder}></Route>
            {/* <Route exact path='/food/*' component={NotFound}></Route> */}
        </Switch>
    </BrowserRouter>
)
export default Routes;
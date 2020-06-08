/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from 'jwt-decode';
import { setCurrentUser } from './actions/authActions';

import store from './store';
import setAuthToken from './utils/setAuthToken';

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

import "assets/css/custom.css";

import Landing from "components/Pages/Landing.js";
import Login from "components/Pages/Login.js";
import Register from "components/Pages/Register.js";

// Check for token
if (localStorage.getItem('jwtToken')) {
    // Set auth token header auth
    setAuthToken(localStorage.getItem('jwtToken'));
    // Decode token and get user infro and expiration
    const decoded = jwt_decode(localStorage.getItem('jwtToken'));
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
}

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path="/" exact render={props => <Landing {...props} />}/>
                <Route path="/login" exact render={props => <Login {...props} />}/>
                <Route path="/register" exact render={props => <Register {...props} />}/>
                <Redirect to="/"/>
            </Switch>
        </Router>
    </Provider>,
    document.getElementById("root")
);

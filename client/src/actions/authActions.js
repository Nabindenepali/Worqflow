import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post('/api/auth/register', userData)
        .then(history.push('/login'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Login User - Get User Token
export const loginUser = userData => dispatch => {
    axios
        .post('/api/auth/login', userData)
        .then(res => {
            // Save to local storage
            const { token } = res.data;
            // Set token to local storage
            localStorage.setItem('jwtToken', token);
            // Set token to Auth Header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
};

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem('jwtToken');
    // Remove auth header from future requests
    setAuthToken(false);
    // Set current user to {} which will set Authenticated to false
    dispatch(setCurrentUser({}));
};

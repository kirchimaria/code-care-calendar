import {post, postProtected} from '../api';
import {push} from 'react-router-redux';
import {ADD_EVENTS , ADD_EVENT , REMOVE_EVENT, ADD_JSON, SET_ALERT, CLEAR_ALERT} from '../constants/actions';

export const signUp = (email , password) => (dispatch) => {
    post('//localhost:8000/api/user/signup', {
        email,
        password,
    })
    .then(data => {
        localStorage.setItem('token' , data.token)
        localStorage.setItem('userId', data._id);
        dispatch(push('/calendar'));
    })
    .catch(error => {
        dispatch({type: SET_ALERT , payload : error})
        console.log('error', error)
    })
}

export const login = (email , password) => (dispatch) => {

    post('//localhost:8000/api/user/login' , {
        email,
        password,
    })
    .then(data => {
        console.log('login ' , data);
        localStorage.setItem('token' , data.token)
        localStorage.setItem('userId', data._id);
        dispatch(push('/calendar'));
    })
    .catch(error => {
        dispatch({type: SET_ALERT , payload : error})
        console.log('error' , error);
    })
}

export const getEvents = () => (dispatch) => {
    postProtected('//localhost:8000/api/event/getEvents' , {
        userId : localStorage.getItem('userId'),
    })
    .then(data => {
        dispatch({type: ADD_EVENTS , payload: data})
    })
    .catch(error => {
        dispatch({type: SET_ALERT , payload : error})

        console.log('error' , error);
    })
}


export const createEvent = (eventObject) => dispatch => {
    postProtected('//localhost:8000/api/event/addEvent', eventObject)
        .then(result => {
            dispatch({type: ADD_EVENT , payload: result.data})
        })
        .catch(error => {
            dispatch({type: SET_ALERT , payload : error})

            console.log(error);
        })
}

export const removeEvent = (id) => dispatch => {
    postProtected('//localhost:8000/api/event/removeEvent' , {_id : id})
        .then(result => {
            dispatch({type: REMOVE_EVENT, payload: id});
        })
        .catch(error => {
            dispatch({type: SET_ALERT , payload : error})
            console.log(error);
        })
}

export const uploadJson = (jsonFile) => dispatch => {
    const data = new FormData();
    data.append('json' , jsonFile);
    data.append('userId', localStorage.getItem('userId'));

    return fetch('//localhost:8000/api/event/saveCalendarJSON' , {
        method: 'post',
        body: data,
    })
    .then(response => {
        if (response.ok)
            return response.json()
    })
    .then(data => {
        dispatch({type: ADD_JSON, payload: data.data});
    })
    .catch(error => {
        console.log(error.message);
        dispatch({type: SET_ALERT , payload : error})        
    })
}

export const clearAlert = () => dispatch => {
    dispatch({type: CLEAR_ALERT});
}

import {ADD_EVENTS ,ADD_EVENT , REMOVE_EVENT, ADD_JSON} from '../constants/actions';

const sortEvents = (a , b) => {
    return a.start > b.start ? 1 : -1
}

const eventReducer = (state=[], action) => {
    switch(action.type) {
        case ADD_EVENTS:
            state = [...state , ...action.payload.data];
            return state.sort(sortEvents);
        case ADD_EVENT:
            let newState = [...state , action.payload];
            return newState.sort(sortEvents);
        case REMOVE_EVENT:
            newState = state.filter((item) => item._id !== action.payload);
            return newState.sort(sortEvents);
        case ADD_JSON:
            state = [...state , ...action.payload];
            return state.sort(sortEvents);
        default:
            return state;
    }
}

export default eventReducer

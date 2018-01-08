import {SET_USER, LOGOUT} from '../constants/actions';

const userReducer = (state=null, action) => {
    switch(action.type) {
        case SET_USER:
            state = action.payload;
            return state;
        case LOGOUT:
            state = null;
            return state;
        default:
            return state;
    }
}

export default userReducer

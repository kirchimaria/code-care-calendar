import {connect} from 'react-redux';

import Calendar from '../components/Calendar';
import {getEvents, createEvent, removeEvent, uploadJson} from '../actions';

const mapStateToProps = (state) => ({
    events: state.eventReducer,
});

const dispatchStateToProps = (dispatch) => ({
    getEvents: () => dispatch(getEvents()),
    createEvent: (eventObject) => dispatch(createEvent(eventObject)),
    removeEvent: (id) => dispatch(removeEvent(id)),
    uploadJson: (jsonFile) => dispatch(uploadJson(jsonFile)),
});

export default connect(mapStateToProps , dispatchStateToProps)(Calendar);

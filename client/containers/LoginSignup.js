import {connect} from 'react-redux';

import LoginSignup from '../components/LoginSignup';
import {signUp , login} from '../actions';

const mapStateToProps = (state) => ({})
const dispatchStateToProps = (dispatch) => ({
    signUp: (email , password) => dispatch(signUp(email, password)),
    login: (email , password) => dispatch(login(email, password)),
});

export default connect(mapStateToProps , dispatchStateToProps)(LoginSignup);

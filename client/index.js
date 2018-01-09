import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider, connect} from 'react-redux';
import { createStore,  combineReducers, applyMiddleware, compose } from 'redux'
import createHistory from 'history/createBrowserHistory';
import {Route, Switch, Link , withRouter} from 'react-router-dom';
import {ConnectedRouter, routerReducer, routerMiddleware, push, goBack} from 'react-router-redux';
import thunk from 'redux-thunk';

import reducers from './reducers';
import {signUp} from './actions';

import Welcome from './components/welcome';
import FourOFour from './components/FourOFour';
import LoginSignup from './containers/LoginSignup';
import Calendar from './containers/Calendar';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';


const history = createHistory();
const routerMiddle = routerMiddleware(history)

const theme = createMuiTheme({});

let AppReducers = combineReducers({
    ...reducers,
    router: routerReducer,
});

let store = createStore(AppReducers, compose(applyMiddleware(thunk ,routerMiddleware(history))));

class Layout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<ConnectedRouter history={history}>
                <Switch>
                    <Route  exact path="/" component={Welcome} />
                    <Route exact path='/loginsignup'component={LoginSignup} />
                    <Route exact path='/calendar' component={Calendar} />
                    <Route component={FourOFour} />
                </Switch>
        </ConnectedRouter>)
    }
}

const LayoutRedux = connect((state) => ({}) ,(dispatch) => ({}))(Layout)

ReactDOM.render(
        <Provider store={store}>
            <LayoutRedux />
        </Provider>,
document.getElementById('app'));

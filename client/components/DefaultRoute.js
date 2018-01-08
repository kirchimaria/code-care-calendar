import React from 'react';
import {Route} from 'react-router-dom';
import {withStyles, createStyleSheet} from 'material-ui/styles';


const DefaultRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={rest => (
        <div className='rootDefault'>
            <Component {...rest} />
        </div>)}/>
)

export default (DefaultRoute)

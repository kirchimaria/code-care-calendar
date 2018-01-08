import React,{Component} from 'react';
import {Link} from 'react-router-dom'
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';


const styles = theme => ({
    root: {
        flex: 1,
    },
})

class Welcome extends Component {
    render() {
        const {classes} = this.props;
        return (<div className={classes.root}>
                <h2 className={classes.h2}>
                <Link to={'/loginsignup'}>Welcome page go signup </Link>
                </h2>
            </div>)
    }
}

export default withRoot(withStyles(styles)(Welcome))

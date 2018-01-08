import React,{Component} from 'react';
import {Link} from 'react-router-dom'
import { withStyles } from 'material-ui/styles';
import withRoot from '../../withRoot';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';


const styles = theme => ({
    root: {
        display: 'flex',
        allignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        maxWidth: '50%',
    },
    centredBlock: {
        display: 'flex',
        minWidth: '300px',
        minHeight: '150px',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    rowCentred: {
        flexDirection: 'row',
        allignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    rowLeft: {
        flexDirection: 'row',
    },

    headerTitle: {
        color: '#4d86d1',
        fontSize: 22,
        fontWeight: 500,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
})

class LoginSignup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: true,
            signup: false,
        }
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
     };

    render() {
        const {classes} = this.props;
        return (<div className={classes.root}>

                    {this.state.login && <div className={classes.center}>

                        <div className={classes.centredBlock}>

                            <div className={classes.rowCentred}>
                                <span className={classes.headerTitle}>Login</span>
                            </div>

                            <div className={classes.rowLeft}>
                            <TextField
                                id="login-email"
                                placeholder="email"
                                className={classes.textField}
                                type="email"
                                value={this.state.loginEmail}
                                onChange={this.handleChange('loginEmail')}
                                margin="normal"
                              />
                            </div>

                            <div className={classes.rowLeft}>
                            <TextField
                                id="login-password"
                                placeholder="password"
                                className={classes.textField}
                                type="password"
                                value={this.state.loginPassword}
                                onChange={this.handleChange('loginPassword')}
                                margin="normal"
                              />
                            </div>

                            <div className={classes.rowLeft}>
                                <Button color="primary" onClick={() => {this.setState({login : false , signup: true})}}>Sign up</Button>
                                <Button color="accent" onClick={() => {this.props.login(this.state.loginEmail , this.state.loginPassword)}}>Send</Button>
                            </div>
                        </div>
                    </div>}




                    {this.state.signup && <div className={classes.login}>
                    <div className={classes.centredBlock}>
                        <div className={classes.rowCentred}>
                            <span className={classes.headerTitle}>Sign Up</span>
                        </div>

                        <div className={classes.rowLeft}>
                        <TextField
                            id="signup-email"
                            placeholder="email"
                            className={classes.textField}
                            type="email"
                            value={this.state.signupEmail}
                            onChange={this.handleChange('signupEmail')}
                            margin="normal"
                          />
                        </div>

                        <div className={classes.rowLeft}>
                        <TextField
                            id="login-password"
                            placeholder="password"
                            className={classes.textField}
                            type="password"
                            value={this.state.signupPassword}
                            onChange={this.handleChange('signupPassword')}
                            margin="normal"
                          />
                        </div>

                        <div className={classes.rowLeft}>
                            <Button color="primary" onClick={() => {this.setState({login : true , signup: false})}}>Login</Button>
                            <Button color="accent" onClick={() => {this.props.signUp(this.state.signupEmail , this.state.signupPassword)}}>Send</Button>
                        </div>

                        </div>
                    </div>}
            </div>)
    }
}

export default withRoot(withStyles(styles)(LoginSignup))

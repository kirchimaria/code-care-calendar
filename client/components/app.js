import React from 'react';
import {Provider} from 'react-redux';
import { createStore } from 'redux'
import { withStyles } from 'material-ui/styles';
import withRoot from '../theme';

let store = createStore(todoApp)

const styles = theme => ({
    root: {
        flex: 1,
    }
});

class App extends React.Component {

  render () {
    const { classes } = this.props;
    console.log(classes);

    return (<h1>hello</h1>)
  }
}

export default withRoot(withStyles(styles)(App));

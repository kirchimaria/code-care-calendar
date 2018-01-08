import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';


const theme = createMuiTheme({});

const withRoot = (Component) => {
  const WithRoot = (props) => {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
        <div style={{width: '100%' , height: '100%'}}>
            <Reboot />
            <Component {...props} />
        </div>
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;

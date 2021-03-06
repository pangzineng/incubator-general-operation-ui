import React from 'react';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import storeFactory from "./store";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import CssBaseline from '@material-ui/core/CssBaseline';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: purple[300],
      main: purple[500],
      dark: purple[700],
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700],
    },
  },
});

const store = storeFactory();

const withRoot = (Component) => {
  const WithRoot = (props) => {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <BrowserRouter>
            <Component {...props} />
          </BrowserRouter>
        </MuiThemeProvider>
      </Provider>
    );
  }
  return WithRoot;
}

export default withRoot;

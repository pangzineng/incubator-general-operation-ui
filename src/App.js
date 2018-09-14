import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import {HeaderContainer} from "./container/HeaderContainer"
import {ListingContainer} from "./container/ListingContainer"
import {SnackerContainer} from "./container/SnackerContainer"

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    paddingTop: '0px',
    padding: theme.spacing.unit * 2,
    minWidth: 0 // So the Typography noWrap works
  },
  contentFiller: theme.mixins.toolbar,
});

class App extends Component {

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <HeaderContainer />
        <SnackerContainer />
        <Switch>

          <Route exact path="/" render={() =>
            <div></div>
          }/>

          <Route exact path="/d/:definition" render={() =>
            <div className={classes.content} > 
              <div className={classes.contentFiller} />
              <ListingContainer />
            </div>
          }/>

        </Switch>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(App));

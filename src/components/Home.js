import React, { Component } from "react"
import { withStyles } from "@material-ui/core/styles"
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import PowerOnIcon from '@material-ui/icons/Power';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import ReactJson from "react-json-view";

var _ = require('lodash');

const styles = theme => ({
  hl: {
    color: green[500]
  },
  ll: {
    color: grey[500]
  }
});

class Home extends Component {

  render() {
    const {classes, profile} = this.props
    return (
      profile ? <Card>
        <CardHeader
          action={profile.active ? <PowerOnIcon className={classes.hl}/> : <PowerOffIcon className={classes.ll}/>}
          title={_.startCase(profile.name)}
          subheader={profile.description}
        />
        <CardContent>
          <Typography variant="subtitle1">
            Connection Status:
          </Typography>
          <Typography variant="body1">
            - Last Attend: {new Date().toLocaleString()}
          </Typography>
          <Typography variant="body1" paragraph>
            - Successful: {profile.active ? 'YES' : 'NO'}
          </Typography>
          <Typography variant="subtitle1">
            Connection Profile:
          </Typography>
          <ReactJson 
            src={profile}
            collapseStringsAfterLength={20}
            name={false}
            collapsed={true}
            enableClipboard={false}
            displayObjectSize={false}
            displayDataTypes={false}
          />
        </CardContent>
      </Card> : null
    )
  }
}

export default withStyles(styles)(Home)

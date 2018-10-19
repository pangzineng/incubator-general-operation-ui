import React, { Component } from "react"
import { withStyles } from "@material-ui/core/styles"
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from "@material-ui/core/IconButton"
import Tooltip from '@material-ui/core/Tooltip';
import PowerOnIcon from '@material-ui/icons/Power';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import ReactJson from "react-json-view";
import {loadSwagger} from "../common/SwaggerUtil";

var _ = require('lodash');

const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap'
  },
  basic: {
    margin: theme.spacing.unit,
    minWidth: '300px',
    maxWidth: '33%'
  },
  hl: {
    color: green[500]
  },
  ll: {
    color: grey[500]
  }
});

class Home extends Component {

  toggleActiveProfile = (profile) => {
    const {user, onSetUser, onSetSnacker, onSetDefinitions, onSetProperties} = this.props
    if (profile.name === user.activeProfile){
      onSetDefinitions(null)
      onSetProperties(null)
      onSetUser({activeProfile: null})
      onSetSnacker({openSnack: true, snackMsgType: "success", 
        snackMsg: `You have disconnected from ${profile.name}`
      })
    } else {
      loadSwagger(profile).then(({definitions, properties}) => {
        if (definitions && properties) {
          onSetDefinitions(definitions)
          onSetProperties(properties)
          onSetUser({activeProfile: profile.name})
          onSetSnacker({openSnack: true, snackMsgType: "success", 
            snackMsg: `You have activated ${profile.name}`
          })
        } else {
          onSetSnacker({openSnack: true, snackMsgType: "error", 
            snackMsg: `Failed to activate ${profile.name}`
          })
        }
      }).catch((e) => {
        onSetSnacker({openSnack: true, snackMsgType: "error", 
          snackMsg: `Failed to activate ${profile.name}`
        })
      })
    }
  }

  render() {
    const {classes, user} = this.props
    return (
      <div className={classes.root}>
          {_.isEmpty(user.profiles) ? 
          _.isEmpty(user) ? 'Login to access service' : 'You have no service permission, ask your admin' :
          user.profiles.map((profile, i) => <Card key={i} className={classes.basic}>
            <CardHeader
              avatar={
                <Tooltip title={`${profile.name === user.activeProfile ? "Disconnect" : "Activate"} this service`}>
                  <IconButton onClick={() => this.toggleActiveProfile(profile)}>
                    {profile.name === user.activeProfile ? 
                    <PowerOnIcon className={classes.hl}/> : 
                    <PowerOffIcon className={classes.ll}/>}
                  </IconButton>
                </Tooltip>
              }
              title={_.startCase(profile.name)}
              subheader={profile.description}
            />
            <CardContent>
              <Typography variant="subtitle1">
                Service Profile:
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
          </Card>)}
      </div>
    )
  }
}

export default withStyles(styles)(Home)

import React, { Component } from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import { withStyles } from "@material-ui/core/styles"
import MenuIcon from '@material-ui/icons/Menu';
import ArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from "@material-ui/core/IconButton"
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import {realContract} from '../common/MagicUtil';
import {loadSwagger} from "../common/SwaggerUtil";
import { Typography } from "@material-ui/core";
var _ = require('lodash');

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: 'fit-content'
  },
  bar: {
    padding: '0px'
  },
  logo: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center'
  },
  btn: {
    marginRight: theme.spacing.unit
  },
  form: {
    display: 'inline-flex'
  },
  drawerPaper: {
    position: 'relative',
    width: '15vw',
    minWidth: '100px'
  },
  item: {
    padding: theme.spacing.unit/2
  },
  selected: {
    color: green[500]
  },
  toolbar: theme.mixins.toolbar,
  adjust: {
    marginTop: '-14px' // adjustment due to the mismatch of theme.mixins.toolbar vs dense toolbar
  }
});

class Header extends Component {

  constructor (props) {
    super(props)
    const {history, onSelectDefinition} = this.props
    if(!history.location.pathname.startsWith("/d/")){
      onSelectDefinition(null)
    }
    this.state = {
      menuOpened: true,
      loginAction: false
    }
  }

  handleRootClick = (event) => {
    event.preventDefault()
    const {history, onSelectDefinition} = this.props
    onSelectDefinition(null)
    history.push("/")
  }

  handleDefinitionClick = (definition) => {
    const {history, onSelectDefinition} = this.props
    onSelectDefinition(definition)
    history.push(`/d/${definition}`)
  }

  toggleLogin = () => {
    const {loginAction} = this.state
    this.setState({loginAction: !loginAction})
  }

  toggleLogout = () => {
    const {history, onSetUser, onSetSnacker, onSetDefinitions, onSetProperties} = this.props
    onSetUser(null)
    onSetDefinitions(null)
    onSetProperties(null)
    onSetSnacker({openSnack: true, snackMsgType: "success", 
      snackMsg: `You are now logout`
    })
    this.setState({input: null})
    history.push("/")
  }

  toggleMenu = () => {
    const {menuOpened} = this.state
    this.setState({menuOpened: !menuOpened})
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  submitInput = () => {
    const {input} = this.state
    const {onSetUser, onSetSnacker, onSetDefinitions, onSetProperties} = this.props
    realContract(input).then(({color, profile}) => {
      loadSwagger(profile).then(({definitions, properties}) => {
        if (definitions && properties) {
          onSetDefinitions(definitions)
          onSetProperties(properties)
          onSetUser({'userID': input, color, profile: {...profile, active: true}})
          this.setState({loginAction: false, input: null}, () => {
            onSetSnacker({openSnack: true, snackMsgType: "success", 
              snackMsg: `You are now login`
            })
          })
        } else {
          onSetUser({'userID': input, color, profile: {...profile, active: false}})
        }
      })
    }).catch(() => {
      onSetSnacker({openSnack: true, snackMsgType: "error", 
        snackMsg: `Nah, your account is wrong`
      })
      this.setState({loginAction: false, input: null}, () => {
        onSetUser(null)
      })  
    })
  }

  render() {
    const { classes, definitions, selectedDefinition, user } = this.props;
    const {loginAction, menuOpened} = this.state
    return ([
      <AppBar key={1}
        position="absolute" className={classes.appBar} color="default"
        elevation={2} >
        <Toolbar variant="dense" className={classes.bar}>
          <Tooltip title="Toggle Menu">
            <IconButton onClick={() => this.toggleMenu()}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
            <div className={classes.logo} >
            <Typography variant="h6">
              {user.profile ? _.startCase(user.profile.name) : 'General Operation UI'}
            </Typography>
            </div>
          {
            user['userID'] ?
            <Tooltip title={`You're Now Login as ${user['color']}. Click To Logout`}>
              <Button variant="outlined" className={classes.btn} 
                style={{backgroundColor: user['color']}}
                onClick={() => this.toggleLogout()}>
                {''}
              </Button> 
            </Tooltip>:
            loginAction ? 
              [<TextField key={1} className={classes.btn}
                type="password"
                placeholder="Enter Magic Spell"
                onChange={this.handleChange('input')}
              />,
              <Button key={2} className={classes.btn}
                type="submit"
                variant="outlined"
                onClick={() => this.submitInput()}
              >
                Login
              </Button>]:
            <Tooltip title="Click To Login">
              <Button variant="outlined" className={classes.btn} onClick={() => this.toggleLogin()}>
                anonymous
              </Button>
            </Tooltip>
          }
        </Toolbar>
      </AppBar>,
      menuOpened &&
      <Drawer variant="persistent" open={menuOpened} classes={{ paper: classes.drawerPaper }} key={2}>
        <div className={classes.toolbar} />
        <List dense className={classes.adjust}>
          <ListItem button className={classes.item}>
            {selectedDefinition ? null :
              <ArrowIcon className={classes.selected} />}
            <ListItemText className={classes.item}
              primary={"Home"}
              onClick={this.handleRootClick} />
          </ListItem>
          <Divider/>
        {definitions.map((definition, index) => 
          [
          <ListItem button key={index} className={classes.item}>
            {definition['key'] === selectedDefinition ? 
              <ArrowIcon className={classes.selected} />
            : null}
            <ListItemText className={classes.item}
              primary={definition['key']}
              secondary={definition['description']}
              onClick={() => this.handleDefinitionClick(definition['key'])} />
          </ListItem>,
          <Divider key={index+1}/>
          ]
        )}
        </List>
      </Drawer>      
    ])
  }
}

export default withStyles(styles)(Header)

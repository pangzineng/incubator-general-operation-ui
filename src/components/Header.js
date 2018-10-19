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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {accountsAction} from '../common/Authentication';
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
  hightlightBtn: {
    marginRight: theme.spacing.unit,
    background: green[500]
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
      username: null,
      password: null,
      logoutDialogOpen: false,
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

  toggleLogoutDialog = () => {
    this.setState(prevState => ({logoutDialogOpen: !prevState.logoutDialogOpen}))
  }

  handleConfirmLogout = () => {
    const {history, onSetUser, onSetSnacker, onSetDefinitions, onSetProperties} = this.props
    onSetUser(null)
    onSetDefinitions(null)
    onSetProperties(null)
    onSetSnacker({openSnack: true, snackMsgType: "success", 
      snackMsg: `You are now logout`
    })
    this.toggleLogoutDialog()
    if(history.location.pathname !== '/') {
      history.push("/")
    }
  }

  toggleMenu = () => {
    this.setState(prevState => ({menuOpened: !prevState.menuOpened}))
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleRegister = () => {
    const {username, password} = this.state
    const {onSetSnacker} = this.props
    accountsAction('register', {username, password}).then(
      (v) => {
        onSetSnacker({openSnack: true, snackMsgType: "success", 
          snackMsg: `${v}. Please login now`
        })
        this.setState({username: null, password: null, loginAction: false})
      },
      (e) => {
        onSetSnacker({openSnack: true, snackMsgType: "error", 
          snackMsg: e
        })
      }
    )
  }

  handleLogin = () => {
    const {username, password} = this.state
    const {onSetUser, onSetSnacker} = this.props
    accountsAction('login', {username, password}).then(
      (v) => {
        onSetUser(JSON.parse(v))
        onSetSnacker({openSnack: true, snackMsgType: "success", 
          snackMsg: `You have login`
        })
        this.setState({username: null, password: null, loginAction: false})
      },
      (e) => {
        onSetSnacker({openSnack: true, snackMsgType: "error", 
          snackMsg: e
        })
      }
    )
  }

  render() {
    const { classes, definitions, selectedDefinition, user } = this.props;
    const {loginAction, username, menuOpened, logoutDialogOpen} = this.state
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
              {user.activeProfile ? _.startCase(user.activeProfile) : 'General Operation UI'}
            </Typography>
            </div>
          {
            user._id ?
            <Tooltip title={`You're Now Login. Click To Logout`}>
              <Button variant="outlined" className={classes.hightlightBtn} 
                onClick={this.toggleLogoutDialog}>
                {user.username}
              </Button> 
            </Tooltip>:
            loginAction ? 
              [<TextField key={1} className={classes.btn}
                placeholder="name"
                value={username || ''}
                onChange={this.handleChange('username')}
              />,
              <TextField key={2} className={classes.btn}
                type="password"
                placeholder="password"
                onChange={this.handleChange('password')}
              />,
              <Button key={3} className={classes.btn}
                type="submit"
                variant="outlined"
                onClick={() => this.handleLogin()}
              >
                Login
              </Button>,
              <Button key={4} className={classes.btn}
                type="submit"
                variant="outlined"
                onClick={() => this.handleRegister()}
              >
                Register
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
            {this.props.history.location.pathname === '/' ? 
              <ArrowIcon className={classes.selected} />: null}
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
      </Drawer>,
      <Dialog key={3}
        open={logoutDialogOpen}
        onClose={this.toggleLogoutDialog}
      >
        <DialogTitle>{"Are you sure to logout?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            By logout, you will also be disconncted from all services
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.toggleLogoutDialog} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={this.handleConfirmLogout} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    ])
  }
}

export default withStyles(styles)(Header)

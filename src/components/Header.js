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
import SvgIcon from '@material-ui/core/SvgIcon';
import {realContract} from '../common/MagicUtil';
import {loadSwagger} from "../common/SwaggerUtil";

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
    height: theme.mixins.toolbar.minHeight*0.9,
    display: 'flex',
    position: 'relative',
    alignItems: 'center'
  },
  logoImg: {
    width:'5vw',
    minWidth: '80px',
    height:'70%',
    marginLeft: theme.spacing.unit,
    cursor: 'pointer'
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
    const {history, onSetUser, onSetSnacker, onSetDefinitions, onSetProperties, onSetUIConfig} = this.props
    onSetUser(null)
    onSetDefinitions(null)
    onSetProperties(null)
    onSetUIConfig(null)
    onSetSnacker({openSnack: true, snackMsgType: "success", 
      snackMsg: `You are now logout`
    })
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
    const {onSetUser, onSetSnacker, onSetDefinitions, onSetProperties, onSetUIConfig} = this.props
    realContract(input).then(({color, profile}) => {
      loadSwagger(profile).then(({definitions, properties, uiConfig}) => {
        onSetDefinitions(definitions)
        onSetProperties(properties)
        onSetUIConfig(uiConfig)
        this.setState({loginAction: false}, () => {
          onSetSnacker({openSnack: true, snackMsgType: "success", 
            snackMsg: `You are now login`
          })
          onSetUser({'userID': input, 'color': color})
        })  
      })
    }).catch(() => {
      onSetSnacker({openSnack: true, snackMsgType: "error", 
        snackMsg: `Nah, your account is wrong`
      })
      this.setState({loginAction: false}, () => {
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
            <Tooltip title="Go Home!">
            <SvgIcon className={classes.logoImg} onClick={this.handleRootClick} viewBox="0 0 502 210.6">
              <g>
                <path fill="#cd201f" d="M498.3 45.7s-2.9-20.4-11.8-29.4c-11.3-11.9-24-12-29.9-12.6-41.7-3-104.2-3-104.2-3h-.2s-62.5 0-104.2 3c-5.8.7-18.5.7-29.9 12.6-8.9 9-11.8 29.4-11.8 29.4s-3 24-3 48v22.5c0 24 3 48 3 48s2.9 20.5 11.8 29.5c11.4 11.8 26.3 11.4 32.9 12.7 23.8 2.2 101.3 3 101.3 3s62.6-.2 104.3-3.2c5.9-.7 18.6-.7 29.9-12.5 9-9 11.8-29.5 11.8-29.5s3-24 3-48V93.7c0-24-3-48-3-48"/>
                <g>
                  <path d="M188 169.5h-19v-11c-7.2 8.3-13.3 12.5-20 12.5-5.8 0-9.8-2.8-11.9-7.8-1.2-3-2-7.7-2-14.6V68.7H154v81.9c.4 2.8 1.6 3.8 4 3.8 3.7 0 7-3.2 11-8.8V68.7h19v100.8zM102.1 139.6c1 10-2 15-8 15s-9-5-8-15v-40c-1-9.9 2.1-14.6 8-14.6 6 0 9 4.7 8 14.7v39.9zm19-38c0-10.7-2.2-18.8-6-23.9-5-6.9-13-9.7-21-9.7-9 0-15.9 2.8-21 9.7-3.8 5.1-5.9 13.3-5.9 24v35.9c0 10.7 1.8 18.1 5.7 23.2a26.7 26.7 0 0 0 42.6 0c3.8-5 5.6-12.5 5.6-23.2v-36zM46.2 114.6v55h-20v-55S5.7 47.4 1.4 34.8h21l14 52.6 14-52.6h20.9l-25 79.8z"/>
                </g>
                <g fill="#fff">
                  <path d="M440.4 96.6c0-9.3 2.6-11.8 8.6-11.8s8.4 2.7 8.4 12v10.9h-17v-11zm36 26v-20.4c0-10.6-2.1-18.4-6-23.5a25.3 25.3 0 0 0-21.2-10.4c-9.3 0-16.4 3.6-21.7 10.4-3.8 5-6 13.3-6 24v34.9a37 37 0 0 0 6.3 23 25.9 25.9 0 0 0 21.8 10.2 25 25 0 0 0 26.1-21.6c.2-1.8.6-6 .6-11.8v-2.8h-19v12.5c-1 4.9-3.7 7.3-8.1 7.3-6.2 0-8.9-4.6-8.8-13.8v-18h36zM390.5 140.6c0 10-2.3 13.8-7.5 13.8a14 14 0 0 1-9.5-4.6V89.3c3-3 6.5-4.5 9.5-4.5 5.2 0 7.5 3 7.5 12.9v42.9zm2.1-72.5c-6.6 0-13.2 4.1-19 11.3V35.8h-18v133.7h18v-10c6 7.5 12.6 11.3 19 11.3 7.2 0 12.5-3.8 14.9-11.2 1.2-4.3 2-10.8 2-20v-40a70 70 0 0 0-2.4-19.8c-2.5-7.5-7.3-11.7-14.5-11.7M340.6 169.5h-19v-11c-7.1 8.3-13.2 12.5-19.9 12.5-5.8 0-9.8-2.8-11.9-7.8-1.2-3-2-7.7-2-14.6V69.7h18.9v80.9c.4 2.8 1.6 3.8 4 3.8 3.7 0 7-3.2 11-8.8V69.7h19v99.8z"/>
                  <path d="M268.8 169.5h-20V54.8h-21v-19h63v19h-22v114.7z"/>
                </g>
              </g>
            </SvgIcon>
            </Tooltip>
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

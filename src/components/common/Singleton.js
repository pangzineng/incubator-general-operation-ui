import React, { Component } from "react"
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import MenuItem from '@material-ui/core/MenuItem';
import green from '@material-ui/core/colors/green';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import ReactJson from 'react-json-view';
import {getOne, postOne} from '../../common/APIUtil';
var _ = require('lodash'); 

const styles = theme => ({
    root: {
      zIndex: 1202 // must be 1201 < x < 1300, because the enum drop down modal use 1300, and the header use 1201 (with menu use 1200, drawer default),  the table/map use 1000/999
    },
    singleton: {
      ...theme.mixins.gutters(),
      marginTop: theme.spacing.unit * 2,
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit,  
    },
    editorRoot: {
      overflowY: 'initial',
      paddingBottom: theme.spacing.unit
    },
    editorGroup: {
      flexDirection: "row"
    },
    editorArray: {
      flexDirection: "column"
    },
    editor: {
      width: '100%'
    },
    group: {
      color: green[500]
    },
    groupSecondary: {
      fontStyle: 'italic',
      fontSize: 'small'
    }
});
  
class Singleton extends Component {

  constructor (props) {
    super(props)

    this.state = {
      objectId: props.singleton,
      body: this.getInitBody(props.properties),
      newFlag: props.singleton ? false : true,
      editorMode: 'form'
    };  
    this.fetchData()
  }

  getInitBody = (properties) => {
    var body = {}
    this.initBody(properties, body)
    return body
  }

  initBody = (properties, body) => {
    _.keys(properties).forEach(k => {
      switch(properties[k]['type']){
        case 'object':
          if (!_.has(body, k)) {
            body[k] = {}
          }
          this.initBody(properties[k]['properties'], body[k])
          break;
        default:
          body[k] = body[k] || properties[k]['default']
      }
    })
  }


  componentDidUpdate (prevProps) {
    const {singleton, properties} = this.props    
    if (singleton !== prevProps.singleton){
      this.setState({objectId: singleton, newFlag: singleton ? false : true, body: this.getInitBody(properties)}, () => {
        if (!this.state.newFlag) {
          this.fetchData()
        }
      })      
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const {definition, userID, onClose, onSetSnacker} = this.props
    const {newFlag, body} = this.state
    postOne(userID, definition, newFlag ? null : body['_id'], body).then(
        (v) => {
          onSetSnacker({openSnack: true, snackMsgType: "success", 
            snackMsg: newFlag?`New ${definition} is created`:`${definition} is successfully updated`
          })
          onClose(_,true)
        },
        (e) => {
          onSetSnacker({openSnack: true, snackMsgType: "error", 
            snackMsg: newFlag?`Failed to create ${definition}!`:`Failed to update ${definition}`
          })
        }
    )
  }

  fetchData = () => {
    const {definition, onSetSnacker} = this.props 
    const {newFlag, objectId} = this.state
    if (!newFlag) {
      getOne(definition, objectId).then(
        (v) => {
          this.setState({body: JSON.parse(v)})
        },
        (e) => {
          onSetSnacker({openSnack: true, snackMsgType: "error", 
            snackMsg: `Failed to get ${definition}!`
          })
        }
      )
    }
  }

  handleCommonStateChange = (name, value) => {
    this.setState({[name]: value})
  }

  handleChange = (path, index) => event => {
    var {body} = this.state
    body = body ? body : {}
    _.set(body, path, event.target.value)
    this.setState({body})
  }

  handleAddArrayItem = (k,body,vpath) => event => {
    var {body} = this.state
    body = body ? body : {}
    var bvalue = _.get(body, vpath, [])
    bvalue.push(null)
    _.set(body, vpath, bvalue)
    this.setState({body})
  }

  handleRemoveArrayItem = (k, vpath, j) => event => {
    var {body} = this.state
    body = body ? body : {}
    var bvalue = _.get(body, vpath, [])
    bvalue.splice(j, 1)
    _.set(body, vpath, bvalue)
    this.setState({body})
  }

  buildFormEditor = (properties, body, path, index) => 
    _.sortBy(_.keys(properties)).map( (k, i) => {
      const v = properties[k]
      const vpath = `${ path ? `${path}${index === undefined ? '' : `[${index}]`}.${k}` : k}`
      const {classes} = this.props
      switch (v['type']) {
        case 'object':
          return <Paper key={i} className={classes.singleton}>
            <ListItemText 
              classes={{ primary: classes.group, secondary: classes.groupSecondary }}
              primary={k}
              secondary={v['description']} />
              {this.buildFormEditor(v['properties'], body ? body[k] : "", vpath)}
            </Paper>
        case 'array':
          return <Paper key={i} className={classes.singleton}>
            <ListItemText 
              classes={{ primary: classes.group, secondary: classes.groupSecondary }}
              primary={k}
              secondary={v['description']} />
            <IconButton 
              onClick={this.handleAddArrayItem(k, body, vpath)}
            >
              <AddCircleIcon />
            </IconButton>
            <List>
              {body && body[k] &&
               body[k].map((bv, j) => <Paper key={j} className={classes.singleton}>
                {this.buildFormEditor(v['items']['properties'], bv ? bv : "", vpath, j)}
                <IconButton 
                  onClick={this.handleRemoveArrayItem(k, vpath, j)}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </Paper>)}
            </List>
            </Paper>
        case 'string':
        case 'number':
          return <TextField key={i}
            select={_.has(v, 'enum')}
            margin="normal"
            type={v['type'] === 'string' ? 'text' : v['type']}
            value={body && body[k] ? body[k] : v['default'] || ""}
            id={k}
            label={k}
            onChange={this.handleChange(vpath, index)}
            placeholder={v['description']}
            helperText={_.has(v, 'enum') && v['description']}
            fullWidth>
              {_.has(v, 'enum') && v['enum'].map(option => 
                <MenuItem key={option} value={option}> {option} </MenuItem>
              )}
            </TextField>
        default:
          return null
      }
    })
  
  buildTextEditor = body => 
    <TextField className={this.props.classes.editor}
      multiline
      rows="10"
      value={JSON.stringify(body, (k, v) => v === undefined ? null : v)}
      onChange={event => {
        try {
          const jBody = JSON.parse(event.target.value.replace(/\r?\n|\r|\t/g,' '))
          this.handleCommonStateChange('body', jBody)
        } catch(e) {
          this.props.onSetSnacker({openSnack: true, snackMsgType: "error", 
            snackMsg: `Please only use Text Editor to copy/paste full valid JSON`
          })
        }
      }}
    />

  buildJsonEditor = body =>
    <ReactJson 
      src={body}
      collapseStringsAfterLength={20}
      enableClipboard={false}
      displayObjectSize={false}
      displayDataTypes={false}
      onEdit={data => this.handleCommonStateChange('body', data.updated_src)}
    />

  buildEditor = () => {
    const {properties} = this.props
    const {editorMode, body} = this.state
    switch (editorMode) {
      case 'form':
        return this.buildFormEditor(properties, body)    
      case 'text':
        return this.buildTextEditor(body)
      case 'json':
        return this.buildJsonEditor(body)
      default:
        break;
    }
  }
  render() {
    const {definition, opened, onClose, classes} = this.props
    const {newFlag, editorMode} = this.state
    return (
      <Dialog fullWidth={true} maxWidth="md"
        open={opened} onClose={onClose}
        aria-labelledby="form-dialog-title"
        className={classes.root}
      >
        <DialogTitle id="form-dialog-title">{`${newFlag ? 'New' : 'Edit'} ${definition}`}</DialogTitle>
        <DialogContent className={classes.editorRoot}>
          <FormControl component="fieldset">
            <RadioGroup name="editorMode"
              className={classes.editorGroup}
              value={editorMode}
              onChange={event => this.handleCommonStateChange('editorMode', event.target.value)} >
              <FormControlLabel value="form" control={<Radio />} label="Form Editor" />
              <FormControlLabel value="json" control={<Radio />} label="JSON Editor" />
              <FormControlLabel value="text" control={<Radio />} label="Text Editor" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogContent>
          <Paper className={classes.singleton}>
          {opened ? this.buildEditor() : ""}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
  );
  }
}

export default withStyles(styles)(Singleton)

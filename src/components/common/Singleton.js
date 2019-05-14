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
import Typography from '@material-ui/core/Typography';
import ReactJson from 'react-json-view';
import Select from 'react-select';
import FileUpload from '../common/FileUpload';
import {getOne, postOne, getAll} from '../../common/APIUtil';
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
    },
    linkageValueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    linkageNoOptionsMessage: {
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    linkageSingleValue: {
      fontSize: 16,
    },
    linkagePlaceholder: {
      position: 'absolute',
      left: 2,
      fontSize: 16,
    },
    linkagePaper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing.unit,
      left: 0,
      right: 0,
    }  
});
  
class Singleton extends Component {

  constructor (props) {
    super(props)

    this.state = {
      objectId: props.singleton,
      linkageCache: {},
      linkageCacheDownloadFlag: {},
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
    const {profile, definition, userID, onClose, onSetSnacker} = this.props
    const {newFlag, body} = this.state
    postOne(profile.endpoint, userID, definition, newFlag ? null : body['_id'], body).then(
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
    const {profile, definition, onSetSnacker} = this.props 
    const {newFlag, objectId} = this.state
    if (!newFlag) {
      getOne(profile.endpoint, definition, objectId).then(
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

  // ex. Select from existing APIs $api_name$
  loadLinkageCache = (cacheKey) => {
    const {linkageCache, linkageCacheDownloadFlag} = this.state
    if (!linkageCacheDownloadFlag[cacheKey]){
      if (!linkageCache[cacheKey]){
        this.setState({linkageCacheDownloadFlag: Object.assign(linkageCacheDownloadFlag, {[cacheKey]: true})}, () => {
          const key = cacheKey.split('_')[0]
          const field = cacheKey.split('_')[1]
          const {profile} = this.props
          getAll(profile.endpoint, key, 0, 500, 'created_ts', -1, null, `{"${field}":1}`).then(
            (response) => {
              const cache = JSON.parse(response)['results'].map(data => ({value: data._id, label: data[field]}))
              this.setState(prevState => ({
                linkageCache: Object.assign(prevState.linkageCache, {[cacheKey]: cache}),
                linkageCacheDownloadFlag: Object.assign(linkageCacheDownloadFlag, {[cacheKey]: false})
              }))
            }
          )
        })
      }
    }
  }

  handleCommonStateChange = (name, value) => {
    this.setState({[name]: value})
  }

  handleValueChange = (path, value) => {
    var {body} = this.state
    body = body ? body : {}
    _.set(body, path, value)
    this.setState({body})
  }

  handleAddArrayItem = (vpath) => event => {
    var {body} = this.state
    body = body ? body : {}
    var bvalue = _.get(body, vpath, [])
    bvalue.push(null)
    _.set(body, vpath, bvalue)
    this.setState({body})
  }

  handleRemoveArrayItem = (vpath, j) => event => {
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
      const {classes, definition, profile, onSetSnacker, userID} = this.props
      const {linkageCache} = this.state
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
              onClick={this.handleAddArrayItem(vpath)}
            >
              <AddCircleIcon />
            </IconButton>
            <List>
              {body && body[k] &&
               body[k].map((bv, j) => <Paper key={j} className={classes.singleton}>
                {this.buildFormEditor(v['items']['properties'], bv ? bv : "", vpath, j)}
                <IconButton 
                  onClick={this.handleRemoveArrayItem(vpath, j)}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </Paper>)}
            </List>
            </Paper>
        case 'string':
          // special keyword: `src`, handled as file upload, not fill in value
          if (k === 'src' || k === 'url' || k === 'uri') {
            return <FileUpload key={i}
              label={k}
              presignedUrl={body && body[k] ? body[k] : v['default'] || ""}
              placeholder={v['description']}
              onChange={fvalue => this.handleValueChange(vpath, fvalue)}
              onSetSnacker={onSetSnacker}
              definition={definition}
              profile={profile}
              userID={userID}
            />
          }
          // special description postfix `$`, to handled as foreign key linkage (dropdown autocomplete on specified field, store as _id), not fill in value
          // e.g. Select from existing APIs $api_name$
          if (v['description'] && v['description'].trim().endsWith('$')){
            const cacheKey = v['description'].split('$')[v['description'].split('$').length-2]
            this.loadLinkageCache(cacheKey)
            return <Select key={i}
              classes={classes}
              options={linkageCache[cacheKey] || []}
              components={{
                Menu: (props) => <Paper square className={props.selectProps.classes.linkagePaper} {...props.innerProps}>
                    {props.children}
                  </Paper>,
                NoOptionsMessage: (props) => <Typography  color="textSecondary"  className={props.selectProps.classes.linkageNoOptionsMessage}  {...props.innerProps}>
                    {props.children}
                  </Typography>,
                Option: (props) => <MenuItem buttonRef={props.innerRef} selected={props.isFocused} component="div" style={{   fontWeight: props.isSelected ? 500 : 400, }} {...props.innerProps}>
                    {props.children}
                  </MenuItem>,
                Placeholder: (props) => <Typography color="textSecondary" className={props.selectProps.classes.linkagePlaceholder} {...props.innerProps}>
                    {props.children}
                  </Typography>,
                SingleValue: (props) => <Typography className={props.selectProps.classes.linkageSingleValue} {...props.innerProps}>
                    {props.children}
                  </Typography>,
                ValueContainer: (props) => <div className={props.selectProps.classes.linkageValueContainer}>{props.children}</div>,
              }}
              value={linkageCache[cacheKey] ? linkageCache[cacheKey].filter(suggestion => suggestion.value === (body && body[k] ? body[k] : v['default'] || ""))[0] : ""}
              onChange={svalue => this.handleValueChange(vpath, svalue ? svalue.value : null)}
              placeholder={v['description'].split('$')[0]}
              isClearable
              isSearchable
            />
          }
          // do not `break` here, to allow default 'string' case and all 'number' case to be handled the same way
        case 'number':
          return <TextField key={i}
            select={_.has(v, 'enum')}
            margin="normal"
            type={v['type'] === 'string' ? 'text' : v['type']}
            value={body && body[k] ? body[k] : v['default'] || ""}
            id={k}
            label={k}
            onChange={event => this.handleValueChange(vpath, event.target.value)}
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

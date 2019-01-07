import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles"
import Dropzone from 'react-dropzone'
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import Attachment from '@material-ui/icons/Attachment';
import AttachFile from '@material-ui/icons/AttachFile';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {getHTTP, putHTTP} from '../../common/APIUtil';

const styles = theme => ({
    root: {
        display: 'block'
    },
    collapse: {
      width: '100%',
      display: 'flex'
    },
    dropzone: {
      height: 'auto',
      borderStyle: 'dashed'
    },
    btn:{
        margin: theme.spacing.unit/2
    },
    highlightBtn: {
        marginRight: theme.spacing.unit/2
    }
});

class FileUpload extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      files: [],
      open: false 
    }
  }

  onDrop = (files) => {
    this.setState({ files });
  }

  handleReset = () => {
    const {onChange} = this.props
    onChange(null)
  }

  upload = (file) => {
    const {onSetSnacker, definition, userID, profile, onChange} = this.props
    return getHTTP(`${profile.storage.presign}/${userID}/${`${profile.name}/${definition}`.toLowerCase()}/${file.name}`, userID).then(
      (presignedUrls) => {
        const [putUrl, getUrl] = JSON.parse(presignedUrls)
        return putHTTP(putUrl, file).then(
          () => {
            onSetSnacker({openSnack: true, snackMsgType: "success", 
              snackMsg: `File ${file.name} was successfully uploaded`
            })
            onChange(getUrl)
            this.setState({files: []})
          },
          (request) => {
            onSetSnacker({openSnack: true, snackMsgType: "error", 
              snackMsg: `Failed to upload file: ${request.statusText}`
            })
          }
        )
      },
      (request) => {
        onSetSnacker({openSnack: true, snackMsgType: "error", 
          snackMsg: `Failed to connect to file storage: ${request.statusText}`
        })
      }
    )
  }

  handleUpload = () => {
    const {files} = this.state
    const {onSetSnacker} = this.props
    if (files.length > 0) {
      this.upload(files[0])
    } else {
      onSetSnacker({openSnack: true, snackMsgType: "warning", 
        snackMsg: "No file was selected for upload"
      })
    }
  }

  handleToggle = () => {
    this.setState(prevState => ({open: !prevState.open}))
  }

  handleTextChange = event => {
    const {onChange} = this.props
    onChange(event.target.value)
}

  render(){
    const {open, files} = this.state
    const {classes, presignedUrl, placeholder, label} = this.props
    return (
      <div className={classes.root}>
        <TextField 
          InputProps={{
            readOnly: open,
            endAdornment: (
              <InputAdornment variant="filled" position="end">
                <IconButton
                  onClick={this.handleToggle}
                >
                  {open ? <Attachment /> : <AttachFile />}
                </IconButton>
              </InputAdornment>
            )
          }}
          onChange={this.handleTextChange}
          fullWidth
          margin="normal"
          value={presignedUrl || ""}
          label={label}
          placeholder={placeholder}
          helperText="upload file to generate src"
          />
        <Collapse in={open} timeout="auto" unmountOnExit>
        <div className={classes.collapse}>
          <Dropzone
            className={classes.dropzone}
            multiple={false}
            onDrop={this.onDrop}
          >
            {files.length > 0 ? 
              files.map(f => <p key={f.name}>{f.name} - about {parseInt(f.size/1024/1024)} MB</p>) :
              <p>Drop file here, or click to select a file to upload.</p>}
          </Dropzone>
          <Button variant="outlined" size="small" className={classes.btn} onClick={this.handleReset}>
              <DeleteIcon />
              Reset
          </Button>
          <Button variant="outlined" className={classes.btn} onClick={this.handleUpload}>
              <CloudUploadIcon className={classes.highlightBtn} />
              Upload
          </Button>
        </div>
        </Collapse>
      </div>
    )      
  }
}

export default withStyles(styles)(FileUpload)

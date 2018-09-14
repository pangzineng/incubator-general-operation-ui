import React, { Component } from "react"
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles"
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import CloseIcon from "@material-ui/icons/Close";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import IconButton from "@material-ui/core/IconButton";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";

const variantIcon = {
  success: CheckCircleIcon,
  error: ErrorIcon,
  info: InfoIcon,
  warning: WarningIcon
};

const styleSheet = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  snackIcon: {
    fontSize: 20,
  },
  snackIconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  snackMsg: {
    display: "flex",
    alignItems: "center",
  },
  anchorFull: {
    left:0,
    right:0,
    transform:'none'
  },
  anchorCont: {
    maxWidth: '100%'
  }
})
  
class Snacker extends Component {

  handleSnackClose = () => {
    const {onSetSnacker} = this.props
    onSetSnacker({openSnack: false, snackMsg: "", snackMsgType: "info"})
  }

  render(){
    const {classes, snacker} = this.props
    const SnackIcon = variantIcon[snacker.snackMsgType || "info"]
    return (snacker &&
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        classes={{
          anchorOriginBottomCenter: classes.anchorFull
        }}
        open={snacker.openSnack || false}
        transitionDuration={{exit:0}}
        autoHideDuration={4000}
        onClose={this.handleSnackClose}
      >
        <SnackbarContent
          className={classNames(classes.anchorCont, classes[snacker.snackMsgType || "info"])}
          message={
            <span className={classes.snackMsg}>
              <SnackIcon className={classNames(classes.snackIcon, classes.snackIconVariant)} />
              {snacker.snackMsg || ""}
            </span>
          }
          action={[
            <IconButton
              key="close" aria-label="Close"
              color="inherit"
              onClick={this.handleSnackClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    )
  }
}

export default withStyles(styleSheet)(Snacker)

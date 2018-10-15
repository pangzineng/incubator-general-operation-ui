import React, { Component } from "react"
import { withStyles } from "@material-ui/core/styles"
import ReactJson from 'react-json-view';
var _ = require('lodash');

const styles = theme => ({
});

class Home extends Component {

  constructor(props){
    super(props)
    this.state = {
      config: props.uiConfig
    }
  }

  componentDidUpdate(prevProps){
    if (!_.isEqual(prevProps.uiConfig, this.props.uiConfig)) {
      this.setState({config: this.props.uiConfig})
    }
  }

  handleChange = (key, value) => {
    this.setState({key: value})
  }

  render() {
    const {config} = this.state
    return (
      <ReactJson 
        src={config}
        collapseStringsAfterLength={20}
        name={false}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
        onEdit={data => this.handleChange('config', data.updated_src)}
      />
    )
  }
}

export default withStyles(styles)(Home)

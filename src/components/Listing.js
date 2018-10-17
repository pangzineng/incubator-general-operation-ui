import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TableIcon from '@material-ui/icons/TableChart';
import {getAll, deleteMany} from "../common/APIUtil";
import Singleton from './common/Singleton';
import green from '@material-ui/core/colors/green';
import MapView from './mapview/MapView';
import TableView from './tableview/TableView';
import ChartView from './chartview/ChartView';
var _ = require('lodash'); 


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  mapRoot: {
    position: 'relative'
  },
  mapControl: {
    position: 'absolute',
    zIndex: 1000, //must be >= 1000 because the map is at 999
    top: 0,
    right: 0,
    background: '#fff'
  },
  mapBtn: {
    color: green[500]
  }
});

class Listing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      totalData: 0,
      openedSingleton: null,
      opened: false,
      mapViewOpenFlag: false,
      chartViewOpenFlag: false
    };
  }

  componentDidUpdate (prevProps) {
      const {selectedDefinition} = this.props;
      if (selectedDefinition !== prevProps.selectedDefinition) {
        this.setState({mapViewOpenFlag: false, chartViewOpenFlag: false})
      }
  }

  refreshData = (offset=0, limit=5, sort=null, order=1, queryStr=null) => {
    const {endpoint, selectedDefinition, selectedDefinitionProperty, selectedDefinitionQuery, onSetSnacker} = this.props
    const orderBy = _.has(selectedDefinitionProperty, sort) ? sort : _.keys(selectedDefinitionProperty)[0]
    getAll(endpoint, selectedDefinition, offset, limit, orderBy, order, 
      queryStr ? queryStr : selectedDefinitionQuery ? selectedDefinitionQuery.query : null).then(
      (response) => {
        const res = JSON.parse(response)
        this.setState({data: res['results'], totalData: res['total']})
      }
    ).catch((error) => {
      onSetSnacker({openSnack: true, snackMsgType: "error",
        snackMsg: error.status === 400 ? `Your query is not a valid mongoDB query` : `Can't connect to database for ${selectedDefinition}`
      })
    })
  }

  deleteData = (selected) => {
    const {endpoint, userID, selectedDefinition, onSetSnacker} = this.props;
    deleteMany(endpoint, userID, selectedDefinition, selected).then(
      () => {
        onSetSnacker({openSnack: true, snackMsgType: "success", 
          snackMsg: `Deleted ${selectedDefinition}: ${selected}`
        })
        this.refreshData()
      },
      () => {
        onSetSnacker({openSnack: true, snackMsgType: "error", 
          snackMsg: `Failed to delete ${selectedDefinition}: ${selected}`
        })
      }
    )
  }

  openSingleton = (content) => {
    this.setState({openedSingleton: content, opened: true})
  }

  closeSingleton = (event, refreshFlag) => {   
    this.setState({openedSingleton: null, opened:false}, () => {
      if(refreshFlag === true){
        this.refreshData()
      }
    })
  }

  toggleMapView = () => {
    const {mapViewOpenFlag} = this.state
    this.setState({mapViewOpenFlag: !mapViewOpenFlag})
  }

  toggleChartView = () => {
    const {chartViewOpenFlag} = this.state
    this.setState({chartViewOpenFlag: !chartViewOpenFlag})
  }

  openInNewTab = (selected) => {
    const {uiConfig} = this.props
    const {data} = this.state
    const datum = _.find(data, {'_id': selected})
    var template = uiConfig['oin']['path']['template'].slice()
    uiConfig['oin']['path']['fields'].forEach((field, i) => {
      template = template.replace(`\${${i}}`, _.get(datum, field))
    });
    window.open(template, '_blank')
  }

  render() {
    const { classes, endpoint, selectedDefinition, selectedDefinitionProperty, selectedDefinitionQuery, onSetDefinitionQuery, userID, uiConfig } = this.props;
    const { data, totalData, openedSingleton, opened, mapViewOpenFlag, chartViewOpenFlag } = this.state;
    return (uiConfig ? [
      <Singleton key={1}
        userID={userID}
        opened={opened}
        endpoint={endpoint}
        definition={selectedDefinition}
        properties={selectedDefinitionProperty} 
        singleton={openedSingleton} 
        onClose={this.closeSingleton} 
        onSetSnacker={this.props.onSetSnacker}
      />,
      uiConfig['map']['enable'] && mapViewOpenFlag ? <div key={2} className={classes.mapRoot}>
        <MapView 
          userID={userID}
          data={data} 
          uiConfig={uiConfig}
          openInNewTab={this.openInNewTab}
          openSingleton={this.openSingleton}
          deleteData={this.deleteData}
          onSetSnacker={this.props.onSetSnacker}
        />
        <Tooltip title="Back To Table" >
            <IconButton aria-label="Back To Table" className={classes.mapControl} 
              onClick={() => this.toggleMapView()}>
                <TableIcon className={classes.mapBtn}/>
            </IconButton>
        </Tooltip>
      </div> : null,
      uiConfig['chart']['enable'] && chartViewOpenFlag ? <div key={3} className={classes.mapRoot}>
        <ChartView 
          data={data}
          uiConfig={uiConfig}
        />
        <Tooltip title="Back To Table" >
            <IconButton aria-label="Back To Table" className={classes.mapControl} 
              onClick={() => this.toggleChartView()}>
                <TableIcon className={classes.mapBtn}/>
            </IconButton>
        </Tooltip>
      </div> : null,
      !mapViewOpenFlag && !chartViewOpenFlag && 
      <TableView key={4}
        userID={userID}
        data={data} 
        totalData={totalData}
        selectedDefinition={selectedDefinition}
        selectedDefinitionProperty={selectedDefinitionProperty}
        selectedDefinitionQuery={selectedDefinitionQuery}
        onSetDefinitionQuery={onSetDefinitionQuery}
        uiConfig={uiConfig}
        openInNewTab={this.openInNewTab}
        openSingleton={this.openSingleton}
        deleteData={this.deleteData}
        toggleMapView={this.toggleMapView}
        toggleChartView={this.toggleChartView}
        refreshData={this.refreshData}
      />
    ]: null);
  }
}

export default withStyles(styles)(Listing);
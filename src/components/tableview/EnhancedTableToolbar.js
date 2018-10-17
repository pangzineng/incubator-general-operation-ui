import React, { Component } from 'react'
import classNames from 'classnames';
import { withStyles } from "@material-ui/core/styles"
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import BarChartIcon from '@material-ui/icons/BarChart';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import ActionPackage from '../common/ActionPackage';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';
import {evalJsonStr, cleanJsonStr} from '../../common/Utility'
var _ = require('lodash'); 

const styles = theme => ({
    root: {
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      overflowX: 'auto'
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    spacer: {
      flex: '1 1 0',
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: '0 0 auto',
      margin: theme.spacing.unit
    },
    btn:{
      margin: theme.spacing.unit/2
    },
    highlightBtn: {
      marginRight: theme.spacing.unit/2,
      color: green[500]
    },
    warnBtn: {
      marginRight: theme.spacing.unit/2,
      color: red[500]
    },
    primaryAction: {
      display: 'inline-flex'
    },
    searchWord: {
      paddingTop: theme.spacing.unit * 3/2
    },
    lrPad: {
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit
    },
    editorGroup: {
      flexDirection: "row"
    }
});

class EnhancedTableToolbar extends Component {

    initState = {
      searchField: null,
      searchWord: null,
      anchorEl: null,
      searchBoxMode: 'simple',
      searchAdvanceText: null
    }

    constructor(props){
      super(props)
      this.state = _.clone(this.initState)
    }

    componentDidMount(){
      this.refreshQuery()
    }

    componentDidUpdate(prevProps){
      const {definition} = this.props
      if(!_.isEqual(definition, prevProps.definition)){
        this.setState({...this.initState}, () => {
          this.refreshQuery()
        })
      }
    }

    refreshQuery = () => {
      const {selectedDefinitionQuery} = this.props
      if(_.isEmpty(selectedDefinitionQuery)){
        this.setState({...this.initState})
      } else {
        switch (selectedDefinitionQuery.mode) {
          case 'simple':
            const j = JSON.parse(selectedDefinitionQuery.query)
            this.setState({searchBoxMode: 'simple',searchField: _.keys(j)[0], searchWord: _.values(j)[0], searchAdvanceText: null})
            break; 
          case 'advance':
            this.setState({searchBoxMode: 'advance', searchAdvanceText: selectedDefinitionQuery.query, searchField: null, searchWord: null})
            break;
          default:
            break;
        }
      }
    }

    handleChange = name => event => {
      this.setState({
        [name]: event.target.value
      })
    }

    handleClick = event => {
      this.setState({ anchorEl: event.currentTarget });
    };
  
    handleClose = () => {
      this.setState({ anchorEl: null });
    };
  
    handleResetQuery = () => {
      const {refreshData, definition, onSetDefinitionQuery} = this.props
      onSetDefinitionQuery({[definition]: {}})
      this.setState({...this.initState}, () => {
        refreshData()
      })
    }

    handleSearch = (queryStr) => {
      const {searchBoxMode} = this.state
      const {refreshData, definition, onSetDefinitionQuery} = this.props
      onSetDefinitionQuery({[definition]: {mode: searchBoxMode, query: queryStr}})
      refreshData(undefined,undefined,undefined,undefined,queryStr)
      this.handleClose()
    }

    handleSimpleSearch = () => {
      const {searchField, searchWord} = this.state
      this.handleSearch(JSON.stringify({[searchField]: searchWord}))
    }

    handleAdvanceSearch = () => {
      const {searchAdvanceText} = this.state
      this.handleSearch(cleanJsonStr(searchAdvanceText))
    }


    buildSimpleSearchBox = () => {
      const {classes, properties} = this.props
      const {searchField, searchWord} = this.state
      return ([
        <TextField key={1}
          className={classes.lrPad}
          select
          label="Field"
          value={searchField || ""}
          onChange={this.handleChange('searchField')}
        >
          {_.keys(properties).map(property => (
            <MenuItem key={property} value={property}>
              {property}
            </MenuItem>
          ))}
        </TextField>,
        <Input key={2}
          className={classes.searchWord}
          value={searchWord || ""}
          onChange={this.handleChange('searchWord')}
        />,
        <Button key={3}
          className={classes.highlightBtn}
          disabled={!searchWord || !searchField}
          onClick={this.handleSimpleSearch}
        >
          <SearchIcon/>
        </Button>
      ])
    }

    buildAdvanceSearchBox = () => {
      const {classes} = this.props
      const {searchAdvanceText} = this.state
      return ([
        <TextField key={1}
          label="Query"
          multiline
          fullWidth
          rows="4"
          tabIndex="-1"
          value={searchAdvanceText || ""}
          onChange={this.handleChange('searchAdvanceText')}
          helperText={!searchAdvanceText ? 
            `Please enter valid JSON, for nested query such as: {"a.b.c": {"$regex":".*something.*"}}`:
            evalJsonStr(searchAdvanceText) ? '' : "This Query is not a valid JSON"}
        />,
        <Button key={2}
          className={classes.highlightBtn}
          disabled={!searchAdvanceText || !evalJsonStr(searchAdvanceText)}
          onClick={this.handleAdvanceSearch}
        >
          <SearchIcon/>
        </Button>
      ])

    }

    buildSearchBox = () => {
      const {searchBoxMode} = this.state
      switch (searchBoxMode) {
        case 'simple':
          return this.buildSimpleSearchBox()
        case 'advance':
          return this.buildAdvanceSearchBox()
        default:
          break;
      }
    }

    render(){
        const { userID, selected, definition, selectedDefinitionQuery, openSingleton, deleteData, uiConfig, toggleMapView, toggleChartView, openInNewTab, classes } = this.props;
        const {anchorEl, searchBoxMode} = this.state
        return (
          <Toolbar variant="dense"
            className={classNames(classes.root, {
              [classes.highlight]: selected.length > 0,
            })}
          >
            <div className={classes.title}>
              {
                selected.length > 0 && userID ? 
                <ActionPackage 
                  uiConfig={uiConfig}
                  selected={selected}
                  openInNewTab={openInNewTab}
                  openSingleton={openSingleton}
                  deleteData={deleteData}
                /> :
                [userID &&
                <Button key={1}
                  variant="outlined" size="small" className={classes.btn} 
                  onClick={() => openSingleton()}
                >
                  <AddCircleIcon className={classes.highlightBtn}/>
                  Add {definition}
                </Button>,
                <Tooltip key={2} title={_.isEmpty(selectedDefinitionQuery)?"":"You have a running query"}>
                  <Button 
                    variant={_.isEmpty(selectedDefinitionQuery)?"outlined":"contained"} 
                    size="small" className={classes.btn} 
                    onClick={this.handleClick}
                  >
                    <SearchIcon className={classes.highlightBtn}/>
                    Search
                  </Button>
                </Tooltip>,
                !_.isEmpty(selectedDefinitionQuery) &&
                <Tooltip key={3}
                  title="Reset the Search Query">
                  <IconButton
                    color="secondary" 
                    onClick={this.handleResetQuery}
                  >
                    <RefreshIcon className={classes.warnBtn}/>
                  </IconButton>
                </Tooltip>
                ] 
              }
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
                >
                <div 
                  className={classes.lrPad}
                >
                  <FormControl component="fieldset">
                    <RadioGroup name="searchBoxMode"
                      className={classes.editorGroup}
                      value={searchBoxMode}
                      onChange={this.handleChange('searchBoxMode')} >
                      <FormControlLabel value="simple" control={<Radio />} label="Simple Search" />
                      <FormControlLabel value="advance" control={<Radio />} label="Advance Search" />
                    </RadioGroup>
                  </FormControl>
                  <div>
                  {this.buildSearchBox()}
                  </div>
                </div>
              </Menu>
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
              {
                selected.length > 0 ?
                <Typography color="inherit" variant="subtitle1">
                  {selected.length > 1 ? `${selected.length} selected`: selected[0]} 
                </Typography> : 
                (<div style={{display:'flex'}}>
                  {uiConfig['chart']['enable'] && 
                  <Button variant="outlined" size="small" className={classes.btn} onClick={() => toggleChartView()}>
                    <BarChartIcon className={classes.highlightBtn} />
                    Chart View
                  </Button>}
                  {uiConfig['map']['enable'] && 
                  <Button variant="outlined" size="small" className={classes.btn} onClick={() => toggleMapView()}>
                    <LocationOnIcon className={classes.highlightBtn} />
                    Map View
                  </Button>}
                </div>)
              }
            </div>
          </Toolbar>
        );
    }
}
  
export default withStyles(styles)(EnhancedTableToolbar)

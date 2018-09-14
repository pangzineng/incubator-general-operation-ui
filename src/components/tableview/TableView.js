import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles"
import ReactJson from 'react-json-view'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
var _ = require('lodash'); 

const styles = theme => ({
    root: {
        width: '100%'
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    footer: {
        overflowX: 'auto',
    }
});  
  
class TableView extends Component {

    stateReset = {
        order: 'asc',
        page: 0,
        rowsPerPage: 5,
        selected: []
    }

    constructor(props) {
        super(props);
        const {selectedDefinitionProperty} = props;
        this.state = {
          orderBy: _.keys(selectedDefinitionProperty)[0],
          ...this.stateReset,
          definitionSwap: false
        };
    }

    componentDidMount () {
        const {page, rowsPerPage, orderBy, order} = this.state;
        const {refreshData} = this.props;
        refreshData(page * rowsPerPage, rowsPerPage, orderBy, order === "asc" ? 1 : -1)
    }
    
    // TODO: the ugly state value `definitionSwap` is to solve the problem of double update on the component
    // the performance bug is: when switching definition, due to the seperated state/props for the table, the same API will be called twice
    // the async nature of react cause the refresh of state on this component, which contain sorting/paging, 
    // to be behind the refresh of props from parent (Listing.js) which contain the new data, causing componentDidUpdate to be triggered again
    componentDidUpdate (prevProps, prevState) {
        const {page, rowsPerPage, orderBy, order, definitionSwap} = this.state;
        const {selectedDefinition, selectedDefinitionProperty, refreshData, data, totalData} = this.props;
        if (selectedDefinition !== prevProps.selectedDefinition) {
            const sort = _.keys(selectedDefinitionProperty)[0]
            this.setState({ orderBy: sort, ...this.stateReset, definitionSwap: true }, () => {
                refreshData(this.stateReset.page * this.stateReset.rowsPerPage, this.stateReset.rowsPerPage, sort, this.stateReset.order === "asc" ? 1 : -1)
            })
        } else if (page !== prevState.page || rowsPerPage !== prevState.rowsPerPage) {
            definitionSwap ? 
                this.setState({definitionSwap: false}) :
                this.setState({ selected: [] }, () => {
                    refreshData(page * rowsPerPage, rowsPerPage, orderBy, order === "asc" ? 1 : -1)
                })
        } else if (!_.isEqual(data, prevProps.data) || totalData !== prevProps.totalData){
            this.setState({selected: []})
        }
    }
    
    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
        this.setState({ selected: newSelected });
    };
    
    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';
    
        if (this.state.orderBy === property && this.state.order === 'desc') {
          order = 'asc';
        }
    
        this.setState({ order, orderBy });
    };
    
    handleSelectAllClick = (event, checked) => {
        this.setState({selected: checked ? this.props.data.map(n=>n._id) : []})
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    handleChangePage = (event, page) => {
        this.setState({ page, definitionSwap: false });
    };
    
    handleChangeRowsPerPage = event => {
        this.setState({ ...this.stateReset, rowsPerPage: event.target.value, definitionSwap:false });
    };
    
    render() {
        const { userID, classes, data, totalData, selectedDefinition, selectedDefinitionQuery, onSetDefinitionQuery, openSingleton, refreshData, deleteData, toggleMapView, toggleChartView, openInNewTab, selectedDefinitionProperty, uiConfig } = this.props;
        const { selected, order, orderBy, rowsPerPage, page } = this.state;
        return (
            <Paper className={classes.root}>
            <EnhancedTableToolbar 
                userID={userID}
                selected={selected} 
                definition={selectedDefinition} 
                properties={selectedDefinitionProperty}
                selectedDefinitionQuery={selectedDefinitionQuery}
                onSetDefinitionQuery={onSetDefinitionQuery}
                refreshData={refreshData}
                openSingleton={openSingleton}
                deleteData={deleteData}
                uiConfig={uiConfig}
                toggleMapView={toggleMapView}
                toggleChartView={toggleChartView}
                openInNewTab={openInNewTab}
            />
            <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
                <EnhancedTableHead
                    properties={selectedDefinitionProperty}
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={data.length}
                />
                <TableBody>
                {_.orderBy(data, orderBy, order)
                    .map(n => {
                    const isSelected = this.isSelected(n._id);
                    return (
                        <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n._id}
                        selected={isSelected}
                        >
                        <TableCell 
                            onClick={event => this.handleClick(event, n._id)}
                            padding="checkbox">
                            <Checkbox checked={isSelected} />
                        </TableCell>
                        {_.sortBy(_.keys(selectedDefinitionProperty)).filter(nk => !nk.startsWith('_')).map( (nk, i) =>
                            <TableCell key={i}>
                            {_.isObject(n[nk]) ? 
                                <ReactJson 
                                src={n[nk]} 
                                name={false}
                                collapsed={true}
                                collapseStringsAfterLength={20}
                                enableClipboard={false}
                                displayObjectSize={false}
                                displayDataTypes={false}
                                /> 
                            :n[nk]}
                            </TableCell>
                        )}
                        </TableRow>
                    );
                    })}
                </TableBody>
            </Table>
            </div>
            <TablePagination
                className={classes.footer}
                component="div"
                count={totalData}
                rowsPerPageOptions={[5,10,25,totalData]}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                    'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                    'aria-label': 'Next Page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
        </Paper>
        )
    }
}

export default withStyles(styles)(TableView)

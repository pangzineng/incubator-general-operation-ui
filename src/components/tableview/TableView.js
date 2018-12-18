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

    constructor(props) {
        super(props);
        this.state = {
          selected: [],
          definitionSwap: false
        };
    }

    componentDidMount () {
        const {refreshData, dataCriteria} = this.props;
        const {page, rowsPerPage, orderBy, order} = dataCriteria;
        refreshData(page * rowsPerPage, rowsPerPage, orderBy, order)
    }
    
    // TODO: the ugly state value `definitionSwap` is to solve the problem of double update on the component
    // the performance bug is: when switching definition, due to the seperated state/props for the table, the same API will be called twice
    // the async nature of react cause the refresh of state on this component, which contain sorting/paging, 
    // to be behind the refresh of props from parent (Listing.js) which contain the new data, causing componentDidUpdate to be triggered again
    componentDidUpdate (prevProps) {
        const {selectedDefinition, selectedDefinitionProperty, refreshData, data, totalData, dataCriteria, editDataCriteria} = this.props;
        const {page, rowsPerPage, orderBy, order} = dataCriteria
        const {definitionSwap} = this.state;
        if (selectedDefinition !== prevProps.selectedDefinition) {
            const sort = _.keys(selectedDefinitionProperty)[0]
            editDataCriteria({orderBy: sort}, true, () => {
                this.setState({definitionSwap: true }, () => {
                    refreshData()
                })
            })
        } else if (page !== prevProps.dataCriteria.page || rowsPerPage !== prevProps.dataCriteria.rowsPerPage) {
            definitionSwap ? 
                this.setState({definitionSwap: false}) :
                this.setState({ selected: [] }, () => {
                    refreshData(page * rowsPerPage, rowsPerPage, orderBy, order)
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
        let order = 'asc';
        const {dataCriteria, editDataCriteria, refreshData} = this.props
        if (dataCriteria.orderBy === property && dataCriteria.order === 'asc') {
          order = 'desc';
        }
    
        editDataCriteria({ order, orderBy }, false, refreshData);
    };
    
    handleSelectAllClick = (event, checked) => {
        this.setState({selected: checked ? this.props.data.map(n=>n._id) : []})
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    handleChangePage = (event, page) => {
        this.setState({ definitionSwap: false });
        this.props.editDataCriteria({page})
    };
    
    handleChangeRowsPerPage = event => {
        this.setState({definitionSwap:false})
        this.props.editDataCriteria({rowsPerPage: event.target.value}, true);
    };
    
    render() {
        const { userID, classes, data, totalData, selectedDefinition, selectedDefinitionQuery, onSetDefinitionQuery, openSingleton, refreshData, deleteData, toggleMapView, toggleChartView, openInNewTab, selectedDefinitionProperty, uiConfig, dataCriteria } = this.props;
        const { selected } = this.state;
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
                    order={dataCriteria.order}
                    orderBy={dataCriteria.orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={data.length}
                />
                <TableBody>
                {data
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
                rowsPerPageOptions={[10,25,50]}
                rowsPerPage={[10,25,50].includes(dataCriteria.rowsPerPage) ? dataCriteria.rowsPerPage: 10}
                page={dataCriteria.page}
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

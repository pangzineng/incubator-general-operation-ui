import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles"
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import ListItemText from '@material-ui/core/ListItemText';
var _ = require('lodash'); 

const styles = () => ({
});

class EnhancedTableHead extends Component {

    createSortHandler = property => event => {
      this.props.onRequestSort(event, property);
    };
  
    render() {
      const { onSelectAllClick, order, orderBy, numSelected, rowCount, properties } = this.props;
  
      return (
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            </TableCell>
            {_.sortBy(_.keys(properties)).filter(nk => !nk.startsWith('_')).map(propertyKey => {
              return (
                <TableCell
                  key={propertyKey}
                  align={properties[propertyKey].type === 'number' ? 'center' : 'inherit'}
                  sortDirection={orderBy === propertyKey ? order : false}
                >
                  <Tooltip
                    title="Sort"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === propertyKey}
                      direction={order}
                      onClick={this.createSortHandler(propertyKey)}
                    >
              <ListItemText 
                primary={propertyKey}
                secondary={properties[propertyKey].description} />
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              );
            }, this)}
          </TableRow>
        </TableHead>
      );
    }
  }
  
export default withStyles(styles)(EnhancedTableHead)

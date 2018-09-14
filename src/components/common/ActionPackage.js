import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles"
import DeleteIcon from '@material-ui/icons/Delete';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
        display: 'flex',
        alignItem: 'center',
        justifyContent: 'center'
    },
    btn:{
        margin: theme.spacing.unit/2
    },
    highlightBtn: {
        marginRight: theme.spacing.unit/2
    }
});

class ActionPackage extends Component {
    render(){
        const {uiConfig, selected, openInNewTab, openSingleton, deleteData, classes} = this.props
        return (
            <div className={classes.root}>
                <Button key={2} variant="outlined" size="small" className={classes.btn} onClick={() => deleteData(selected)}>
                    <DeleteIcon className={classes.highlightBtn} />
                    Delete
                </Button>
                {selected.length === 1 ? 
                    [<Button key={2} variant="outlined" size="small" className={classes.btn} onClick={() => openSingleton(selected[0])}>
                        <EditIcon className={classes.highlightBtn} />
                        Edit
                    </Button>,
                    uiConfig['oin']['enable'] && 
                    <Button key={1} variant="outlined" size="small" className={classes.btn} onClick={() => openInNewTab(selected[0])}>
                        <OpenInNewIcon className={classes.highlightBtn} />
                        {uiConfig['oin']['tooltip']}
                    </Button>] : null
                }
            </div>
        )      
    }
}

export default withStyles(styles)(ActionPackage)

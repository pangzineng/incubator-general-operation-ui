import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles"
import ReactEcharts from 'echarts-for-react';
var _ = require('lodash');

const styles = theme => ({
    root: {
        height: '90vh !important',
        width: '100%'
    }
  });
  
class ChartView extends Component {

    constructor(props){
        super(props)
        this.state = {
            option : {    
                xAxis: {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    data: []
                },
                yAxis: {}, //this is an array, but has to be inited as object to avoid crash
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    left: '1%',
                    right: '1%',
                    bottom: '1%',
                    containLabel: true
                },
                toolbox: {
                    left: 'center',
                    feature: {
                        saveAsImage: {
                            show: true,
                            type: 'svg'
                        },
                        restore: {show: true},
                        magicType: {
                            type: ['line', 'bar', 'stack', 'tiled']
                        }
                    }
                },
                legend: {
                    left: 'left',
                    data:[]
                },
                series: []
            }   
        }
    }
  
    componentDidMount(){
        this.refreshOption()
    }

    aYAxis = (y, i) => {
        return {
            offset:i*50, 
            position:'left',
            min: 'dataMin',
            max: 'dataMax',
            splitLine: {
                show: false
            },
            type: y['type'],
            axisLine: {
                onZero: false
            }
        }
    }

    aSerie = (y, i, data) => {
        return {
            name: y['name'],
            yAxisIndex: i,
            type: y['serie'],
            areaStyle: y['area'],
            data: data.map(datum => _.get(datum, y['field']))
        }
    }

    refreshOption = () => {
        const {data, uiConfig} = this.props
        if (data && data.length>0) {
            const {option} = this.state
            var newOption = _.clone(option)
            newOption = _.set(newOption, 'xAxis.data', data.map(datum => _.get(datum, uiConfig['chart']['xAxis'])))
            newOption = _.set(newOption, 'yAxis', uiConfig['chart']['yAxis'].map((y,i) => this.aYAxis(y,i)))
            newOption = _.set(newOption, 'legend.data', uiConfig['chart']['yAxis'])
            newOption = _.set(newOption, 'series', uiConfig['chart']['yAxis'].map((y,i) => this.aSerie(y,i, data)))
            newOption = _.set(newOption, 'grid.left', `${uiConfig['chart']['yAxis'].length}%`)
            this.setState({option: newOption})
        }
    }

    render() {
        const {option} = this.state
        const {classes} = this.props
        return (
            <ReactEcharts 
                className={classes.root}
                option={option}
                notMerge={true}
                lazyUpdate={true}
                opts={{renderer: 'svg'}} 
            />
        )
    }
}

export default withStyles(styles)(ChartView)

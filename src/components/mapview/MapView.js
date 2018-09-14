import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles"
import { Map, TileLayer, Marker, Popup, withLeaflet } from 'react-leaflet'
import ReactJson from 'react-json-view'
import { ReactLeafletSearch } from 'react-leaflet-search'
import ActionPackage from '../common/ActionPackage'
var _ = require('lodash'); 

const MapSearch = withLeaflet(ReactLeafletSearch)


const styles = theme => ({
    root: {
        height: '90vh',
        width: '100%'
    }
  });
  
  
class MapView extends Component {

  constructor(props){
      super(props)
      this.state = {
          bounds: [[-90,90],[-180,180]],
          markers: []
      }
  }

  getll = (dataMap, datum) => {
    return [parseFloat(_.get(datum, dataMap.lat)), parseFloat(_.get(datum, dataMap.lon))]
  }

  
  parseGeo = (dataMap, data) => {
    return data.map(datum => 
      [_.toNumber(_.get(datum, dataMap.lat)), _.toNumber(_.get(datum, dataMap.lon)), datum]
    ).filter(datum => 
      !(isNaN(datum[0]) || isNaN(datum[1]))
    ).map(datum => 
      [[datum[0], datum[1]], datum[2]]
    )
  }

  findMaxBound = (data) => {
    const points = _.zip(...data)
    const maxY = _.max(points[0])
    const minY = _.min(points[0])
    const maxX = _.max(points[1])
    const minX = _.min(points[1])
    if(points[0].length > 1){
      return [[minY, minX], [maxY, maxX]] 
    } else {
      return [[minY-0.1, minX-0.2], [maxY+0.1, maxX+0.2]]
    }
  }

  componentDidMount(){
    this.refreshMarkers()
  }

  componentDidUpdate(prevProps){
    const {data, uiConfig} = this.props
    if(!(_.isEqual(data, prevProps.data) && _.isEqual(uiConfig, prevProps.uiConfig))){
        this.refreshMarkers()
    }
  }

  refreshMarkers = () => {
    const {data, uiConfig, onSetSnacker} = this.props
    if (data && data.length > 0){
      const markers = this.parseGeo(uiConfig['map'], data)
      if(markers.length < data.length){
        onSetSnacker({openSnack: true, snackMsgType: "warning", 
          snackMsg: `${data.length - markers.length} data points (of total ${data.length}) have invalid lat/lon value, unable to be rendered in Map View`
        })
      }
      if (markers.length > 0){
        const bounds = this.findMaxBound(markers.map(marker => marker[0]))
        this.setState({bounds: bounds, markers: markers})
      }
    }
  }

  render() {
    const {userID, uiConfig, openInNewTab, openSingleton, deleteData, classes} = this.props
    const {markers, bounds} = this.state
    return (
      <Map className={classes.root} attributionControl={false}
        center={[1.28218, 103.85002]} zoom={3} // center of the world!
        useFlyTo={false} bounds={bounds}
        maxZoom={19}
      >
        <MapSearch 
          position="topleft" 
          inputPlaceholder="search location ( or type :lat,lon )" />
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {markers.map((marker, i) => 
        <Marker key={i} position={marker[0]}>
            <Popup>
                <ReactJson 
                    src={marker[1]}
                    name={false}
                    collapsed={false}
                    collapseStringsAfterLength={20}
                    enableClipboard={false}
                    displayObjectSize={false}
                    displayDataTypes={false}
                /> 
                {userID && <ActionPackage 
                  uiConfig={uiConfig}
                  selected={[marker[1]['_id']]}
                  openInNewTab={openInNewTab}
                  openSingleton={openSingleton}
                  deleteData={deleteData}
                />}
            </Popup>
        </Marker>
        )}
      </Map>
    )
  }
}

export default withStyles(styles)(MapView)

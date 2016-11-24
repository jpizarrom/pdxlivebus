import React, { Component } from "react";
import ReactGA from 'react-ga';
import classnames from "classnames";
import { connect } from "react-redux";
import { Map, Marker, TileLayer } from 'react-leaflet';
import ReactMapboxGl, { Layer, Feature, Popup, ZoomControl } from "react-mapbox-gl";
import map from "lodash/map";
import VehicleSocket from "./VehicleSocket";
import config from "./config.json";

const { accessToken, style } = config;

import { divIcon, point } from "leaflet";

import AppCss from "./app.css";

// const position = [
//   -33.4851226806641,
//   -70.5222930908203,
// ];

const cover = {position: 'absolute', left: 0, right: 0, top: 0, bottom: 0};

// const state = {
//   center: [-70.5222930908203, -33.4851226806641],
//   zoom: [10],
//   skip: 0,
//   // stations: new Map(),
//   popupShowLabel: true
// };

const containerStyle = {
  height: "100vh",
  width: "100vw"
};

const styles = {
  button: {
    cursor: "pointer"
  },

  stationDescription: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "16px 0px",
    textAlign: "center",
    backgroundColor: "white"
  },

  popup: {
    background: "#fff",
    padding: "5px",
    borderRadius: "2px"
  }
}

class App extends Component {

  state = {
    center: [-70.64794101900515, -33.48742705566642],
    zoom: [10],
    skip: 0,
    // stations: new Map(),
    popupShowLabel: true
  };

  _markerClick = (vehicle, { feature }) => {
    ReactGA.modalview('/'+vehicle.type+'/'+vehicle.routeNumber+'/'+vehicle.vehicleID);
    this.setState({
      center: feature.geometry.coordinates,
      zoom: [14],
      vehicle
    });
  };

  _onDrag = () => {
    if (this.state.vehicle) {
      this.setState({
        vehicle: null
      });
    }
  };

  _setMove = (end) => {
    if(end !== this.state.end)
      this.setState({ end });
  };

  _onToggleHover(cursor, { map }) {
    map.getCanvas().style.cursor = cursor;
  }

  _onControlClick = (map, zoomDiff) => {
    const zoom = map.getZoom() + zoomDiff;
    this.setState({ zoom: [zoom] });
  };

  _popupChange(popupShowLabel) {
    this.setState({ popupShowLabel });
  }

  render() {
    const { vehicles } = this.props;
    const { vehicle, skip, end, popupShowLabel } = this.state;

    return (
      <VehicleSocket>
        <div style={cover}>
          <ReactMapboxGl
            style={style}
            center={this.state.center}
            zoom={this.state.zoom}
            minZoom={8}
            maxZoom={15}
            // maxBounds={maxBounds}
            accessToken={accessToken}
            onDrag={this._onDrag}
            onMoveEnd={this._setMove.bind(this, true)}
            onMove={this._setMove.bind(this, false)}
            containerStyle={containerStyle}>

          <ZoomControl
            zoomDiff={1}
            onControlClick={this._onControlClick}/>

            <Layer
              type="symbol"
              id="marker"
              layout={{ "icon-image": "marker-15" }}>
              {
                vehicles
                  .map((vehicle, index) => (
                    <Feature
                      key={vehicle.vehicleID}
                      onHover={this._onToggleHover.bind(this, "pointer")}
                      onEndHover={this._onToggleHover.bind(this, "")}
                      onClick={this._markerClick.bind(this, vehicle)}
                      coordinates={[vehicle.longitude,vehicle.latitude]}/>
                  ))
              }
            </Layer>

            {
              vehicle && end && (
                <Popup key={vehicle.vehicleID} coordinates={[vehicle.longitude,vehicle.latitude]} closeButton={true}>
                  <div>
                    <span style={{
                      ...styles.popup,
                      display: popupShowLabel ? "block" : "none"
                    }}>
                      {vehicle.routeNumber}
                    </span>
                    <div onClick={this._popupChange.bind(this, !popupShowLabel)}>
                      {
                        popupShowLabel ? "Hide" : "Show"
                      }
                    </div>
                  </div>
                </Popup>
              )
            }

          </ReactMapboxGl>
        {
          vehicle && end && (
            <div style={styles.stationDescription}>
              <p>{ vehicle.routeNumber }</p>
              <p>{ vehicle.vehicleID } </p>
            </div>
          )
        }
        </div>
      </VehicleSocket>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      vehicles: state.vehicles
    }
}
export default connect(mapStateToProps)(App)

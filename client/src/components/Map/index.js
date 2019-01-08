import React from "react";
import { compose, withProps, lifecycle } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps"

const googleMapURL = "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=" + process.env.REACT_APP_GOOGLE_API

export default compose(
    withProps({
      googleMapURL,
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `200px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
    }),
    lifecycle({
        componentWillMount () {
            const refs = {}
            this.setState({
                onMapMounted: map => {
                    refs.map = map;
                    this.setState({ map });
                    this.props.onMapMounted && this.props.onMapMounted(map);
                },
                // onCenterChanged: () => {
                //     const center = refs.map.getCenter()
                //     const lat = center.lat()
                //     const lng = center.lng()
                //     this.props.onCenterChanged && this.props.onCenterChanged({
                //         lat, 
                //         lng
                //     })
                // }
            })
        },
        componentDidUpdate () {
            const bounds = new window.google.maps.LatLngBounds();
            this.props.children.forEach(({ props }) => {
                if (props && props.position) {
                    const { lat, lng } = props.position;
                    bounds.extend(new window.google.maps.LatLng(lat, lng));
                }
            })
            this.state.map.fitBounds(bounds);
        },
    }),
    withScriptjs,
    withGoogleMap
  )(({ children, onMapMounted, onCenterChanged, ...props }) => (
    <GoogleMap
      {...props}
      ref={onMapMounted}
    //   onCenterChanged={onCenterChanged}
    >
      { children }
    </GoogleMap>
  ));
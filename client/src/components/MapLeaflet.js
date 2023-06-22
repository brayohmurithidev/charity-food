import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { DivIcon, Icon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

const MapLeaflet = ({ lat, lon, foodbanks }) => {
  const [mapKey, setMapKey] = useState(0);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (foodbanks) {
      const newMarkers = foodbanks?.map((foodbank) => ({
        id: foodbank.id,
        geocode: [
          foodbank.latitude || foodbank.foodbank.latitude,
          foodbank.longitude || foodbank.foodbank.longitude,
        ],
        popUp: {
          name: foodbank.name || foodbank.foodbank.name,
          city: foodbank.city || foodbank.foodbank.city,
          postalCode: foodbank.postal_code || foodbank.foodbank.postal_code,
          state: foodbank.state || foodbank.foodbank.state,
          acceptedFoods: foodbank.preferred_food_items,
        },
      }));

      setMarkers(newMarkers);
    }
  }, [foodbanks]);

  useEffect(() => {
    // Increment the map key when the center coordinates change
    setMapKey((prevKey) => prevKey + 1);
  }, [lat, lon]);

  const customIcon = new Icon({
    iconUrl: require("../assets/images/location.png"),
    iconSize: [38, 38],
  });

  const customselfIcon = new Icon({
    iconUrl: require("../assets/images/placeholder.png"),
    iconSize: [38, 38],
  });

  const createCustomClusterIcon = (cluster) => {
    return new DivIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      iconSize: point(33, 33, true),
      className: "custom-marker-cluster",
    });
  };

  return (
    <MapContainer key={mapKey} center={[lat, lon]} zoom={13}>
      {/* Display tiles of our maps */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* <TileLayer 
    attribution='MAP BOX'
    url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
    /> */}

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createCustomClusterIcon}
      >
        {/* <Marker position={[52.3877830, 9.7334394]} >
    <Popup>`<h2>Your are here</h2>`</Popup>
    </Marker> */}
        <Marker position={[lat, lon]} icon={customselfIcon}>
          <Popup>
            `<h4>You are here!</h4>`
          </Popup>
        </Marker>
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={customIcon}>
            <Popup>
              `<h4> Name: {marker.popUp.name}</h4>
              <h4> City: {marker.popUp.city}</h4>
              <h4> Postal Code: {marker.popUp.postalCode}</h4>
              <h4> state: {marker.popUp.state}</h4>
              <h4> Accepted Foods: [{marker.popUp.acceptedFoods}]</h4>`
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapLeaflet;

//use leaflet react to display map
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Table } from 'react-bootstrap';
import { connect, useSelector } from 'react-redux';
import { getItinerary } from '../actions/profile';
import CSRFToken from '../components/CSRFToken';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Icon } from 'leaflet';
import { render } from 'react-dom';


function Map(){
    return(
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
            <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </Marker>
        </MapContainer>
    )
}

export default Map;

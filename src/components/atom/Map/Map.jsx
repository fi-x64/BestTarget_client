import React, { useEffect, useRef, useState } from 'react'
// import wkx from 'wkx'
import L, { map } from 'leaflet'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMapEvent,
  useMap
} from 'react-leaflet'

import classNames from 'classnames/bind'
import styles from './Map.module.scss'
import { Button, Form, InputNumber, Tooltip } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  DeleteOutlined,
  EnvironmentOutlined,
  InboxOutlined,
  SearchOutlined,
} from '@ant-design/icons'

import redLocation from '../../../assets/img/red-location.png'
import markerIcon from '../../../assets/img/marker-icon.png'
import markerShadow from '../../../assets/img/marker-shadow.png'
import { ErrorMessage, Formik } from 'formik'
import Pane from './Pane'

const cl = classNames.bind(styles)

function Map({ staticLongitude, staticLatitude }) {
  let navigate = useNavigate()
  const mapRef = useRef();
  const formikRef = useRef();
  // const temporaryMarkerRef = useRef(null);
  // const animateRef = useRef(false);

  const { user: currentUser } = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  const [temporaryMarker, setTemporaryMarker] = useState(null)

  // useEffect(() => {
  //   if (formikRef.current && temporaryMarker !== null) {
  //     formikRef.current.setFieldValue('latitude', temporaryMarker[0] || 0)
  //     formikRef.current.setFieldValue('longitude', temporaryMarker[1] || 0)
  //   }
  // }, [temporaryMarker])

  // const addTemporaryMaker = (latlng) => {
  //   setTemporaryMarker(latlng)
  // }

  const RedIcon = L.icon({
    iconUrl: redLocation,
    iconAnchor: [21, 43],
  })

  let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconAnchor: [21, 43],
    // shadowUrl: markerShadow,
  })

  L.Marker.prototype.options.icon = DefaultIcon

  return (
    <div>
      <MapContainer
        ref={mapRef}
        style={{ width: '850px', height: '500px' }}
        zoom={14}
        center={[staticLatitude, staticLongitude]}
        scrollWheelZoom={true}
        fadeAnimation={true}
        markerZoomAnimation={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          icon={RedIcon}
          position={[staticLatitude, staticLongitude]}
        ></Marker>

        <Pane
          staticLatitude={staticLatitude}
          staticLongitude={staticLongitude}
        />
      </MapContainer>
    </div>
  )
}

export default Map

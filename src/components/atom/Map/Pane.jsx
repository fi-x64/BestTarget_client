import React, { useEffect, useRef, useState } from 'react'
// import wkx from 'wkx'
import L, { map } from 'leaflet'
import * as Yup from 'yup'

import {
    Marker,
    useMap
} from 'react-leaflet'

import classNames from 'classnames/bind'
import styles from './Pane.module.scss'
import { Button, Form, InputNumber, Tooltip } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import RequiredIcon from '../../../components/atom/RequiredIcon/RequiredIcon'

import redLocation from '../../../assets/img/red-location.png'
import markerIcon from '../../../assets/img/marker-icon.png'
import markerShadow from '../../../assets/img/marker-shadow.png'
import { ErrorMessage, FastField, Formik } from 'formik'
import Routing from './Routing'

const cl = classNames.bind(styles)

function Pane({ staticLatitude, staticLongitude }) {
    const mapRef = useRef();
    const formikRef = useRef();
    const temporaryMarkerRef = useRef(null);
    const animateRef = useRef(false);

    const [temporaryMarker, setTemporaryMarker] = useState(null);
    const [waypoints, setWaypoints] = useState([]);

    const map = useMap();

    const MapSchema = Yup.object().shape({
        longitude: Yup.number()
            .min(-180, 'Kinh độ phải từ -180 đến 180!')
            .max(180, 'Kinh độ phải từ -180 đến 180!')
            .required('Vui lòng nhập kinh độ').typeError('Vui lòng nhập số'),
        latitude: Yup.number()
            .min(-90, 'Vĩ độ phải từ -90 đến 90!')
            .max(90, 'Vĩ độ phải từ -90 đến 90!')
            .required('Vui lòng nhập vĩ độ!').typeError('Vui lòng nhập số'),
    })

    const onGoToPosition = (latlng) => {
        setTemporaryMarker(latlng)
    };

    useEffect(() => {
        if (formikRef.current && temporaryMarker !== null) {
            formikRef.current.setFieldValue('latitude', temporaryMarker[0] || 0)
            formikRef.current.setFieldValue('longitude', temporaryMarker[1] || 0)
        }
    }, [temporaryMarker]);

    async function handleRouting(values) {
        if (values.latitude && values.longitude) {
            const position = L.latLng(values.latitude, values.longitude)
            map.flyTo(position, map.getZoom())
            setWaypoints([position, L.latLng(staticLatitude, staticLongitude)])
        }
    }

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
        <>
            <Formik
                innerRef={formikRef}
                initialValues={
                    {
                        longitude: 0,
                        latitude: 0,
                    }
                }
                onSubmit={(values, { setFieldError }) =>
                    handleSubmit(values, setFieldError)
                }
                validationSchema={MapSchema}
                enableReinitialize
            >
                {({
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                }) => (
                    <Form className='relative z-[100000] float-left ml-14'>
                        <div className='flex bg-white opacity-90 p-1 rounded-bl-lg gap-2'>
                            <div >
                                <label className='label mr-2' htmlFor="longitude">
                                    Kinh độ:
                                </label>
                                <FastField
                                    name="longitude"
                                    id="longitude"
                                    component={InputNumber}
                                    value={values.longitude}
                                    status={
                                        errors?.longitude && touched?.longitude ? 'error' : ''
                                    }
                                    onChange={(value) => setFieldValue('longitude', value)}
                                    onBlur={handleBlur}
                                ></FastField>
                                <ErrorMessage
                                    className="field-error"
                                    component="div"
                                    name="longitude"
                                ></ErrorMessage>
                            </div>
                            <div>
                                <label className='label mr-2' htmlFor="latitude">
                                    Vĩ độ:
                                </label>
                                <FastField
                                    name="latitude"
                                    id="latitude"
                                    component={InputNumber}
                                    value={values.latitude}
                                    status={errors?.latitude && touched?.latitude ? 'error' : ''}
                                    className='input'
                                    onChange={(value) => setFieldValue('latitude', value)}
                                    onBlur={handleBlur}
                                ></FastField>
                                <ErrorMessage
                                    className="field-error"
                                    component="div"
                                    name="latitude"
                                ></ErrorMessage>
                            </div>
                            <Tooltip title="Đi đến vị trí đã nhập">
                                <Button
                                    onClick={() => {
                                        onGoToPosition([values.latitude, values.longitude])
                                        map.setView([values.latitude, values.longitude], 10, {
                                            animate: animateRef.current || false,
                                        })
                                        map.panTo([values.latitude, values.longitude])
                                    }}
                                    className='go-button bg-[#1677ff]'
                                    type="primary"
                                    shape="circle"
                                    icon={<i className="fa-solid fa-up-down-left-right"></i>}
                                />
                            </Tooltip>
                            <Tooltip title="Nhấn vào để tiến hành rê chọn vị trí bất kì">
                                <Button
                                    onClick={() => {
                                        const currentCenterLatlng = map.getCenter()
                                        setTemporaryMarker([
                                            currentCenterLatlng.lat,
                                            currentCenterLatlng.lng,
                                        ])
                                    }}
                                    className='go-button bg-[#1677ff]'
                                    type="primary"
                                    shape="circle"
                                    icon={<i className="fa-solid fa-map-pin"></i>}
                                />
                            </Tooltip>
                            <Tooltip title="Nhấn vào để lấy vị trí hiện tại">
                                <Button
                                    onClick={() => {
                                        navigator.geolocation.getCurrentPosition(
                                            (position) => {
                                                const { latitude, longitude } = position.coords;
                                                setTemporaryMarker([
                                                    latitude,
                                                    longitude,
                                                ])
                                            },
                                            (error) => {
                                                console.log(error);
                                            },
                                            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                                        );
                                    }}
                                    className='go-button bg-[#1677ff]'
                                    type="primary"
                                    shape="circle"
                                    icon={<i className="fa-solid fa-location-arrow"></i>}
                                />
                            </Tooltip>
                            <Tooltip title="Nhấn vào để chỉ đường">
                                <Button
                                    onClick={() => handleRouting(values)}
                                    className='go-button bg-[#1677ff]'
                                    type="primary"
                                    shape="circle"
                                    icon={<i className="fa-solid fa-route"></i>}
                                />
                            </Tooltip>
                        </div>
                    </Form>
                )}
            </Formik>
            {temporaryMarker !== null && (
                <Marker
                    icon={DefaultIcon}
                    draggable
                    ref={temporaryMarkerRef}
                    eventHandlers={{
                        dragend() {
                            const marker = temporaryMarkerRef.current
                            if (marker != null) {
                                setTemporaryMarker([marker._latlng.lat, marker._latlng.lng])
                            }
                        },
                    }}
                    position={temporaryMarker}
                ></Marker>
            )}
            <Routing waypoints={waypoints} />
        </>
    )
}

export default Pane

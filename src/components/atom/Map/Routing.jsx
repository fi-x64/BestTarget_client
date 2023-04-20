import L from 'leaflet'
import 'leaflet-routing-machine'
import { useMap } from 'react-leaflet'
import { useEffect } from 'react'

function Routing({ waypoints }) {
    const map = useMap()

    useEffect(() => {
        if (!map || waypoints.length === 0) return

        const routingControl = L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: false,
            collapsible: true,
            lineOptions: {
                styles: [{ color: 'black', opacity: 1, weight: 3 }],
            },
        }).addTo(map)

        return () => map.removeControl(routingControl)
    }, [map, waypoints])

    return null
}

export default Routing

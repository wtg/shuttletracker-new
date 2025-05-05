import { useEffect, useRef, useState } from "react";

export default function MapKitMap({ vehicles }) {

    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [token, setToken] = useState(null);
    const [map, setMap] = useState(null);

    // https://developer.apple.com/documentation/mapkitjs/loading-the-latest-version-of-mapkit-js
    const setupMapKitJs = async() => {
        if (!window.mapkit || window.mapkit.loadedLibraries.length === 0) {
            await new Promise(resolve => { window.initMapKit = resolve });
            delete window.initMapKit;
        }
    };


    useEffect(() => {
        fetch('/api/mapkit')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setToken(data);
            })
            .catch((error) => {
                console.error('Error fetching MapKit token:', error);
            });
    }, []);

    // initialize mapkit
    useEffect(() => {
        if (!token) return;
        const mapkitScript = async () => {
            // load the MapKit JS library
            await setupMapKitJs();
            window.mapkit.init({
                authorizationCallback: (done) => {
                    done(token);
                },
            });
            setMapLoaded(true);
        }
        mapkitScript();
    }, [token]);

    useEffect(() => {
        if (mapLoaded) {

            const center = new window.mapkit.Coordinate(42.729435290940444, -73.67810063507858);
            const span = new window.mapkit.CoordinateSpan(0.015, 0.005);
            const region = new window.mapkit.CoordinateRegion(center, span);

            const mapOptions = {
                center: center,
                zoomLevel: 10,
                region: region,
                isScrollEnabled: false,
                isZoomEnabled: false,
            };

            setMap(new window.mapkit.Map(mapRef.current, mapOptions));

        }
    }, [mapLoaded]);

    useEffect(() => {
        if (!mapLoaded) return;
        const annotations = vehicles.map(vehicle => {
            return new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(vehicle.lat, vehicle.lng),
                {
                    title: vehicle.id,
                    subtitle: `Speed: ${vehicle.speed} mph`,
                }
            );
        });
        map.addAnnotations(annotations);
    }, [vehicles]);

return (
    <div
        style={{ width: '80%', height: '100vh' }}
        ref={mapRef}
    >
    </div>
    );
};

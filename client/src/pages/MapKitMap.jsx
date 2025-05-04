import { useEffect, useRef, useState } from "react";

export default function MapKitMap({ vehicles }) {

    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [token, setToken] = useState(null);

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

            const mapOptions = {
                center: new window.mapkit.Coordinate(42.7299107, -73.6835165),
                zoomLevel: 10,
            };

            const map = new window.mapkit.Map(mapRef.current, mapOptions);

        }
    }, [mapLoaded]);

    /*
    useEffect(() => {
        if (!mapLoaded || !mapRef.current) return;
        const coordinates = vehicles.map(vehicle => {
            return new window.mapkit.Coordinate(vehicle.lat, vehicle.lng);
        });
        const annotations = vehicles.map(vehicle => {
            return new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(vehicle.lat, vehicle.lng),
                {
                    title: vehicle.id,
                    subtitle: `Speed: ${vehicle.speed} mph`,
                }
            );
        });
        map.showItems(coordinates);
        map.addAnnotations(annotations);
    }, [vehicles]);
        */


return (
    <div
        style={{ width: '100%', height: '100vh' }}
        ref={mapRef}
    >
    </div>
    );
};

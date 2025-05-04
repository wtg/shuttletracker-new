import { useEffect, useRef, useState } from "react";

export default function MapKitMap({ vehicles }) {

    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // initialize mapkit
    useEffect(() => {
        const initMap = async () => {
            if (!window.mapkit) {
                const token = await new Promise((resolve) => {
                    fetch('/api/mapkit')
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then((data) => {
                            const token = data;
                            resolve(token);
                        });
                });
                // load the MapKit JS library
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.core.js';
                    script.crossOrigin = 'anonymous';
                    script.onload = () => {
                        window.mapkit.init({
                            authorizationCallback: (done) => done(token),
                            libraries: ['map'],
                        });
                        setMapLoaded(true);
                        resolve();
                    };
                    script.setAttribute('data-libraries', 'map');
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }
        };

        initMap();
    }, []);

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

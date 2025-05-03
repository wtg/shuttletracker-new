import { useEffect, useRef } from "react";

export default function MapKitMap({ vehicles }) {

    const mapRef = useRef(null);

    useEffect(() => {
        if (!window.mapkit || !mapRef.current) {
            return;
        }
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
    }, [vehicles, mapRef]);

    // initialize mapkit
    useEffect(() => {
        const initMap = async () => {
            if (!window.mapkit) {
                // load the MapKit JS library
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.core.js';
                    script.crossOrigin = 'anonymous';
                    script.onload = () => {
                        window.mapkit.init({
                            authorizationCallback: function(done) {
                                fetch('/api/mapkit')
                                    .then(res => res.json())
                                    .then(done);
                            },
                            libraries: ['map'],
                        });
                        resolve();
                    };
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }
        };

        initMap().then(() => {
            mapRef.current = new window.mapkit.Map('map');
        });
    }, []);

return (
    <div
        ref={mapRef}
    />
    );
};

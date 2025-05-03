import { useEffect, useRef, useState } from "react";

export default function MapKitMap({ vehicles }) {

    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);

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
                        setMapLoaded(true);
                        resolve();
                    };
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }
        };

        initMap();
    }, []);

    useEffect(() => {
        if (mapLoaded && mapRef.current) {
            const map = new window.mapkit.Map(mapRef.current);

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

            map.addAnnotations(annotations);
        }
    }, [mapLoaded, vehicles]);

return (
    <div
        ref={mapRef}
    />
    );
};

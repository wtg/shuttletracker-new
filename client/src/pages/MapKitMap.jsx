import { useEffect, useRef } from "react";

export default function MapKitMap({ vehicles }) {

    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapkit || !mapRef.current) {
            return;
        }
        const coordinates = vehicles.map(vehicle => {
            return new mapkit.Coordinate(vehicle.lat, vehicle.lng);
        });
        const annotations = vehicles.map(vehicle => {
            return new mapkit.MarkerAnnotation(
                new mapkit.Coordinate(vehicle.lat, vehicle.lng),
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
            if (!mapkit) {
                // load the MapKit JS library
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.core.js';
                    script.crossOrigin = true;
                    script.async = true;
                    script.setAttribute('data-callback', 'initMapKit');
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }

            mapkit.init({
                authorizationCallback: function(done) {
                    fetch('/api/mapkit')
                        .then(res => res.json())
                        .then(done);
                }
            });

            mapkit.addEventListener("load", () => {
                mapkit.loadLibrary("map").then(() => {
                    new mapkit.Map(mapRef.current);
                });
            });

            const map = new mapkit.Map(mapRef.current);
        };

        initMap();
    }, []);

return (
    <div
        ref={mapRef}
    />
    );
};

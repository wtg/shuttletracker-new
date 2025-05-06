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

            const center = new window.mapkit.Coordinate(42.72993481153551, -73.67622381172905);
            const span = new window.mapkit.CoordinateSpan(0.02, 0.005);
            const region = new window.mapkit.CoordinateRegion(center, span);

            const mapOptions = {
                center: center,
                region: region,
                isScrollEnabled: false,
                isZoomEnabled: false,
            };

            setMap(new window.mapkit.Map(mapRef.current, mapOptions));

        }
    }, [mapLoaded]);

    useEffect(() => {
        if (!map) return;

        // north
        // 42.730676958536144, -73.67674616623393
        // 42.737043669212134, -73.67036818086305
        // 42.735455332919045, -73.6636579612421
        // 42.73453830902714, -73.6634349282215
        // 42.7327033365768, -73.66522556880754
        // 42.73080472933945, -73.6673502020617
        // 42.73175755884203, -73.66967270972104

        // west
        // 42.730318398121575, -73.67656636425313
        // 42.72799822908236, -73.67809671921837
        // 42.72293385583282, -73.67960937432454
        // 42.72766469852938, -73.68716188006067
        // 42.73160170173599, -73.68627833913843
        // 42.731468785216094, -73.68128223685743
        // 42.731023124913804, -73.67909065365457

        const northStops = [
            new window.mapkit.Coordinate(42.730676958536144, -73.67674616623393),
            new window.mapkit.Coordinate(42.737043669212134, -73.67036818086305),
            new window.mapkit.Coordinate(42.735455332919045, -73.6636579612421),
            new window.mapkit.Coordinate(42.73453830902714, -73.6634349282215),
            new window.mapkit.Coordinate(42.7327033365768, -73.66522556880754),
            new window.mapkit.Coordinate(42.73080472933945, -73.6673502020617),
            new window.mapkit.Coordinate(42.73175755884203, -73.66967270972104)
        ]

        const westStops = [
            new window.mapkit.Coordinate(42.730318398121575, -73.67656636425313),
            new window.mapkit.Coordinate(42.72799822908236, -73.67809671921837),
            new window.mapkit.Coordinate(42.72293385583282, -73.67960937432454),
            new window.mapkit.Coordinate(42.72766469852938, -73.68716188006067),
            new window.mapkit.Coordinate(42.73160170173599, -73.68627833913843),
            new window.mapkit.Coordinate(42.731468785216094, -73.68128223685743),
            new window.mapkit.Coordinate(42.731023124913804, -73.67909065365457)
        ]

        // show markers
        northStops.map((stop, index) => {
            const annotation = new window.mapkit.MarkerAnnotation(stop, {
                title: `North Stop ${index + 1}`,
                subtitle: 'North',
                color: '#FF0000',
            });
            map.addAnnotation(annotation);
        });
        westStops.map((stop, index) => {
            const annotation = new window.mapkit.MarkerAnnotation(stop, {
                title: `West Stop ${index + 1}`,
                subtitle: 'West',
                color: '#0000FF',
            });
            map.addAnnotation(annotation);
        });

    }, [map]);

return (
    <div
        style={{ width: '80%', height: '100vh' }}
        ref={mapRef}
    >
    </div>
    );
};

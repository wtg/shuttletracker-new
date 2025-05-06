import { useEffect, useRef, useState } from "react";
import '../styles/MapKitMap.css';

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

            const center = new window.mapkit.Coordinate(42.729816326401114, -73.67548961656735);
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

        const unionMarker = new window.mapkit.MarkerAnnotation(
            new window.mapkit.Coordinate(42.730676958536144, -73.67674616623393),
            { title: 'Union', color: '#666666' }
        )

        const northMarkers = [
            /*
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.730676958536144, -73.67674616623393),
                { title: 'Union', color: '#FF0000' }
            ),
            */
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.737043669212134, -73.67036818086305),
                { title: 'Colonie', color: '#FF0000' }
            ),
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.735455332919045, -73.6636579612421),
                { title: 'Bryckwyck', color: '#FF0000' }
            ),
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.73453830902714, -73.6634349282215),
                { title: 'Rousseau', color: '#FF0000' }
            ),
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.7327033365768, -73.66522556880754),
                { title: 'Stacwyck', color: '#FF0000' }
            ),
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.73080472933945, -73.6673502020617),
                { title: 'ECAV', color: '#FF0000' }
            ),
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.73175755884203, -73.66967270972104),
                { title: 'Houston FH', color: '#FF0000' }
            ),
        ]

        const westMarkers = [
            /*
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.730318398121575, -73.67656636425313),
                { title: 'Union', color: '#0000FF' }
            ),
            */
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.72799822908236, -73.67809671921837),
                { title: 'Academy', color: '#0000FF' }
            ),
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.72293385583282, -73.67960937432454),
                { title: 'Polytechnic', color: '#0000FF' }
            ),
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.72766469852938, -73.68716188006067),
                { title: 'City Station', color: '#0000FF' }
            ),
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.73160170173599, -73.68627833913843),
                { title: 'Blitman', color: '#0000FF' }
            ),
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.731468785216094, -73.68128223685743),
                { title: 'West', color: '#0000FF' }
            ),
            new window.mapkit.MarkerAnnotation(
                new window.mapkit.Coordinate(42.731023124913804, -73.67909065365457),
                { title: "'87 Gym", color: '#0000FF' }
            ),
        ]

        const allMarkers = [unionMarker, ...northMarkers, ...westMarkers];
        allMarkers.forEach((marker) => {
            map.addAnnotation(marker);
        });

    }, [map]);

return (
    <div
        className='map'
        ref={mapRef}
    >
    </div>
    );
};

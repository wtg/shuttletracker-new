import React, {
    useState,
    useEffect,
} from 'react';
import MapKitMap from './MapKitMap';

export default function LiveLocation() {

    const [location, setLocation] = useState(null);

    useEffect(() => {
        const pollLocation = async () => {
            try {
                const response = await fetch('/api/locations');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLocation(data);
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        }

        pollLocation();

        // refresh location every 5 seconds
        const refreshLocation = setInterval(pollLocation, 5000);

        return () => {
            clearInterval(refreshLocation);
        }

    }, []);

    return (
        <>
            {location && <MapKitMap vehicles={ location }/>}
            <h1>Live Location</h1>
            {location && Object.keys(location).length > 0 ? (
                Object.keys(location).map((key) => {
                    const gps = location[key];
                    return (
                        <div key={key}>
                            <h2>Vehicle ID: {key}</h2>
                            <p>Latitude: {gps.lat}</p>
                            <p>Longitude: {gps.lng}</p>
                            <p>Speed: {gps.speed} mph</p>
                            <p>Heading: {gps.heading} degrees</p>
                            <p>Time: {new Date(gps.timestamp).toLocaleString()}</p>
                            <p>Address: {gps.address}</p>
                        </div>
                    )
                })
            ) : (
                <p>Loading...</p>
            )}
        </>
    )
}

import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { mapOptions } from '../../utils/mapConfig';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const containerStyle = {
    width: '1285px',
    height: '591px',
};

const defaultCenter = {
    lat: 42.639113,
    lng: 23.373163,
};

function Offices() {
     const { isLoaded } = useJsApiLoader({
        id: mapOptions.googleMapApiKey,
        googleMapsApiKey: mapOptions.googleMapApiKey,
    });

    const [map, setMap] = useState(null);
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch offices from backend
    useEffect(() => {
        const fetchOffices = async () => {
            try {
                console.log('Fetching offices from:', `${BASE_URL}/offices`);
                const res = await fetch(`${BASE_URL}/offices`);
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                console.log('Offices response:', data);

                if (data.success && data.data) {
                    console.log('Setting offices:', data.data);
                    setOffices(data.data);
                } else {
                    console.warn('Invalid response format:', data);
                }
            } catch (err) {
                console.error('Failed to fetch offices:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOffices();
    }, []);

    // fit map bounds when offices load
    useEffect(() => {
        if (map && offices.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            offices.forEach((office) => {
                bounds.extend({
                    lat: office.location.lat,
                    lng: office.location.lng,
                });
            });
            map.fitBounds(bounds);
            console.log('Map bounds updated with', offices.length, 'offices');
        }
    }, [map, offices]);

    // Fit map bounds based on offices
    const onLoad = useCallback((mapInstance) => {
        console.log('Map loaded, offices count:', offices.length);
        setMap(mapInstance);
        
        if (offices.length === 0) {
            mapInstance.setCenter(defaultCenter);
            mapInstance.setZoom(10);
            console.log('No offices, setting default center');
            return;
        }

        const bounds = new window.google.maps.LatLngBounds();
        offices.forEach((office) => {
            bounds.extend({
                lat: office.location.lat,
                lng: office.location.lng,
            });
        });
        mapInstance.fitBounds(bounds);
        console.log('Map fitted to offices bounds');
    }, [offices]);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    if (!isLoaded || loading) {
        return (
            <div className="spinner-wrapper">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
        {offices && offices.length > 0 && offices.map((office) => (
            <MarkerF
                key={office._id}
                position={{
                    lat: Number(office.location.lat),
                    lng: Number(office.location.lng),
                }}
                title={`${office.name} - ${office.isOpen ? 'Open' : 'Closed'}`}
                icon={{
                    url: office.isOpen
                        ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                        : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    scaledSize: new window.google.maps.Size(32, 32),
                }}
                optimized={false}
            />
        ))}
        </GoogleMap>
    );
}

export default React.memo(Offices);
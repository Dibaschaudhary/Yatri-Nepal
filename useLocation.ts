
import { useState, useEffect } from 'react';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    // Check permission status
    navigator.permissions?.query({ name: 'geolocation' as PermissionName }).then((status) => {
      setPermissionStatus(status.state);
      status.onchange = () => setPermissionStatus(status.state);
    });

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const success = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setError(null);
    };

    const handleError = (err: GeolocationPositionError) => {
      setError(err.message);
    };

    const watchId = navigator.geolocation.watchPosition(success, handleError, options);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error, permissionStatus };
};

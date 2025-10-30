// Permission management hooks
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'react-native-vision-camera';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionState {
  camera: PermissionStatus;
  location: PermissionStatus;
  contacts: PermissionStatus;
  mediaLibrary: PermissionStatus;
}

/**
 * Hook to manage app permissions
 * Provides centralized permission checking and requesting
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: 'undetermined',
    location: 'undetermined',
    contacts: 'undetermined',
    mediaLibrary: 'undetermined',
  });

  const checkPermissions = async () => {
    const [cameraStatus, locationStatus, contactsStatus, mediaStatus] =
      await Promise.all([
        Camera.getCameraPermissionStatus(),
        Location.getForegroundPermissionsAsync(),
        Contacts.getPermissionsAsync(),
        MediaLibrary.getPermissionsAsync(),
      ]);

    setPermissions({
      camera: cameraStatus as PermissionStatus,
      location: locationStatus.granted ? 'granted' : locationStatus.canAskAgain ? 'undetermined' : 'denied',
      contacts: contactsStatus.granted ? 'granted' : contactsStatus.canAskAgain ? 'undetermined' : 'denied',
      mediaLibrary: mediaStatus.granted ? 'granted' : mediaStatus.canAskAgain ? 'undetermined' : 'denied',
    });
  };

  const requestCameraPermission = async (): Promise<PermissionStatus> => {
    const status = await Camera.requestCameraPermission();
    setPermissions((prev) => ({ ...prev, camera: status as PermissionStatus }));
    return status as PermissionStatus;
  };

  const requestLocationPermission = async (): Promise<PermissionStatus> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const permStatus = status === 'granted' ? 'granted' : 'denied';
    setPermissions((prev) => ({ ...prev, location: permStatus }));
    return permStatus;
  };

  const requestContactsPermission = async (): Promise<PermissionStatus> => {
    const { status } = await Contacts.requestPermissionsAsync();
    const permStatus = status === 'granted' ? 'granted' : 'denied';
    setPermissions((prev) => ({ ...prev, contacts: permStatus }));
    return permStatus;
  };

  const requestMediaLibraryPermission = async (): Promise<PermissionStatus> => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    const permStatus = status === 'granted' ? 'granted' : 'denied';
    setPermissions((prev) => ({ ...prev, mediaLibrary: permStatus }));
    return permStatus;
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return {
    permissions,
    checkPermissions,
    requestCameraPermission,
    requestLocationPermission,
    requestContactsPermission,
    requestMediaLibraryPermission,
  };
}

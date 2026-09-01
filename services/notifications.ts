import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { api } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  let token: string | null = null;

  if (!Device.isDevice) {
    console.log('ℹ️ Push notifications require a physical device or Expo Go');
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permission not granted for push notifications');
    return null;
  }

  try {
    const pushTokenData = await Notifications.getExpoPushTokenAsync();
    token = pushTokenData.data;

    if (token) {
      await api.post('/notifications/register-token', {
        expoPushToken: token,
        deviceName: `${Device.brand || ''} ${Device.modelName || 'Device'}`.trim(),
      });
    }
  } catch (error) {
    console.warn('Failed to register push token:', error);
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#208AEF',
    });
  }

  return token;
};

import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { api } from './api';

// Check if running in Expo Go client (where remote notifications were removed in SDK 53+)
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  if (isExpoGo) {
    console.log('ℹ️ Push notifications (remote) are not supported in Expo Go on SDK 55. Use an EAS development build for push notification testing.');
    return null;
  }

  try {
    const Notifications = require('expo-notifications');

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    if (!Device.isDevice) {
      console.log('ℹ️ Push notifications require a physical device or standalone build');
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

    const pushTokenData = await Notifications.getExpoPushTokenAsync();
    const token = pushTokenData.data;

    if (token) {
      await api.post('/notifications/register-token', {
        expoPushToken: token,
        deviceName: `${Device.brand || ''} ${Device.modelName || 'Device'}`.trim(),
      });
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
  } catch (error) {
    console.warn('Push notification initialization skipped/failed:', error);
    return null;
  }
};

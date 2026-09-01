import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import prisma from '../db';

const expo = new Expo();

export const registerPushToken = async (userId: string, token: string, deviceName?: string) => {
  if (!Expo.isExpoPushToken(token)) {
    console.warn(`Invalid Expo Push Token format: ${token}`);
  }

  return prisma.pushToken.upsert({
    where: { expoPushToken: token },
    update: { userId, deviceName: deviceName || 'Mobile Device' },
    create: {
      userId,
      expoPushToken: token,
      deviceName: deviceName || 'Mobile Device',
    },
  });
};

export const sendPushNotificationToUser = async (
  userId: string,
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  try {
    const userTokens = await prisma.pushToken.findMany({
      where: { userId },
    });

    if (userTokens.length === 0) {
      console.log(`ℹ️ No push token registered for user ${userId}. Notification skipped.`);
      return;
    }

    const messages: ExpoPushMessage[] = [];
    for (const pushToken of userTokens) {
      if (!Expo.isExpoPushToken(pushToken.expoPushToken)) {
        console.warn(`Push token ${pushToken.expoPushToken} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: pushToken.expoPushToken,
        sound: 'default',
        title,
        body,
        data: data || {},
      });
    }

    if (messages.length === 0) return;

    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log('📱 Push notification sent ticket chunk:', ticketChunk);
      } catch (error) {
        console.error('Error sending push notification chunk:', error);
      }
    }
  } catch (error) {
    console.error('sendPushNotificationToUser error:', error);
  }
};

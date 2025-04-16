import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Todo } from '@/types';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permissions
export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') {
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

// Schedule a notification for a todo
export async function scheduleTodoNotification(todo: Todo) {
  if (Platform.OS === 'web' || !todo.dueDate) {
    return null;
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return null;
  }

  // Calculate notification time (30 minutes before due date)
  const dueDate = new Date(todo.dueDate);
  const notificationDate = new Date(dueDate.getTime() - 30 * 60 * 1000);

  // Don't schedule if the notification time is in the past
  if (notificationDate.getTime() <= Date.now()) {
    return null;
  }

  // Schedule the notification
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Task Reminder',
      body: `Your task "${todo.title}" is due soon`,
      data: { todoId: todo.id },
    },
    trigger: notificationDate,
  });

  return notificationId;
}

// Cancel a notification
export async function cancelNotification(notificationId: string) {
  if (Platform.OS === 'web') {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

// Send an immediate notification
export async function sendImmediateNotification(
  title: string,
  body: string,
  data = {}
) {
  if (Platform.OS === 'web') {
    return null;
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return null;
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // Send immediately
  });

  return notificationId;
}

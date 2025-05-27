/**
 * Browser notification utility functions
 * Uses the Notification API with setTimeout for delayed notifications
 */

export interface NotificationOptions {
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
}

/**
 * Request notification permission from the user
 * @returns Promise<NotificationPermission>
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  // Request permission
  const permission = await Notification.requestPermission();
  return permission;
};

/**
 * Show an immediate notification
 * @param title - Notification title
 * @param body - Notification body text
 * @param options - Additional notification options
 * @returns Promise<Notification | null>
 */
export const showNotification = async (
  title: string,
  body: string,
  options: NotificationOptions = {}
): Promise<Notification | null> => {
  // Check if notifications are supported
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return null;
  }

  // Request permission if needed
  const permission = await requestNotificationPermission();

  if (permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  try {
    const notificationOptions: any = {
      body,
      icon: options.icon || '/favicon.ico',
      badge: options.badge,
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
      silent: options.silent || false,
    };

    if (options.vibrate) {
      notificationOptions.vibrate = options.vibrate;
    }

    const notification = new Notification(title, notificationOptions);

    // Auto-close notification after 5 seconds if not requiring interaction
    if (!options.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    return notification;
  } catch (error) {
    console.error('Failed to show notification:', error);
    return null;
  }
};

/**
 * Schedule a notification to be shown after a delay
 * @param title - Notification title
 * @param body - Notification body text
 * @param delayMs - Delay in milliseconds before showing the notification
 * @param options - Additional notification options
 * @returns Timer ID that can be used to cancel the notification
 */
export const scheduleNotification = (
  title: string,
  body: string,
  delayMs: number,
  options: NotificationOptions = {}
): number => {
  const timerId = window.setTimeout(async () => {
    await showNotification(title, body, options);
  }, delayMs);

  return timerId;
};

/**
 * Cancel a scheduled notification
 * @param timerId - Timer ID returned by scheduleNotification
 */
export const cancelScheduledNotification = (timerId: number): void => {
  clearTimeout(timerId);
};

/**
 * Check if notifications are supported and permission status
 * @returns Object with support and permission status
 */
export const getNotificationStatus = () => {
  const isSupported = 'Notification' in window;
  const permission = isSupported ? Notification.permission : 'denied';

  return {
    isSupported,
    permission,
    canNotify: isSupported && permission === 'granted'
  };
};

/**
 * Utility function to schedule multiple notifications
 * @param notifications - Array of notification configs
 * @returns Array of timer IDs
 */
export const scheduleMultipleNotifications = (
  notifications: Array<{
    title: string;
    body: string;
    delayMs: number;
    options?: NotificationOptions;
  }>
): number[] => {
  return notifications.map(({ title, body, delayMs, options }) =>
    scheduleNotification(title, body, delayMs, options)
  );
};

/**
 * Cancel multiple scheduled notifications
 * @param timerIds - Array of timer IDs to cancel
 */
export const cancelMultipleNotifications = (timerIds: number[]): void => {
  timerIds.forEach(cancelScheduledNotification);
};

// Predefined notification templates for common use cases
export const NotificationTemplates = {
  reminder: (task: string, delayMs: number) =>
    scheduleNotification(
      'タスクリマインダー',
      `「${task}」の時間です`,
      delayMs,
      { requireInteraction: true, tag: 'task-reminder' }
    ),

  break: (delayMs: number) =>
    scheduleNotification(
      '休憩時間',
      '少し休憩を取りましょう',
      delayMs,
      { tag: 'break-reminder' }
    ),

  sessionComplete: (sessionName: string) =>
    showNotification(
      'セッション完了',
      `${sessionName}が完了しました！`,
      { tag: 'session-complete' }
    ),

  weeklyReview: () =>
    showNotification(
      '週次レビュー',
      '今週の振り返りを記録しましょう',
      { requireInteraction: true, tag: 'weekly-review' }
    )
};
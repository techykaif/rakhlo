declare module "web-push" {
  type PushSubscription = {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };

  type SendNotificationOptions = {
    TTL?: number;
  };

  interface WebPush {
    setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
    sendNotification(
      subscription: PushSubscription,
      payload?: string,
      options?: SendNotificationOptions,
    ): Promise<unknown>;
  }

  const webpush: WebPush;
  export default webpush;
}

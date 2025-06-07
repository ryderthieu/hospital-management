import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(
            /\\n/g,
            '\n',
          ),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    }
  }

  async sendToDevices(tokens: string[], title: string, body: string) {
    const message: admin.messaging.MulticastMessage = {
      notification: {
        title,
        body,
      },
      tokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      return response;
    } catch (error) {
      console.error('Firebase send error:', error);
      throw error;
    }
  }
}

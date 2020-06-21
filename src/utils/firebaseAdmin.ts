import * as admin from 'firebase-admin';

/* ANCHOR: firebaseAdmin instance ------------------------------------------- */
const firebaseAdminDevelopment = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
  databaseURL: process.env.FIREBASE_DB_URL,
};

export const firebaseAdmin: admin.app.App = admin.initializeApp(firebaseAdminDevelopment);

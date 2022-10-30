import admin from "firebase-admin";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
// const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length)
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT ?? "")),
  });

export default getFirestore();

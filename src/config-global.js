

// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// routes
import { PATH_DASHBOARD } from './routes/paths'; // ----------------------------------------------------------------------

export const HOST_API_KEY = process.env.REACT_APP_HOST_API_KEY || '';

const FIREBASE_API = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCGJsg7n2ud7I81HEQY6IdMWrcXVJo_O8A",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "journalindexing-38ac8.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "journalindexing-38ac8",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "journalindexing-38ac8.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "917125302826",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:917125302826:web:f4be1e592e63e8bb6a5153",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-4HCKT5P80C"
};

const app = initializeApp(FIREBASE_API);
console.log('Firebase Configuration:', FIREBASE_API);

// Initialize Firestore
const firestore = getFirestore(app);
// Initialize Firebase Storage
const storage = getStorage(app);
export default firestore; // Set firestore as the default export
export { FIREBASE_API, storage };

export const COGNITO_API = {
  userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  clientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
};

export const AUTH0_API = {
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
};

export const MAP_API = 'pk.eyJ1IjoiYWFkaTc2MiIsImEiOiJjbHoybWppeWYweXd3MnNwZnBkaG1laHpyIn0.Ks_TkDRuGfeVqNLk-kx7yQ';

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.general.booking; // as '/dashboard/app'

// LAYOUT
// ----------------------------------------------------------------------

// export const HEADER = {
//   H_MOBILE: 64,
//   H_MAIN_DESKTOP: 88,
//   H_DASHBOARD_DESKTOP: 92,
//   H_DASHBOARD_DESKTOP_OFFSET: 92 - 32,
// };
// Adjusted HEADER configuration
export const HEADER = {
  H_MOBILE: 56, // Adjust mobile header height
  H_MAIN_DESKTOP: 72, // Adjust main desktop header height
  H_DASHBOARD_DESKTOP: 80, // Adjust dashboard desktop header height
  H_DASHBOARD_DESKTOP_OFFSET: 80 - 32, // Adjust offset if necessary
};

export const NAV = {
  W_BASE: 260,
  W_DASHBOARD: 280,
  W_DASHBOARD_MINI: 88,
  //
  H_DASHBOARD_ITEM: 48,
  H_DASHBOARD_ITEM_SUB: 36,
  //
  H_DASHBOARD_ITEM_HORIZONTAL: 32,
};

export const ICON = {
  NAV_ITEM: 24,
  NAV_ITEM_HORIZONTAL: 22,
  NAV_ITEM_MINI: 22,
};
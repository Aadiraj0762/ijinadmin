// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAkGSDoWw_9nqnaD3b78j-Nwx0VCxz3dQY',
  authDomain: 'INTERNATIONAL JOURNAL INDEXINGs-51250.firebaseapp.com',
  projectId: 'INTERNATIONAL JOURNAL INDEXINGs-51250',
  storageBucket: 'INTERNATIONAL JOURNAL INDEXINGs-51250.appspot.com',
  messagingSenderId: '920411121805',
  appId: '1:920411121805:web:774a4190e7b0a5f4449ac4',
  measurementId: 'G-XPBRJFMKC1'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
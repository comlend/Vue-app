importScripts('./build/sw-toolbox.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');


var config = {
   apiKey: "AIzaSyCBSL955KUTWPvkJYNE-WzzFrN0UjidXMk",
   authDomain: "aptapp-3b622.firebaseapp.com",
   databaseURL: "https://aptapp-3b622.firebaseio.com",
   projectId: "aptapp-3b622",
   storageBucket: "aptapp-3b622.appspot.com",
   messagingSenderId: "587368411111"
};
firebase.initializeApp(config);


/* firebase.initializeApp({
   // get this from Firebase console, Cloud messaging section
   messagingSenderId: "587368411111"
}); */

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
   console.log('[firebase-messaging-sw.js] Received background message ', payload);
   // Customize notification here
   const notificationTitle = 'Background Message Title';
   const notificationOptions = {
      body: 'Background Message body.',
      icon: 'assets/imgs/icon.png'
   };

   return self.registration.showNotification(notificationTitle, notificationOptions);
});
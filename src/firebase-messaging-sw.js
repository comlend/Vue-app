importScripts('./build/sw-toolbox.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');


var config = {
    apiKey: "AIzaSyAG4SM1ihvr7fPqU5C6mG2B2TZyVZImDkU",
    authDomain: "vue-admin-85ef1.firebaseapp.com",
    databaseURL: "https://vue-admin-85ef1.firebaseio.com",
    projectId: "vue-admin-85ef1",
    storageBucket: "vue-admin-85ef1.appspot.com",
    messagingSenderId: "167187753572"
};
firebase.initializeApp(config);


/* firebase.initializeApp({
   // get this from Firebase console, Cloud messaging section
   messagingSenderId: "587368411111"
}); */

const messaging = firebase.messaging();
messaging.onMessage((data) => {
    console.log('data from push notifiction', data);
});

messaging.setBackgroundMessageHandler((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    console.log('data from payload', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: 'assets/imgs/icon.png'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
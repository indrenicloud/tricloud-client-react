import * as firebase from "firebase/app";
import "firebase/messaging";

const initializedFirebaseApp = firebase.initializeApp({
	// Project Settings => Add Firebase to your web app
  messagingSenderId: "377332520632"
});

const messaging = initializedFirebaseApp.messaging();

messaging.usePublicVapidKey(
	// Project Settings => Cloud Messaging => Web Push certificates
"BIsddUwxH85WxWG-N7dOAN-ZS1pGeou0J-TL8Ram0fYk6Qxj1qup1tmZND_4eDTcpdbtmNKPGP1WpPAyZdM4dcg"
  );

export { messaging };
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");


let config = {  
        messagingSenderId: "377332520632"
}
firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
   const title = payload.notification.title;
   console.log('payload', payload.notification.icon);
   const options = {
      body: payload.notification.body,
      icon: payload.notification.icon
   }
   console.log("title", title);
   console.log("options" , options);
   return self.registration.showNotification(title, options);
})
self.addEventListener("notificationclick", function(event) {
   const clickedNotification = event.notification;
   clickedNotification.close();
   const promiseChain = clients
       .matchAll({
           type: "window",
           includeUncontrolled: true
        })
       .then(windowClients => {
           let matchingClient = null;
           for (let i = 0; i < windowClients.length; i++) {
               const windowClient = windowClients[i];
               if (windowClient.url === feClickAction) {
                   matchingClient = windowClient;
                   break;
               }
           }
           if (matchingClient) {
               return matchingClient.focus();
           } else {
               return clients.openWindow(feClickAction);
           }
       });
       event.waitUntil(promiseChain);
});


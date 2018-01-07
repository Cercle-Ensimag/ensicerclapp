const functions = require('firebase-functions');

const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
var serviceAccount = require("./ensicerclapp-firebase-adminsdk-87izp-f7073412f3.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ensicerclapp.firebaseio.com"
});

const db = admin.database();

/**
 * On vote asserted, move a named enveloppe from "buffer" to an anonimous bollot
 * in "bollot_box"
 */
exports.onVote = functions.database.ref('/vote/users/{pollId}/{emailId}/voted')
    .onWrite(event => {
      if (!event.data.exists()) {
        return null;
      }
      const voted = event.data.val();
      const pollId = event.params.pollId;
      const emailId = event.params.emailId;

      if (voted == true && event.data.changed()) {
        return db.ref("/vote/results/"+pollId+"/buffer/"+emailId)
        .once("value").then(function(snapshot) {
          if (snapshot.exists()) {
            return db.ref("/vote/results/"+pollId+"/ballot_box/"+snapshot.val()).push(true)
            .then(function() {
              return db.ref("vote/results/"+pollId+"/buffer/"+emailId).remove();
            });
          } else {
            return db.ref('/physical-vote').push().set('User '+emailId+' did not vote online');
          }
        });
      } else {
        return db.ref('/errors/vote').push().set('Error on user '+emailId);
      }
    });

/**
 * Save the original user email for later verifications,
 * to make sure a user has on 1 account, based on "@ensimag.fr" account unicity
 */
exports.onCreateAccount = functions.auth.user().onCreate(event => {
  const user = event.data;
  const emailId = user.email.replace('@ensimag.fr', '').replace('.', '|');

  var refs = {uid: user.uid};
  refs[user.uid+"/admin/email"] = user.email;

  return db.ref("/users/"+emailId).once("value").then(function(snapshot) {
    if (snapshot.exists() && snapshot.child('uid') !== user.uid){
      return db.ref("/errors/account").push().set('User '+emailId+' created a new account')
      .then(() => {
        return db.ref("/users/"+emailId).update(refs);
      });
    } else {
      return db.ref("/users/"+emailId).update(refs);
    }
  });
});

/**
 * Remove user in the database on deleted account
 */
exports.onDeleteAccount = functions.auth.user().onDelete(event => {
  const user = event.data;
  const emailId = user.email.replace('@ensimag.fr', '').replace('.', '|');
  return db.ref("/users/"+emailId+"/"+user.uid).remove();
});

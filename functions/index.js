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

// List of authorised email IDs
const usersEmailIds = require("./users_emails.json");

/**
 * Local function that generates an ID from the email
 */
function getEmailId(email) {
  return email.replace('@ensimag.fr', '').replace('.', '|');
}

/**
 * Local function that verifies that the email used is correct
 */
function verifyEmail(email) {
  return email.includes('@ensimag.fr') && usersEmailIds[getEmailId(email)];
}

/**
 * On vote asserted, move a named enveloppe from "buffer" to an anonimous ballot
 * in "ballot_box"
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
        return db.ref('/logs/vote/'+pollId+"/physical-vote").push().set('Paper ballot for user '+emailId);
      }
    });
  } else {
    return db.ref('/errors/vote/'+pollId).push().set('Error on user '+emailId);
  }
});

/**
 * Verifies that the user is authorised to create a new account,
 * if not, removes it
 */
exports.onCreateAccount = functions.auth.user().onCreate(event => {
  const user = event.data;
  const emailId = getEmailId(user.email);

  var refs = {uid: user.uid};
  refs[user.uid+"/admin/email"] = user.email;

  if (!verifyEmail(user.email)) {
    return admin.auth().deleteUser(user.uid).then(() => {
      return db.ref("/errors/account").push().set(user.email+' pushed back');
    });
  } else {
    return db.ref("/users/"+emailId).once("value").then(function(snapshot) {
        if (snapshot.child('uid').exists() &&
        snapshot.child('uid').val() != null &&
        snapshot.child('uid').val() != user.uid
      ){
        return db.ref("/errors/account").push().set('User '+emailId+' created a new account')
        .then(() => {
          return db.ref("/users/"+emailId).update(refs);
        });
      } else {
        return db.ref("/logs/account").push().set('User '+emailId+' created a first account')
        .then(() => {
          return db.ref("/users/"+emailId).update(refs);
        });
      }
    });
  }
});

/**
 * Remove user in the database on deleted account
 */
exports.onDeleteAccount = functions.auth.user().onDelete(event => {
  const user = event.data;
  const emailId = getEmailId(user.email);
  return db.ref("/logs/account").push().set('User '+emailId+' deleted his account')
  .then(() => {
    return db.ref("/users/"+emailId+"/"+user.uid).remove();
  });
});

/**
 * Load or update the list of authorised users
 */
exports.updateList = functions.database.ref('/list/update')
.onWrite(event => {
  return db.ref("/list/users").set(usersEmailIds);
});

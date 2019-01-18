const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
const serviceAccount = require("./ensicerclapp-admin-sdk-credential.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ensicerclapp.firebaseio.com"
});

const db = admin.database();

const usersEmailIds = require("./users_emails.json");
const usersEmailExteIds = require("./users_emails_exte.json");

/**
 * Local function that generates an ID from the email
 */
function getEmailId(email) {
  return email.split("@")[0].replace('.', '|');
}

/**
 * Local function that verifies that the email used is correct
 */
function verifyEmail(email) {
  return usersEmailIds[getEmailId(email)] === email || usersEmailExteIds[getEmailId(email)] === email;
}

/**
 * Local function that return the current date
 */
function getTime() {
  return (new Date()).getTime();
}

/**
 * On vote asserted, move a named enveloppe from "buffer" to an anonimous ballot
 * in "ballot_box"
 */
exports.onVote = functions.database.ref(
	'/vote/votes/{pollId}/{emailId}/voted'
).onWrite((data, context) => {
  if (!data.after.exists()) {
    return null;
  }
  const voted = data.after.val();
  const pollId = context.params.pollId;
  const emailId = context.params.emailId;

  if (voted == true && data.before.val() != data.after.val()) {
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
    return db.ref('/logs/errors/vote/'+pollId).push().set('Error on user '+emailId);
  }
});

/**
 * Deletes a user with admin rights given its uid
 * Function onDeleteAccount will be trigger on calling this one
 */
function deleteUser(uid, reason) {
	return admin.auth().deleteUser(uid).then(() => {

		// /!\ Any information deleted here must refer to user.uid /!\
		// because this function is called when deleting unauthorised users
		// that could have the same emailId as authorised user

		// delete user profile because he was authorised to edit it
		updates["users/" +emailId + "/" + uid] = null;

		// log
		updates["logs/errors/account/" + getTime()] = user.email + ' pushed back: ' + reason;

		// db request
		return db.ref("/").update(updates);
	});
}

/**
 * Verifies that the user is authorised to create a new account,
 * if not, removes it
 */
exports.onCreateAccount = functions.auth.user().onCreate((user, context) => {
  const emailId = getEmailId(user.email);
  const updates = {};

  if (!verifyEmail(user.email)) {
    // invalid email, delete account
    return deleteUser(user.uid, "not on the list");
  } else {
    // valid email
    return db.ref("/users/"+emailId).once("value").then(function(snapshot) {

      // /!\ Only one user per emailId is authorised to have an account /!\
      // This relies on the unicity of nodes in JSON when verifying the email
      // Referencing the uid of the authorised user allows to access its profile

      // Sets the uid of the authorised user
      updates["users/"+emailId+"/uid"] = user.uid;

      // Stores the email where the user can't write, just in case
      updates["users/"+emailId+"/"+user.uid+"/admin/email"] = user.email;

      // log
      if (snapshot.child('uid').exists() &&
        snapshot.child('uid').val() != null &&
        snapshot.child('uid').val() != user.uid
      ){
        updates["logs/account/info/"+getTime()] = 'User '+emailId+' created a new account';
      } else {
        updates["logs/account/"+getTime()] = 'User '+emailId+' created a first account';
      }

      // db request
      return db.ref("/").update(updates);
    });
  }
});

/**
 * Remove user in the database on deleted account
 */
exports.onDeleteAccount = functions.auth.user().onDelete((user, context) => {
  const emailId = getEmailId(user.email);
  const updates = {};

  // /!\ Any information deleted here must refer to user.uid /!\
  // because this function is called when deleting unauthorised users
  // that could have the same emailId as authorised user

  // delete user profile
  updates["users/"+emailId+"/"+user.uid] = null;

  // delete calendar data
  updates["calendar/users/"+user.uid] = null;

  // log
  updates["logs/account/delete/"+getTime()] = emailId+"'s account has been deleted";

  // db request
  return db.ref("/").update(updates);
});

/**
 * Load or update the list of authorised users
 */
exports.updateList = functions.database.ref('/list/update').onWrite(() => {
  return db.ref("/list/users").set(Object.assign({}, usersEmailIds, usersEmailExteIds));
});

/**
 * Lists the users which did'nt verified their emails
 */
exports.getVerifiedEmails = functions.database.ref('/list/getVerifiedEmails').onWrite(() => {
	return admin.auth().listUsers().then(res => {
		res.users.forEach((user) => {
			if (!user.emailVerified) {
				console.log("not verified email: " + user.email);
			}
		})
	})
});

/**
 * Deletes the users which did'nt verified their emails
 */
exports.deleteNotVerifiedEmails = functions.database.ref('/list/deleteNotVerifiedEmails').onWrite(() => {
	return admin.auth().listUsers().then(res => {
		res.users.forEach((user) => {
			if (!user.emailVerified) {
				deleteUser(user.uid, "email not verified");
			}
		})
	})
});

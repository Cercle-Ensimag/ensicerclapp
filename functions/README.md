# Firebase functions

## Credentials for admin SDK

The private key for the admin SDK must be added to this directory, before deploying firebase functions, under the name `ensicerclapp-admin-sdk-credential.json`.

To download this file, go to the parameters of the firebase project and select the tab dedicated to services.

## Users lists

The users lists control the users able to create an account and vote mainly.
These lists must be updated regularly (at least each year).

Two files are loaded when the functions are deployed : `users_emails.json` and `users_emails_exte.json`.
No difference is made between the users in these files yet.

The format of these files is the following :
`{
  "[id1]": "[email1]",
  "[id2]": "[email2]"
}`

See function `getEmailId` in `index.js` to know how ids are generated from emails. /!\ This function is also defined in the front end and must have the same output.

To actually update the list in the database, a callback function must be triggered by writing the number of the update in the database at `/list/update`. The can be done manually from the firebase console.

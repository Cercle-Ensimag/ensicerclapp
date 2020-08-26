> ***
> **This projet has been moved to https://gitlab.com/cercle-ensimag/ensicerclapp/ and is no longer maintained here**
>
> If your already cloned the project, you can update the remote origin with
> ```
> git remote set-url origin git@gitlab.com:cercle-ensimag/ensicerclapp.git
> ```
> ***

# Ensicerclapp

## Angular project

The front end of this project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.3.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Firebase project

The database and the server side operations are using firebase.
The files in the `src/environments/` directory contain firebase configurations.
The file `firebase.json` configures the following commands.

### Database

The `database/` directory contains source code for generating the rules of the firebase database.
Run `firebase deploy --only database` to update the rules of the database.

### Functions

The `functions/` directory contains source code for firebase functions called on database or auth events.
Run `firebase deploy --only functions` to update the functions

### Hosting

Run `ng build --prod` to compile the angular project, then deploy it with `firebase deploy --only hosting`

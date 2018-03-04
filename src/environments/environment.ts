// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCiMXiQ2w5b7YWmW20j38PC2mrORsNVHMk",
    authDomain: "ensicerclapp.firebaseapp.com",
    databaseURL: "https://ensicerclapp.firebaseio.com",
    projectId: "ensicerclapp",
    storageBucket: "ensicerclapp.appspot.com",
    messagingSenderId: "5656243105"
  },
  proxy: {
    domain: "https://evoliofly.com:8082/proxy.php?"
    // domain: "http://localhost:8080/proxy.php?"
  }
};

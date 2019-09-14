// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	hmr: false,
	firebase: {
	    apiKey: "AIzaSyC5HqCCmTSA5MYe7NAirTfS3Y6t0Arbyug",
	    authDomain: "ensicerclapp-dev.firebaseapp.com",
	    databaseURL: "https://ensicerclapp-dev.firebaseio.com",
	    projectId: "ensicerclapp-dev",
	    storageBucket: "ensicerclapp-dev.appspot.com",
	    messagingSenderId: "944769944930",
	},
	proxy: {
		domain: "http://localhost:8080/proxy.php?"
	},
	host: {
		domain: "http://localhost:4200/"
	}
};

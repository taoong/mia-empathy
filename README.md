# Minneapolis Institude of Art (Mia) Empathy Tool

This tool is built for Mia to use to measure empathy in participants. It involves a quiz interface which will record quiz data from its users, and an admin interface where administrators of the tool can manage and view sessions, quizzes, and participant data.

## Technologies

- Javascript ES6 (React)
- Firebase (Cloud Firestore)

## Front-end File Structure

- `src/`: The React front-end.
- `src/assets/`: Images, sound files, and other resources.
- `src/components/`: React components, separated into `app` and `admin` folders for the user-facing quiz and the admin panel respectively.
- `src/stimuli/`: Resources used for quizzes.

## Config files

- `firebase.json`: Contains configurations for Firebase.
- `database.rules.json`: Contains Firebase database read/write access rules.
- `yarn.lock`: Contains dependency management configurations for Yarn.

## Hosting your own database (via Firebase)

### Setup your own Firebase App and Database

While this quiz was originally created for use by Mia, you can easily connect the app to your own Firebase database.

1. Create a new [Firebase project](https://firebase.google.com) (or use an existing one).
2. Go to the project from the [Firebase Console](https://console.firebase.google.com) (if you just created a new one, you should already be here).
3. Under **Get started by adding Firebase to your app**, select the **Web** option.
4. Choose an app nickname, and leave the option for Firebase Hosting unchecked (you can always add this later).
5. Under the **Add Firebase SDK** step, copy the contents of the firebaseConfig variable in the code snippet, and replace the config object in `src/Firebase.js` with this code. You can also find this SDK code snippet later in the project settings screen.

### After creating your new Firebase project, setup your Database and Authentication:

#### Firebase Authentication Setup:

From the [Firebase Console](https://console.firebase.google.com)

1. Click **Authentication**
2. Click **Set up sign-in method**
3. Under **Sign-in Providers** click **Email/Password**, then click the "Enable" slider, then click **Save**.
4. Under **Sign-in Providers** click **Google**, then click the "Enable" slider. Set the Project support email to your email address, then click **Save**.

#### Firebase Database Setup:

This provisions your new Firestore database in a Test Mode.
From the [Firebase Console](https://console.firebase.google.com)

1. Click **Authentication**.
2. Click **Create Database**.
3. Choose **"Start in test mode"**, click **Next**.
4. Select a Cloud Firestore Location, click **Done**.
5. Now select, **Start collection**.
6. **Collection ID** type "admins", click **Next**.
7. **DocumentID**, leave as _Auto-id_.
8. For **Field**, type the value "email", **Type** _string_, for **Value** type in the email you used for Authentication. Click **Save**.

After [building the project](#building-project) locally, you can then [access the admin panel](#accessing-the-admin-panel) and start writing data to your database by adding your own sessions and quizzes. You can view this data both in the app and in your Firebase console in the Cloud Firestore database.

## Building Project

Tested with npm version 6.9.0 and node v10.16.3.

In the project directory, you can run:

### `npm install`

Installs all dependencies for the app. You need to run this before you can run `npm start`.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

If you connected this app to your own Firebase project and have the [Firebase CLI](https://firebase.google.com/docs/cli) installed, you can make use of Firebase hosting by running `firebase deploy`.

## Building and running the App via Docker

> [Docker](https://www.docker.com/products/docker-desktop) is a tool designed to make it easier to create, deploy, and run applications by using containers. Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and ship it all out as one package.

We have also included a sample Docker setup to enable you to run a local copy of the Empathy tool on any computer running Docker Desktop.

This will still require you follow the steps for setting up a Firebase App and Database. ([See above](#hosting-your-own-database-via-firebase))

The following files and configuration can be used to get you started, they should not require editing on your part.

- `Dockerfile`: File configures a preferred Node version and runs the necessary build commands as above.
- `docker-compose.yml`: Uses the docker-compose utility to handle running the Docker container and code for the Empathy tool.

### docker-compose up

#### You need to have added your Firebase SDK Snippet to /src/Firebase.js before running this the first time.

This command will download all the necessary components (e.g. Node and required modules) and build the container for a local instance; as well start the Empathy tool for you, which if completed can be accessed [On your local machine.](http://localhost:3000)

### docker-compose down

Will stop the Docker container from running.

### docker-compose build

Will re-build the image if you've edited any of the configuration files or code in the app.

## Administration of the App

The admin-side of this app enables creating and managing sessions and quizzes for the app. To access it, go to the `/admin` route (e.g. https://mia-empathy.firebaseapp.com/admin) and sign in via the Firebase auth interface using the same email you added to the Firestore database.

### See the [User Guide](https://www.notion.so/calblueprint/User-Guide-Documentation-e4d56a8a570f48ddb3184b0cad527357) for an interface walkthrough.

## Exporting the Firestore database

While Firebase's Realtime Database supports data import/export, Firestore does not. Instead, `exportFirestoreDB.js` includes a script that will do this in CSV format.

To generate an exported copy of the Firestore database:

1. Go to the [Firebase Console](https://console.firebase.google.com). Make sure you have [set up your own Firebase Project](#setup-your-own-firebase-app-and-database), or if you are a part of MIA, have an account with project access.
2. Find the settings icon in the top left and navigate to **Users and permissions**.
3. Click the **Service accounts** tab.
4. Click **Generate new private key**.
5. Clone the repository.
6. Place the generated private key into the repository's `src/` subdirectory.
7. Rename the private key to `serviceAccountKey.json`.
8. Open up a terminal window and navigate to the project folder (the main one, not `src/`).
9. Run `node exportFirestoreDB.js` (make sure you have [node](https://nodejs.org/en/download/) installed, and that you have run `npm install` beforehand).
10. You should now see three CSV output files in the project folder, separated into `sessions.csv`, `quizzes.csv`, and `responses.csv`.

## License

The Empathy Tool is licensed under the Creative Commons Attribution license.

## Credits

<p float="left">
  <img src="https://github.com/taoong/mia-empathy/blob/master/src/assets/images/mellon-logo.jpg" width="240" />
  <img src="https://github.com/taoong/mia-empathy/blob/master/src/assets/images/mia-logo.jpg" width="240" />
</p>

Major support provided by the Andrew W. Mellon Foundation. Generous support provided by Nivin MacMillan, Kaywin Feldman and Jim Lutz, Hubert Joly, John and Nancy Lindahl, Marianne Short and Raymond Skowyra, Jr., Richard and Jennie Carlson, Ken and Linda Cutler, Alfred and Ingrid Lenz Harrison, Leni and David Moore, Jr., Sheila Morgan, John and Carol Prince, Joan and John Rex, and donors to the 2018 Mia Gala.

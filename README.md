

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

`firebase.json`: Contains configurations for Firebase.
`database.rules.json`: Contains Firebase database read/write access rules. 
`yarn.lock`: Contains dependency management configurations for Yarn.


## Adding and managing administrators

The admin-side of this app enables creating and managing sessions and quizzes for the app.

To add an admin: 
1. In the Firebase console (https://console.firebase.google.com) navigate to the Authentication tab.
2. Click **Add user** and key in the sign in details for the new user. Here you can also manage or delete existing users.
3. Go to https://mia-empathy.firebaseapp.com/admin and sign in via the Firebase auth interface to access the admin panel.


## Connecting the app to your own database

While this quiz was originally created for use by MIA, you can easily connect the app to your own Firebase database.

Steps:
1. Create a new Firebase project (or use an existing one) at https://firebase.google.com.
2. Go to the Firebase console and select this project.
3. At the project overview page, select **Add Firebase to your web app**.
4. Copy the config variable shown in the code snippet.
5. Replace the config object in `src/Firebase.js` with the copied code.

After building the project locally, you can then access the admin panel and start writing data to your database by adding  your own sessions and quizzes. You can view this data both in the app and in your Firebase console in the Cloud Firestore database.


## Building Project

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

If you connected this app to your own Firebase project and have the Firebase CLI installed, you can make use of Firebase hosting by running `firebase deploy`.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

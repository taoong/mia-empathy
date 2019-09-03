

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


## Connecting the app to your own database

While this quiz was originally created for use by MIA, you can easily connect the app to your own Firebase database.

Steps:
1. Create a new [Firebase project](https://firebase.google.com) (or use an existing one).
2. Go to the project console (if you just created a new one, you should already be here).
3. Under **Get started by adding Firebase to your app**, select the **Web** option.
4. Choose an app nickname, and leave the option for Firebase Hosting unchecked (you can always add this later).
5. Under the **Add Firebase SDK** step, copy the contents of the firebaseConfig variable in the code snippet, and replace the config object in `src/Firebase.js` with this code. You can also find this SDK code snippet later in the project settings screen.

After [building the project](#building-project) locally, you can then [access the admin panel](#accessing-the-admin-panel) and start writing data to your database by adding  your own sessions and quizzes. You can view this data both in the app and in your Firebase console in the Cloud Firestore database.


## Building Project

In the project directory, you can run:

### `npm install`

Installs all dependencies for the app. You need to run this before you can run `npm start`.

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

If you connected this app to your own Firebase project and have the [Firebase CLI](https://firebase.google.com/docs/cli) installed, you can make use of Firebase hosting by running `firebase deploy`.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


## Accessing the admin panel

The admin-side of this app enables creating and managing sessions and quizzes for the app. See the [User Guide](https://www.notion.so/calblueprint/User-Guide-Documentation-e4d56a8a570f48ddb3184b0cad527357) for an interface walkthrough.

To add an admin: 
1. In the [Firebase console](https://console.firebase.google.com) navigate to the Authentication tab and click **Set up sign-in method**.
2. Enable **Email/Password** and **Google** as Sign-in providers.
3. Navigate to the Database tab, and set up a **Firestore** database in **test mode**.
4. Start a collection, and for **Collection ID** input `admins`, for **Document ID** generate an Auto-ID, for **Field** input `email`, for **Type** leave it as `string`, and for **Value** input the email that you will use to sign into the admin panel, then click **Save**. 
5. Go to the `/admin` route (e.g. https://mia-empathy.firebaseapp.com/admin) and sign in via the Firebase auth interface using the same email you added to the Firestore database.


## License

The Empathy Tool is licensed under the Creative Commons Attribution license.

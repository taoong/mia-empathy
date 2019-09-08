// Imports
const admin = require("firebase-admin");
const fs = require("fs");
const { Parser } = require("json2csv");

// Loading service account key to access Firestore database
var serviceAccount = require("./src/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();

const schema = {
  admins: {},
  quizzes: {},
  responses: {},
  sessions: {}
};

/**
 * Fetches the entire Firestore database located at dbRef.
 * @param {firebase.database.Reference} dbRef - Reference to the Firestore database.
 * @param {Object} aux - The JSON schema.
 * @param {Object} curr - The outputted JSON is dumped here.
 */
const dump = (dbRef, aux, curr) => {
  return Promise.all(
    Object.keys(aux).map(collection => {
      return dbRef
        .collection(collection)
        .get()
        .then(data => {
          let promises = [];
          data.forEach(doc => {
            const data = doc.data();
            if (!curr[collection]) {
              curr[collection] = {
                data: {},
                type: "collection"
              };
              curr[collection].data[doc.id] = {
                data,
                type: "document"
              };
            } else {
              curr[collection].data[doc.id] = data;
            }
            promises.push(
              dump(
                dbRef.collection(collection).doc(doc.id),
                aux[collection],
                curr[collection].data[doc.id]
              )
            );
          });
          return Promise.all(promises);
        });
    })
  ).then(() => {
    return curr;
  });
};

/**
 * Restructures and flattens JSON object by removing unnecessary keys.
 * @param {Object} json - Complex, unflattened JSON Object.
 * @returns {Object} - Cleaned JSON Object.
 */
const cleanData = json => {
  // Flattens collections
  for (var collection in json) {
    if (
      json[collection].hasOwnProperty("data") &&
      typeof json[collection] == "object"
    ) {
      json[collection] = json[collection]["data"];
    }
    // Flattens documents in each collection
    for (var document in json[collection]) {
      if (
        json[collection][document].hasOwnProperty("data") &&
        typeof json[collection] == "object"
      ) {
        json[collection][document] = json[collection][document]["data"];
      }
    }
  }

  // Changing object value structure into arrays
  for (collection in json) {
    var arr = [];
    for (document in json[collection]) {
      json[collection][document]["id"] = document;
      arr.push(json[collection][document]);
    }
    json[collection] = arr;
  }

  // Convert timestamps to datetime strings
  for (collection in json) {
    for (var item in json[collection]) {
      if (json[collection][item].hasOwnProperty("datetime")) {
        json[collection][item]["datetime"] = getDateTime(
          json[collection][item]["datetime"]
        );
      }
    }
  }

  delete json.admins; // No need to export admins collection
  return json;
};

const json2Csv = (json, collection) => {
  var fields = [];
  var unwind = [];
  if (collection === "sessions") {
    fields = ["id", "quiz", "sessionName", "type", "datetime", "participants"];
    unwind = [
      "participants",
      "participants.id",
      "participants.firstname",
      "participants.lastname",
      "participants.gender",
      "participants.race",
      "participants.age",
      "participants.zipcode",
      "participants.email"
    ];
  } else if (collection === "quizzes") {
    fields = ["id", "name", "audienceType", "questions"];
    unwind = [
      "questions",
      "questions.type",
      "questions.question",
      "questions.correctAnswer",
      "questions.answers"
    ];
  } else {
    fields = ["id", "pid", "quiz", "session", "datetime", "pre", "post"];
  }

  const json2csvParser = new Parser({ fields, unwind: unwind });
  const csv = json2csvParser.parse(json);
  return csv;
};

/**
 * Converts a timestamp object into a readable datetime string.
 * @param {Object} timestamp - A Javascript Date object representing a timestamp.
 * @returns {string} A readable datetime string in en-US format (e.g. August 1, 2019, 10:59 AM).
 */
const getDateTime = timestamp => {
  const date = timestamp.toDate();
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// Calling dump with schema and output answer
let aux = { ...schema };
let answer = {};
dump(db, aux, answer)
  .then(answer => {
    cleanData(answer);
    //console.log(answer);

    /** Uncomment the lines below to also allow exporting in JSON format  */
    // fs.writeFile("output.json", JSON.stringify(answer, null, 2), err => {
    //   if (err) throw err;
    //   else console.log("Exported to output.json");
    // });

    let sessions = json2Csv(answer["sessions"], "sessions");
    let quizzes = json2Csv(answer["quizzes"], "quizzes");
    let responses = json2Csv(answer["responses"], "responses");

    fs.writeFile("sessions.csv", sessions, err => {
      if (err) throw err;
      else console.log("Exported to sessions.csv");
    });

    fs.writeFile("quizzes.csv", quizzes, err => {
      if (err) throw err;
      else console.log("Exported to quizzes.csv");
    });

    fs.writeFile("responses.csv", responses, err => {
      if (err) throw err;
      else console.log("Exported to responses.csv");
    });
  })
  .catch(error => {
    console.log(error);
  });

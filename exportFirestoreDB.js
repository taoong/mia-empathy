const admin = require("firebase-admin");

var serviceAccount = require("./src/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const schema = {
  admins: {},
  quizzes: {},
  responses: {},
  sessions: {}
};

var db = admin.firestore();
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
let aux = { ...schema };
let answer = {};
const fs = require("fs");

/**
 * Removes unnecessary "data" and "type" keys inherent in Firestore collections to flatten JSON object.
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
  delete json.admins; // No need to export admins collection
  return json;
};

dump(db, aux, answer)
  .then(answer => {
    cleanData(answer);

    fs.writeFile("output.json", JSON.stringify(answer, null, 2), err => {
      if (err) throw err;
      else console.log("Exported to output.json");
    });
  })
  .catch(error => {
    console.log(error);
  });

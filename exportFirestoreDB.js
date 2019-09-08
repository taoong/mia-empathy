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
 * @param {Object} json - Complex, uncleaned JSON Object.
 * @returns {Object} - Flattened JSON Object.
 */
const flattenData = json => {
  // First round of flattening
  for (var key in json) {
    if (json[key].hasOwnProperty("data") && typeof json[key] == "object") {
      json[key] = json[key]["data"];
    }
  }
  /** Second round of flattening, because Firebase seems to add
   *  "data" and "type" keys for the first document in each collection. */
  for (var key in json) {
    for (var key2 in json[key]) {
      if (
        json[key][key2].hasOwnProperty("data") &&
        typeof json[key] == "object"
      ) {
        json[key][key2] = json[key][key2]["data"];
      }
    }
  }
  return json;
};

dump(db, aux, answer)
  .then(answer => {
    flattenData(answer);

    fs.writeFile("output.json", JSON.stringify(answer, null, 2), err => {
      if (err) throw err;
      else console.log("Exported to output.json");
    });
  })
  .catch(error => {
    console.log(error);
  });

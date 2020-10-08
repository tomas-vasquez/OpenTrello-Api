const combertToArray = (mongoDocumnets) => {
  let myArray = [];
  Object.entries(mongoDocumnets).forEach((document) => {
    myArray.push(document[1]);
  });
  return myArray;
};

const documentsToArray = (documets) => {
  let myArray = documets.map((doc) => {
    doc._doc._id = `${doc._doc._id}`;
    doc._doc.course_author_id = `${doc._doc.course_author_id}`;
    doc._doc.item_author_id = `${doc._doc.item_author_id}`;
    return doc._doc;
  });
  return myArray;
};

module.exports = { combertToArray, documentsToArray };

const { deleteAndRecreateFileDatabase, createTables, populateDatase } = require('./dbUtil.js');

const db = deleteAndRecreateFileDatabase();
createTables(db);
populateDatase(db);
db.close();
console.log('Database reset complete.');
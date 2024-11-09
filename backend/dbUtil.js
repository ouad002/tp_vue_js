const fs = require('fs');
const Database = require('better-sqlite3');

const dbFilePath = './database.sqlite';

function deleteAndRecreateFileDatabase() {
  // Delete the existing database file if it exists
  if (fs.existsSync(dbFilePath)) {
    fs.unlinkSync(dbFilePath);
    console.log('Existing database file deleted.');
  }

  const db = new Database(dbFilePath, { verbose: console.log });
  console.log('New database file created.');
  return db;
}

function createTables(db) { 
  db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT
  )
  `);
  console.log('Notes table created.');
      

  // Create the `tasks` table with foreign key to `notes`
  db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    noteId INTEGER,
    FOREIGN KEY (noteId) REFERENCES notes(id) ON DELETE CASCADE
  )
  `)
  console.log('Tasks table created.');
  
  return db;
} 


function populateDatase(db) {
  // Insert sample data into 'notes' table
  db.exec(`
      INSERT INTO notes (title, status) VALUES 
      ('Note 1', 'urgent'),
      ('Note 2', 'serious'),
      ('Note 3', 'unimportant')
    `);

  // Insert sample data into 'tasks' table
  db.exec(`
      INSERT INTO tasks (content, noteId) VALUES 
      ('Task 1 for Note 1', 1),
      ('Task 2 for Note 1', 1),
      ('Task 1 for Note 2', 2)
    `);
}

function emptyTables(db) {
  db.prepare('DELETE FROM tasks;').run();
  db.prepare('DELETE FROM notes;').run();
}




module.exports = {
  deleteAndRecreateFileDatabase, 
  createTables, 
  populateDatase, 
  dbFilePath,
  emptyTables
};
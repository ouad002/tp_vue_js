const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbFilePath = './database.sqlite';

function resetDatabase() {
  // Delete the existing database file if it exists
  if (fs.existsSync(dbFilePath)) {
    fs.unlinkSync(dbFilePath);
    console.log('Existing database file deleted.');
  }

  // Create a new SQLite database and initialize tables
  const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
      return console.error('Error opening database:', err.message);
    }
    console.log('New database file created.');

    db.serialize(() => {
    // Create the `notes` table
      db.run(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        status TEXT
      )
    `, (err) => {
        if (err) console.error('Error creating notes table:', err.message);
        else console.log('Notes table created.');
      });

      // Create the `tasks` table with foreign key to `notes`
      db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        noteId INTEGER,
        FOREIGN KEY (noteId) REFERENCES notes(id) ON DELETE CASCADE
      )
    `, (err) => {
        if (err) console.error('Error creating tasks table:', err.message);
        else console.log('Tasks table created.');
      });

      // Insert sample data into 'notes' table
      db.run(`
        INSERT INTO notes (title, status) VALUES 
        ('Note 1', 'urgent'),
        ('Note 2', 'serious'),
        ('Note 3', 'unimportant')
      `);

      // Insert sample data into 'tasks' table
      db.run(`
        INSERT INTO tasks (content, noteId) VALUES 
        ('Task 1 for Note 1', 1),
        ('Task 2 for Note 1', 1),
        ('Task 1 for Note 2', 2)
      `);
    });
   

    // Close the database connection
    db.close((err) => {
      if (err) console.error('Error closing database:', err.message);
      else console.log('Database reset complete.');
    });
  });
}


resetDatabase();


module.exports = {resetDatabase};
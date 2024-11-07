const express = require('express');
const { program } = require('commander');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();


/**
 * Prepare command line arguments
 */
program
  .option('-p, --port <PORT>', 'Select port on which the server will be run', 3014);
program.parse();
let port = program.opts().port;

/** Setup Express server */
const app = express();
app.use(cors());

app.use(express.json());

app.get('/version', (req, res) => {
  res.json({version: '0.2'});
});



const db = new sqlite3.Database('./database.sqlite');

// Initialize database with tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      status TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      noteId INTEGER,
      FOREIGN KEY (noteId) REFERENCES notes(id) ON DELETE CASCADE
    )
  `);
});

// Helper function to count tasks for a note
function countTasks(noteId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as nbTasks FROM tasks WHERE noteId = ?', [noteId], (err, row) => {
      if (err) reject(err);
      else resolve(row.nbTasks);
    });
  });
}

// API Endpoints

// Get a single Note
app.get('/notes/:id', async (req, res) => {
  const noteId = req.params.id;
  db.get('SELECT * FROM notes WHERE id = ?', [noteId], async (err, note) => {
    if (err) return res.status(500).send(err.message);
    if (!note) return res.status(404).send('Note not found');
    
    const nbTasks = await countTasks(noteId);
    res.json({ ...note, nbTasks });
  });
});

// Get list of all Notes
app.get('/notes', (req, res) => {
  db.all('SELECT * FROM notes', async (err, notes) => {
    if (err) return res.status(500).send(err.message);
    
    const notesWithTaskCount = await Promise.all(
      notes.map(async (note) => ({
        ...note,
        nbTasks: await countTasks(note.id)
      }))
    );
    res.json(notesWithTaskCount);
  });
});

// Create a note
app.post('/notes', (req, res) => {
  const { title, status } = req.body;
  const VALID_STATUSES = ['urgent', 'serious', 'unimportant'];


  // Check if title is provided
  if (!title) {
    return res.status(400).json({
      error: 'The \'title\' field is required.'
    });
  }

  // Check if status is valid
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status. Allowed values are \'urgent\', \'serious\', or \'unimportant\'.'
    });
  }

  // Proceed with creating the note if validation passes
  db.run('INSERT INTO notes (title, status) VALUES (?, ?)', [title, status], function (err) {
    if (err) return res.status(500).send(err.message);

    res.json({ id: this.lastID, title, status, nbTasks: 0 });
  });
});

// Delete a Note
app.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  db.run('DELETE FROM notes WHERE id = ?', [noteId], function (err) {
    if (err) return res.status(500).send(err.message);
    if (this.changes === 0) return res.status(404).send('Note not found');

    res.sendStatus(200);
  });
});

// List tasks of a note
app.get('/notes/:id/tasks', (req, res) => {
  const noteId = req.params.id;
  db.all('SELECT * FROM tasks WHERE noteId = ?', [noteId], (err, tasks) => {
    if (err) return res.status(500).send(err.message);

    res.json(tasks);
  });
});

// Create a task for a note
app.post('/notes/:id/tasks', (req, res) => {
  const noteId = req.params.id;
  const { content } = req.body;

  db.run('INSERT INTO tasks (content, noteId) VALUES (?, ?)', [content, noteId], function (err) {
    if (err) return res.status(500).send(err.message);

    res.json({ id: this.lastID, content, noteId });
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  db.run('DELETE FROM tasks WHERE id = ?', [taskId], function (err) {
    if (err) return res.status(500).send(err.message);
    if (this.changes === 0) return res.status(404).send('Task not found');

    res.sendStatus(200);
  });
});


if (process.env.NODE_ENV !== 'test') {
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}. You can access the backend at http://localhost:${port}`);
  });
}

module.exports = {app}; 
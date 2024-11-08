const express = require('express');
const { program } = require('commander');
const cors = require('cors');
const { dbFilePath, createTables, populateDatase } = require('./dbUtil');
const Database = require('better-sqlite3');

const env = process.env.NODE_ENV || 'development';


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






// Database connection based on environment
const db = new Database(env === 'production' ? ':memory:' : dbFilePath, {
  verbose: console.log
});
console.log(`Connected to the ${env === 'production' ? 'in-memory' : 'file-based'} SQLite database.`);

createTables(db);

if (env === 'production') {
  /* Populate in memory database */
  populateDatase(db);
}

// Helper function to count tasks for a note
function countTasks(noteId) {
  return db.prepare('SELECT COUNT(*) as nbTasks FROM tasks WHERE noteId = ?').get(noteId).nbTasks;
}



// API Endpoints

// Get a single Note
app.get('/notes/:id', async (req, res) => {
  const noteId = req.params.id;
  try {
    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(noteId);
    if (!note) return res.status(404).send(JSON.stringify({error: 'Note not found'}));

    
    const nbTasks = countTasks(noteId);
    res.json({ ...note, nbTasks });
  } catch (err) {
    return res.status(500).send(JSON.stringify({error: err.message}));
  }
});

// Get list of all Notes
app.get('/notes', (req, res) => {
  try {
    const notes = db.prepare('SELECT * FROM notes').all();

    const notesWithTaskCount = notes.map(note => ({
      ...note,
      nbTasks: countTasks(note.id)
    }));
    res.json(notesWithTaskCount);
  } catch (err) {
    return res.status(500).send(JSON.stringify({error: err.message}));
  }
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
  try {
    const info = db.prepare('INSERT INTO notes (title, status) VALUES (?, ?)').run(title, status);
    res.json({ id: info.lastInsertRowid, title, status, nbTasks: 0 });
  } catch (err) {
    return res.status(500).send(JSON.stringify({error: err.message}));
  }

});

// Delete a Note
app.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  try {
    const info = db.prepare('DELETE FROM notes WHERE id = ?').run(noteId);
    if (info.changes === 0) return res.status(404).send(JSON.stringify({error: 'Note not found'}));
    res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(JSON.stringify({error: err.message}));
  }
});

// List tasks of a note
app.get('/notes/:id/tasks', (req, res) => {
  const noteId = req.params.id;
  try {
    const tasks = db.prepare('SELECT * FROM tasks WHERE noteId = ?').all(noteId);
    res.json(tasks);
  } catch (err) {
    return res.status(500).send(JSON.stringify({error: err.message}));
  }
});

// Create a task for a note
app.post('/notes/:id/tasks', (req, res) => {
  const noteId = req.params.id;
  const { content } = req.body;

  // Check if content is provided
  if (!content) {
    return res.status(400).json({
      error: 'The \'content\' field is required.'
    });
  }

  try {
    const info = db.prepare('INSERT INTO tasks (content, noteId) VALUES (?, ?)').run(content, noteId);
    res.json({ id: info.lastInsertRowid, content, noteId });
  } catch (err) {
    return res.status(500).send(JSON.stringify({error: err.message}));
  }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  try {
    const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
    if (info.changes === 0) return res.status(404).send(JSON.stringify({error: 'Task not found'}));
    res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(JSON.stringify({error: err.message}));
  }
});


if (process.env.NODE_ENV !== 'test') {
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}. You can access the backend at http://localhost:${port}`);
  });
}

module.exports = {app}; 
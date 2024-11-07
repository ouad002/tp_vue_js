const request = require('supertest');
const {app} = require('../index.js'); 
const {resetDatabase} = require ('../resetDatabase.js');

beforeAll(() => {
  // Reset the database before running tests
  resetDatabase();
});


describe('/notes/:id/tasks API Endpoints', () => {
  let noteId;
  let taskId;

  beforeAll(async () => {
    const response = await request(app)
      .post('/notes')
      .send({ title: 'Note for Task Test', status: 'normal' });
    noteId = response.body.id;
  });

  test('Create a new task for a note', async () => {
    const response = await request(app)
      .post(`/notes/${noteId}/tasks`)
      .send({ content: 'My Task Content' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.content).toBe('My Task Content');
    expect(response.body.noteId).toBe(noteId);

    taskId = response.body.id;
  });

  test('List tasks of a note', async () => {
    const response = await request(app).get(`/notes/${noteId}/tasks`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0].content).toBe('My Task Content');
  });
});

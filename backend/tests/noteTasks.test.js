const request = require('supertest');
const {app, db} = require('../index.js'); 
const {emptyTables} = require('../dbUtil.js');

beforeEach(() => {
  /* Empty database before each test */
  emptyTables(db);
});


describe('/notes/:id/tasks API Endpoints', () => {
  let noteId;

  beforeEach(async () => {
    const response = await request(app)
      .post('/notes')
      .send({ title: 'Note for Task Test', status: 'urgent' });
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
  });

  test('List tasks of a note', async () => {
    await request(app).post(`/notes/${noteId}/tasks`).send({ content: 'Content 1' });
    await request(app).post(`/notes/${noteId}/tasks`).send({ content: 'Content 2' });
    await request(app).post(`/notes/${noteId}/tasks`).send({ content: 'Content 3' });

    const response = await request(app).get(`/notes/${noteId}/tasks`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(3);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0].content).toBe('Content 1');
  });
});

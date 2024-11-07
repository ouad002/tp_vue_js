const request = require('supertest');
const {app} = require('../index.js'); 
const {resetDatabase} = require ('../resetDatabase.js');

beforeAll(() => {
  // Reset the database before running tests
  resetDatabase();
});

describe('/notes API Endpoints', () => {
  let noteId;

  test('Create a new note', async () => {
    const response = await request(app)
      .post('/notes')
      .send({ title: 'My Note', status: 'urgent' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('My Note');
    expect(response.body.status).toBe('urgent');
    expect(response.body.nbTasks).toBe(0);

    noteId = response.body.id;
  });

  test('Get a single note', async () => {
    const response = await request(app).get(`/notes/${noteId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(noteId);
    expect(response.body.title).toBe('My Note');
    expect(response.body.status).toBe('urgent');
    expect(response.body.nbTasks).toBe(0);
  });

  test('Get list of notes', async () => {
    const response = await request(app).get('/notes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('Delete a note', async () => {
    const response = await request(app).delete(`/notes/${noteId}`);
    expect(response.status).toBe(200);

    const getResponse = await request(app).get(`/notes/${noteId}`);
    expect(getResponse.status).toBe(404); // Should return 404 as note is deleted
  });
});

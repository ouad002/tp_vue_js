const request = require('supertest');
const {app} = require('../index.js'); 
const {resetDatabase} = require ('../resetDatabase.js');

beforeAll(() => {
  // Reset the database before running tests
  resetDatabase();
});

describe('/tasks/:id API Endpoints', () => {
  let noteId;
  let taskId;

  beforeAll(async () => {
    const noteResponse = await request(app)
      .post('/notes')
      .send({ title: 'Note for Deleting Task', status: 'normal' });
    noteId = noteResponse.body.id;

    const taskResponse = await request(app)
      .post(`/notes/${noteId}/tasks`)
      .send({ content: 'Task to be deleted' });
    taskId = taskResponse.body.id;
  });

  test('Delete a task', async () => {
    const response = await request(app).delete(`/tasks/${taskId}`);
    expect(response.status).toBe(200);

    const getResponse = await request(app).get(`/notes/${noteId}/tasks`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.find(task => task.id === taskId)).toBeUndefined();
  });
});

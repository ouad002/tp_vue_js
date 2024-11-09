const request = require('supertest');
const {app, db} = require('../index.js'); 
const {emptyTables} = require('../dbUtil.js');

beforeEach(() => {
  /* Empty database before each test */
  emptyTables(db);
});

describe('/tasks/:id API Endpoints', () => {
  let noteId;

  beforeEach(async () => {
    const noteResponse = await request(app)
      .post('/notes')
      .send({ title: 'Note for Deleting Task', status: 'urgent' });
    noteId = noteResponse.body.id;
  });

  test('Delete a task', async () => {
    const taskResponse = await request(app)
      .post(`/notes/${noteId}/tasks`)
      .send({ content: 'Task to be deleted' });
    const taskId = taskResponse.body.id;
    const response = await request(app).delete(`/tasks/${taskId}`);
    expect(response.status).toBe(200);

    const getResponse = await request(app).get(`/notes/${noteId}/tasks`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.find(task => task.id === taskId)).toBeUndefined();
  });
});

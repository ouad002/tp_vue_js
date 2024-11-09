const request = require('supertest');
const {app, db} = require('../index.js'); 
const {emptyTables} = require('../dbUtil.js');

beforeEach(() => {
  /* Empty database before each test */
  emptyTables(db);
});


describe('/notes API Endpoints', () => {
  test('Create a new note with valid title and status', async () => {
    const response = await request(app)
      .post('/notes')
      .send({ title: 'My Note', status: 'urgent' });

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(expect.any(Number));
    expect(response.body.title).toBe('My Note');
    expect(response.body.status).toBe('urgent');
    expect(response.body.nbTasks).toBe(0);
  });

  test('Reject creation if title is missing', async () => {
    const response = await request(app)
      .post('/notes')
      .send({ status: 'urgent' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('The \'title\' field is required.');
  });

  test('Reject creation if status is missing', async () => {
    const response = await request(app)
      .post('/notes')
      .send({ title: 'My Note' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid status. Allowed values are \'urgent\', \'serious\', or \'unimportant\'.');
  });

  test('Reject creation if status is invalid', async () => {
    const response = await request(app)
      .post('/notes')
      .send({ title: 'My Note', status: 'invalid-status' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid status. Allowed values are \'urgent\', \'serious\', or \'unimportant\'.');
  });

  test('Get a single note', async () => {
    const note = (await request(app).post('/notes').send({ title: 'My Note', status: 'urgent' })).body;
    await request(app).post(`/notes/${note.id}/tasks`).send({ content: 'Content 1' });
    await request(app).post(`/notes/${note.id}/tasks`).send({ content: 'Content 2' });


    const response = await request(app).get(`/notes/${note.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(expect.any(Number));
    expect(response.body.title).toBe('My Note');
    expect(response.body.status).toBe('urgent');
    expect(response.body.nbTasks).toBe(2);
  });

  test('Get list of notes', async () => {
    await request(app).post('/notes').send({ title: 'My Note1', status: 'urgent' });
    await request(app).post('/notes').send({ title: 'My Note2', status: 'urgent' });
    await request(app).post('/notes').send({ title: 'My Note3', status: 'urgent' });



    const response = await request(app).get('/notes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(3);
    expect(response.body[0].id).toEqual(expect.any(Number));
    expect(response.body[0].title).toEqual(expect.any(String));
    expect(response.body[0].status).toEqual(expect.any(String));
    expect(response.body[0].nbTasks).toEqual(expect.any(Number));
  });

  test('Delete a note', async () => {
    const createdNote = (await request(app).post('/notes').send({ title: 'My Note', status: 'urgent' })).body;  

    const response = await request(app).delete(`/notes/${createdNote.id}`);
    expect(response.status).toBe(200);

    const getResponse = await request(app).get(`/notes/${createdNote.id}`);
    expect(getResponse.status).toBe(404); // Should return 404 as note is deleted
  });
});

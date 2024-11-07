# EMSE Notes App Backend API

This is a RESTful API for managing notes and tasks. Notes can have multiple associated tasks, and each task belongs to a specific note. The API provides endpoints to create, retrieve, update, and delete notes and tasks.

## Table of Contents

- [Getting Started](#getting-started)
- [Endpoints](#endpoints)
  - [Notes](#notes)
    - [Create a Note](#create-a-note)
    - [Get a Note](#get-a-note)
    - [List All Notes](#list-all-notes)
    - [Delete a Note](#delete-a-note)
  - [Tasks](#tasks)
    - [Create a Task for a Note](#create-a-task-for-a-note)
    - [List Tasks of a Note](#list-tasks-of-a-note)
    - [Delete a Task](#delete-a-task)
- [Database](#database)
- [Testing](#testing)

---

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. To initialize the database with fresh tables, run:

    ```bash
    npm run db:reset
    ```

3. Start the server:

    ```bash
    npm start
    ```

The server will start on http://localhost:3000 by default.

---

## Endpoints

### Notes
#### Create a Note

**Endpoint:** `POST /notes`

**Request Body:**

- `title` (string) - **required**: The title of the note.
- `status` (string) - **required**: The status of the note. Allowed values are `"urgent"`, `"serious"`, and `"unimportant"`.

**Example Request:**

```json
{
  "title": "My Note",
  "status": "urgent"
}
```

**Response:**

- `200 OK` on success with the created note object:

    ```json
    {
        "id": 1,
        "title": "My Note",
        "status": "urgent",
        "nbTasks": 0
    }
    ```

- `400 Bad` Request if:
    - title is missing.
    - status is missing or not one of the allowed values.

    **Example Error Response:**

    ```json
    {
    "error": "The 'title' field is required."
    }
    ```

#### Get a Note

**Endpoint:** `GET /notes/:id`

**Response:**

- `200 OK` with the note object:

    ```json
    {
        "id": 1,
        "title": "My Note",
        "status": "urgent",
        "nbTasks": 2
    }
    ```

- `404 Not Found` if the note does not exist.

#### List All Notes

**Endpoint:** `GET /notes`

**Response:**

- `200 OK` with an array of all note objects:

    ```json
    [
        {
        "id": 1,
        "title": "My Note",
        "status": "urgent",
        "nbTasks": 2
        },
        {
        "id": 2,
        "title": "Another Note",
        "status": "serious",
        "nbTasks": 0
        }
    ]
    ```

#### Delete a Note

**Endpoint:** `DELETE /notes/:id`

**Response:**

- `200 OK` if the note was deleted successfully.
- `404 Not` Found if the note does not exist.

###Tasks
####Create a Task for a Note

**Endpoint:** `POST /notes/:id/tasks`

**Request Body:**

- `content` (string) - **required**: The content of the task.

**Example Request:**

```json
{
  "content": "My Task Content"
}
```

**Response:**

- `200 OK` with the created task object:

    ```json
    {
    "id": 1,
    "content": "My Task Content",
    "noteId": 1
    }
    ```

- `400 Bad Request` if content is missing.

- `404 Not Found` if the note does not exist.

#### List Tasks of a Note

**Endpoint:** `GET /notes/:id/tasks`

**Response:**

- `200 OK` with an array of tasks for the specified note:

    ```json
    [
        {
        "id": 1,
        "content": "My Task Content"
        },
        {
        "id": 2,
        "content": "Another Task"
        }
    ]
    ```

- `404 Not Found` if the note does not exist.

#### Delete a Task

**Endpoint:** `DELETE /tasks/:id`

**Response:**

- `200 OK` if the task was deleted successfully.
- `404 Not Found` if the task does not exist.

## Database

The server uses an SQLite database located in the same directory as the server file. To reset the database with pristine tables, use the following command:

```bash
npm run db:reset
```

This command deletes the current database file (if it exists) and creates a new one with empty notes and tasks tables.


## Error Handling

The API returns `400 Bad Request` for validation errors, `404 Not Found` for missing resources, and `500 Internal Server Error` for unexpected server issues.

#### Example 400 Error Response:

```json
{
  "error": "Invalid status. Allowed values are 'urgent', 'serious', or 'unimportant'."
}
```
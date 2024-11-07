# Frontend Web Development 2024/2025 Assignment #3

## Introduction to VueJS

### Submission procedure

- Submit your assignment on the eCampus platform : https://ecampus.emse.fr/mod/assign/view.php?id=29839

Compress your projet directory into an archive format (ZIP, 7z, tar, ...) and upload a single file
Due to the number of students in the lecture, you have to work in groups of 2 or 3 persons.

Please register on the Google Stylesheet (linked in eCampus).

### Getting the project running

For this project, you will have to run a backend server, that serves a basic HTTP API.

And a second server, that will compile the Vue sources, generate debugging information for the web browser, provide live reloading, and serve your frontend (HTML and linked sources).

#### Prerequesites

The backend and frontend servers are coded with NodeJS. You need to have a working
installation of NodeJS (> 18.18) on your machine. 


#### Running the backend

1. Go to the `backend/` directory. 
2. Start the server with

    ```
    npm run start
    ```

3. By default the backend server runs on port 3014, you can access it at http://localhost:3014
4. It stores its data in a local SQLite database. It provides some sample data on first creation. If you want to reset your database with the initial data, run the command : 

    ```
    npm run db:reset
    ```

#### Starting the frontend server

1. Go to the `frontend/` directory. 
2. The first time, you need to install the project dependencies

    ```
    npm install
    ```

    No need to run this command again after that.

3. Start the server with

    ```
    npm run dev
    ```

4. By default the frontend server runs on port 5173, you can access it at http://localhost:5173.
   
   This server is a development server provided by the VueJS framework. It has a "live-reload"
   feature. That means than each time you modify a source file in your project, the browser
   is notified and will automatically reload the page. It will also display any parsing or 
   compilation error if any.

### Backend API Specifiation

If you are using VS Code, "Thunder Client" is an excellent plugin that helps you easily
test a server API by hand-crafting HTTP requests.

Another tool is Postman, but it requires to make an account by them.

You can also use the command line tool `curl`, although it's not as user friendly.

The backend API specification for the project is located at [backend/README.md](backend/README.md)

### Instrutions

#### What is already done for you :

- The component structure. You don't have to write new components except for the bonus part.
- All the CSS is already done, you don't need to modify it
- The `NotesApp` component already fetches the notes from the server, and generate an instance of `Note` for each one. 
- The `Note` component already display the `title` and `status` that are provided to it via the `note` custom property. It displays a custom color for each value of `status`.
- Inside the `Note` component, sample HTML is in place to display tasks, but will need to be replace by dynamically  generated content
- In the `CreateNote` component, the `v-model` directive is already setup to work with the `radio` inputs.

#### Features to implement

- Each `Note` component needs to fetch the list of tasks from the server and display them
- You need to implement the creation of new tasks in a note. A new task will be created (**on the server**), when the user clicks the "+" button, or when the user presses the `<Enter>` key when typing in the field.
- You need to implement the deletion of a task, when the user clicks the trashbin icon associated with each task.
- You need to implement the creation of a new note, this is to be done is the `CreateNote` component.
- The color of the `CreateNote` component should change according to the currently selected state in the radio buttons.
- You need to implement the delection of a note, when the user clicks the trashbin icon on the top-right corner of each note.



#### Bonus feature

This feature is not mandatory, but I will award bonus points if you do it.

Add a "Filter" component, to display only the notes of a given status :

- Create a new Component named `NoteStatusFilter`.
- This component will be displayed on top of the notes container
- This component will have a UI that allow the user to choose one of these 4 options :
    - "All"
    - "Unimportant"
    - "Serious"
    - "Urgent"
- The easiest way to do it is with a group of radio button, but you can experiment
  to make something prettier (hint : you can achieve this without HTML inputs, 
  only with regular HTML elements by manipulating the Component data state and the
  CSS rendering)
- This component will be a child of `NotesApp` component
- The component will emit the selected option, in a custom Component Event when the user clicks on one of the options
- The `NotesApp` parent component will update the displayed list of notes according to the user selected option
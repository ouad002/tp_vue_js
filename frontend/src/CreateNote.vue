<script setup>
import { ref } from 'vue';
import { HOST } from './config.js';

const newNoteTitle = ref('');
const newNoteStatus = ref('unimportant');

const createNote = async () => {
  if (newNoteTitle.value.trim() === '') {
    console.error('Note title is required');
    return;
  }

  try {
    const response = await fetch(`${HOST}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newNoteTitle.value,
        status: newNoteStatus.value,
      }),
    });

    if (response.ok) {
      const newNote = await response.json();
      console.log('Note created successfully:', newNote);
      newNoteTitle.value = '';
      newNoteStatus.value = 'unimportant';
    } else {
      console.error('Failed to create note');
    }
  } catch (error) {
    console.error('Error creating note:', error);
  }
};
</script>

<template>
  <div :class="['note', newNoteStatus]">
    <input
      class="new-note-title"
      placeholder="Enter note title..."
      v-model="newNoteTitle"
    />

    <div class="status-select">
      <div>
        <input
          type="radio"
          id="unimportant"
          v-model="newNoteStatus"
          value="unimportant"
        />
        <label for="unimportant">Unimportant</label>
      </div>

      <div>
        <input
          type="radio"
          id="serious"
          v-model="newNoteStatus"
          value="serious"
        />
        <label for="serious">Serious</label>
      </div>

      <div>
        <input type="radio" id="urgent" v-model="newNoteStatus" value="urgent" />
        <label for="urgent">Urgent</label>
      </div>
    </div>

    <button class="create-btn" @click="createNote">Create new note</button>
  </div>
</template>

<style lang="scss" scoped>
@use 'assets/mediaQueryScreens.scss' as *;
@use 'assets/colors.scss' as *;

$gutter-size: 15px;

.note {
  min-height: 200px;
  border-radius: 10px;
  padding: 10px;
  color: white;

  & > input {
    padding: 15px 5px 15px 5px;
    border: 0;
    font-size: 20px;
    width: 100%;
    border-radius: 5px;

    &::placeholder {
      font-style: italic;
      color: white;
    }
  }

  & > .create-btn {
    padding: 10px 5px 10px 5px;
    width: 100%;
    background-color: white;
    color: $dark-green;
    font-weight: bold;
    font-size: 15px;
  }

  &.unimportant {
    background-color: $dark-green;
    & > input {
      background-color: $light-green;
      color: darken($dark-green, 20%);
    }

    .create-btn {
      color: $dark-green;
    }
  }

  &.serious {
    background-color: $dark-yellow;

    & > input {
      background-color: $light-yellow;
      color: darken($dark-yellow, 20%);
    }

    .create-btn {
      color: $dark-yellow;
    }
  }

  &.urgent {
    background-color: $dark-red;

    & > input {
      background-color: $light-red;
      color: darken($dark-red, 20%);
    }

    .create-btn {
      color: $dark-red;
    }
  }

  .status-select {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    margin-top: 10px;
    margin-bottom: 10px;

    & input {
      margin-right: 5px;
    }
  }
}

@include smallScreen {
  .note {
    width: 100%;
  }
}

@include mediumScreen {
  .note {
    width: calc((100% - $gutter-size) / 2);
  }
}

@include largeScreen {
  .note {
    width: calc((100% - ($gutter-size * 2)) / 3);
  }
}
</style>

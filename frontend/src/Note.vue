<script setup>

import {ref} from 'vue';

defineProps(['note']);
</script>

<template>
    <div :class="['note', note.status]">
        <div class="delete-button">&#x1F5D1;</div>
        <h2>{{note.title}}</h2>

        <div class="tasks">
          <div class="task">
            <div class="content">My task that needs to be done</div>
            <div class="delete-button">&#x1F5D1;</div>
          </div>

          <div class="new-task">
            <input class="content" placeholder="Enter new task...">
            <button class="create-btn">+</button>
          </div>
        </div>
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
    position: relative;

    & > .delete-button {
      position: absolute;
      top: 5px;
      right: 10px;
      font-size: 25px;
      cursor: pointer;
    }


    h2 {
      padding-bottom: 5px;
      width: calc(100% - 25px);
    }

    .task {
      padding: 10px 5px 10px 5px;
      margin-bottom: 10px;
    }

  

    .task {
      border-radius: 5px;
      display: flex;
      align-items: center;

      & > .content {
        flex-grow: 1;
      }

      & > .delete-button {
        visibility: hidden;
        flex-grow: 0;
        color: black;
        font-size: 20px;
        cursor: pointer;
      }


      &:hover > .delete-button {
        visibility: visible;
      }
    }

  
    .new-task {
      display: flex;  

      & > input { 
        flex-grow: 1;
        border: 0;
        padding: 15px 5px 15px 5px;

        &::placeholder {
          color: white;
        }
      }

      & > .create-btn {
        background-color: white;
        font-size: 25px;
        font-weight: bold;
        width: 40px;
      }
    }
  

    &.unimportant {
      background-color: $dark-green;
      .task, .new-task > input {
        background-color: $light-green;
        color: darken($dark-green, 20%);
      }

      .new-task > .create-btn {
        color: $dark-green;
      }
    }

    &.serious {
      background-color: $dark-yellow;

      .task, .new-task > input {
        background-color: $light-yellow;
        color: darken($dark-yellow, 20%);
      }

      .new-task > .create-btn {
        color: $dark-yellow;
      }
    }

    &.urgent {
      background-color: $dark-red;

      .task, .new-task > input {
        background-color: $light-red;
        color: darken($dark-red, 20%);
      }

      .new-task > .create-btn {
        color: $dark-red;
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

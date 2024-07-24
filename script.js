var root = document.querySelector(':root');
var container = document.querySelector('.container');
var taskList = document.getElementById('tasksList');
var addTaskBtn = document.getElementById('addTaskBtn');
var taskCheckBtns = document.querySelectorAll('.task--checked')

addTaskBtn.addEventListener('click', () => addTask());

//add task
function addTask() {
    const newTaskItem = document.createElement('li');
    newTaskItem.setAttribute('class', 'task__item');
    const newTaskBtn = document.createElement('div');
    newTaskBtn.setAttribute('class', 'task__button button');
    const newTaskInput = document.createElement('input');
    newTaskInput.setAttribute('id', 'taskInput');
    newTaskInput.setAttribute('input', 'text');
    const newTaskText = document.createElement('span');
    newTaskText.setAttribute('class', 'task__text');
    const newTaskMask = document.createElement('div');
    newTaskMask.setAttribute('class', 'task__mask hidden');
    const newDelBtn = document.createElement('div');
    newDelBtn.setAttribute('class', 'task__delete__button button');
    const newModBtn = document.createElement('div');
    newModBtn.setAttribute('class', 'task__modify__button button');

    taskList.appendChild(newTaskItem);
    newTaskItem.appendChild(newTaskBtn);
    newTaskItem.appendChild(newTaskInput);
    newTaskItem.appendChild(newTaskText);
    newTaskItem.appendChild(newTaskMask);
    newTaskMask.appendChild(newDelBtn);
    newTaskMask.appendChild(newModBtn);

    newTaskInput.focus();
    onClickOutside(newTaskItem, () => confirmAddingTask(newTaskInput, newTaskText))
        .then(() => newTaskItem.addEventListener('click', () => toggleTask(newTaskMask)))
        .then(() => newDelBtn.addEventListener('click', () => deleteTask(newTaskMask)))
}

//confirm adding task
const confirmAddingTask = (input, text) => {
    if (input.value !== '') {
        text.innerText = input.value;
        input.remove();
    } else {
        input.parentElement.remove();
    }
}

//delete task
const deleteTask = (el) => {
    let parent = el.parentElement;
    parent.remove();
}

//modify task
const modifyTask = (btns) => { }

//toggle task edit mode
const toggleTask = (el) => {
    if (el.classList.contains("hidden")) {
        el.classList.remove("hidden");
    } else {
        el.classList.add("hidden");
    }
}

//event listener of clicking outside from the element
const onClickOutside = (el, callback) => {
    return new Promise((resolve) => {
        document.addEventListener('click', event => {
            if (!el.contains(event.target)) {
                callback();
                resolve();
            }
        }, { capture: true });
    })
}

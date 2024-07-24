var root = document.querySelector(':root');
var container = document.querySelector('.container');
var taskList = document.getElementById('tasksList');
var addTaskBtn = document.getElementById('addTaskBtn');
var taskCheckBtns = document.querySelectorAll('.task--checked')

addTaskBtn.addEventListener('click', () => addTask());

addTask("Welcome to my to-do list.")
addTask("Click task item to toggle edit mode for deleting or modifying task.")
addTask("Click below \"+\" button for adding new task.")

//add task
function addTask(text) {
    const newTaskItem = document.createElement('li');
    newTaskItem.setAttribute('class', 'task__item');
    const newTaskBtn = document.createElement('div');
    newTaskBtn.setAttribute('class', 'task__button button');
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
    newTaskItem.appendChild(newTaskText);
    newTaskItem.appendChild(newTaskMask);
    newTaskMask.appendChild(newDelBtn);
    newTaskMask.appendChild(newModBtn);
    
    if (typeof text !== "undefined" && text.trim().length>0){
        newTaskText.innerText = text;
        newTaskItem.addEventListener('click', () => toggleTask(newTaskMask));
        newDelBtn.addEventListener('click', () => deleteTask(newTaskItem));
        newModBtn.addEventListener('click', () => modifyTask(newTaskItem));

    }else{
        const newTaskInput = document.createElement('input');
        newTaskInput.setAttribute('id', 'taskInput');
        newTaskInput.setAttribute('input', 'text');   
        newTaskItem.appendChild(newTaskInput);
        newTaskInput.focus();
        newTaskText.style.display = 'none';
        onClickOutside(newTaskItem, () => confirmAddingTask(newTaskInput, newTaskText))
            .then(() => newTaskItem.addEventListener('click', () => toggleTask(newTaskMask)))
            .then(() => newDelBtn.addEventListener('click', () => deleteTask(newTaskItem)))
            .then(() => newModBtn.addEventListener('click', () => modifyTask(newTaskItem)))
            .then(()=> newTaskText.style.display = '');
    }
}

//confirm adding task
const confirmAddingTask = (input, text) => {
    if (input.value !== '' && input.value.trim().length > 0 ) {
        text.innerText = input.value;
        input.remove();
    } else {
        input.parentElement.remove();
    }
}

//delete task
const deleteTask = (el) => {
    el.remove();
}

//modify task
const modifyTask = (el) => {
    let taskText = el.querySelector('.task__text');
    let taskMask = el.querySelector('.task__mask');
    const newTaskInput = document.createElement('input');
    newTaskInput.setAttribute('id', 'taskInput');
    newTaskInput.setAttribute('input', 'text');
    newTaskInput.value = taskText.innerText;
    el.insertBefore(newTaskInput,taskMask);
    taskText.style.display = 'none';
    newTaskInput.focus();
    onClickOutside(el, () => confirmAddingTask(newTaskInput, taskText))
    .then(()=> taskText.style.display = '');
}

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

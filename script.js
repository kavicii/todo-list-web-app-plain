var root = document.querySelector(':root');
var container = document.querySelector('.container');
var taskList = document.getElementById('tasksList');
var addTaskBtn = document.getElementById('addTaskBtn');
var taskCheckBtns = document.querySelectorAll('.task--checked')

addTaskBtn.addEventListener('click', () => addTask());

//add task
const addTask = () => {
    const newTaskItem = document.createElement('li');
    newTaskItem.setAttribute('class', 'task__item');
    const newTaskBtn = document.createElement('div');
    newTaskBtn.setAttribute('class', 'task__button button');
    const newTaskInput = document.createElement('input');
    newTaskInput.setAttribute('id', 'taskInput');
    newTaskInput.setAttribute('input', 'text');
    const newTaskText = document.createElement('span');
    newTaskText.setAttribute('class', 'task__text');

    taskList.appendChild(newTaskItem);
    newTaskItem.appendChild(newTaskBtn);
    newTaskItem.appendChild(newTaskInput);
    newTaskItem.appendChild(newTaskText);

    newTaskInput.focus();
    onClickOutside(newTaskItem, ()=>confirmAddingTask(newTaskInput, newTaskText))
}

//confirm adding task
const confirmAddingTask = (input, text) => {
    if(input.value !== ''){
        text.innerText = input.value;
        input.remove();
    }else{
        input.parentElement.remove();
    }
}

//delete task
const deleteTask = (btns) => {}

//modify task
const modifyTask = (btns) => {}

//event listener of clicking outside from the element
const onClickOutside = (el, callback) => {
    document.addEventListener('click', event => {
        if (!el.contains(event.target)){
            callback();
        } 
      },{capture: true});
}
const root = document.querySelector(':root');
const container = document.querySelector('.container');
const taskList = document.getElementById('tasksList');
const addTaskBtn = document.getElementById('addTaskBtn');
addTaskBtn.addEventListener('click', () => addTask());

if (localStorage.length !== 0) {
    let retString = localStorage.getItem("data");
    JSON.parse(retString).forEach((task) => {
        addTask(task.text, task.checked);
    });
} else {
    addTask("Welcome to my to-do list.", 'true');
    addTask("Click task item to toggle edit mode for deleting or modifying task.");
    addTask("Click below \"+\" button for adding new task.", 'true');
    addTask("For your security, we recommend not storing any sensitive personal information like passwords, credit card details, or social security numbers in this web app.", 'false');
}
//add task
function addTask(text, checked) {
    const newTaskItem = document.createElement('li');
    newTaskItem.setAttribute('class', 'task__item');
    const newTaskBtn = document.createElement('div');
    if (typeof checked !== "undefined" && checked === 'true') {
        newTaskBtn.setAttribute('class', 'task__button button checked');
    } else {
        newTaskBtn.setAttribute('class', 'task__button button');
    }
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

    if (typeof text !== "undefined" && text.trim().length > 0) {
        newTaskText.innerText = text;
        newTaskItem.addEventListener('click', () => toggleTask(newTaskItem));
        newDelBtn.addEventListener('click', () => deleteTask(newTaskItem));
        newModBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            modifyTask(newTaskItem);
        });
        newTaskBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleCheckButton(newTaskBtn);
        });
    } else {
        const newTaskInput = document.createElement('input');
        newTaskInput.setAttribute('id', 'taskInput');
        newTaskInput.setAttribute('input', 'text');
        newTaskItem.appendChild(newTaskInput);
        newTaskInput.focus();
        newTaskText.style.display = 'none';
        onClickOutside(newTaskItem, () => confirmAddingTask(newTaskInput, newTaskText))
            .then(() => newTaskItem.addEventListener('click', () => toggleTask(newTaskItem)))
            .then(() => newDelBtn.addEventListener('click', () => deleteTask(newTaskItem)))
            .then(() => newModBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                modifyTask(newTaskItem);
            }))
            .then(() => newTaskBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleCheckButton(newTaskBtn);
            }))
            .then(() => newTaskText.style.display = '');
    }
}

//confirm adding task
const confirmAddingTask = (input, text) => {
    if (input.value !== '' && input.value.trim().length > 0) {
        text.innerText = input.value;
        input.remove();
    } else {
        input.parentElement.remove();
    }
    updateLocalStorage();
}

//delete task
const deleteTask = (el) => {
    el.remove();
    updateLocalStorage();
}

//modify task
const modifyTask = (el) => {
    let taskText = el.querySelector('.task__text');
    let taskMask = el.querySelector('.task__mask');
    const newTaskInput = document.createElement('input');
    newTaskInput.setAttribute('id', 'taskInput');
    newTaskInput.setAttribute('input', 'text');
    newTaskInput.value = taskText.innerText;
    el.insertBefore(newTaskInput, taskMask);
    if (!taskMask.classList.contains("hidden")){
        taskMask.classList.add('hidden');
    }
    taskText.style.display = 'none';
    newTaskInput.focus();
    onClickOutside(el, () => confirmAddingTask(newTaskInput, taskText))
        .then(() => taskText.style.display = '')
        .then(() => updateLocalStorage());
}

//toggle task edit mode
const toggleTask = (el) => {
    const taskMask = el.querySelector('.task__mask');
    const taskInput = el.querySelector('#taskInput');
    if(!taskInput){
        if (taskMask.classList.contains("hidden")) {
            taskMask.classList.remove("hidden");
        } else {
            taskMask.classList.add("hidden");
        }
    }
    const taskMasks = document.querySelectorAll('.task__mask');
    taskMasks.forEach((targetTaskMask)=>{
        if(targetTaskMask !== taskMask){
            targetTaskMask.classList.add("hidden");
        }
    })

}

//toggle task's check button
const toggleCheckButton = (el) => {
    if (el.classList.contains('checked')) {
        el.classList.remove('checked');
    } else {
        el.classList.add('checked');
    }
    updateLocalStorage();
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

//update local storage's data
const updateLocalStorage = () => {
    const taskCheckButtons = document.querySelectorAll('.task__button');
    const taskTexts = document.querySelectorAll('.task__text');
    const taskCheckArray = [];
    const taskTextsArray = [];
    taskCheckButtons.forEach(taskCheckButton => {
        if (taskCheckButton.classList.contains('checked')) {
            taskCheckArray.push('true')
        } else {
            taskCheckArray.push('false')
        }
    })
    taskTexts.forEach(taskText => {
        taskTextsArray.push(taskText.innerText)
    })
    const storedObj = taskTextsArray.map((text, index) => ({
        text: text,
        checked: taskCheckArray[index]
    }));
    const storedString = JSON.stringify(storedObj);
    localStorage.setItem("data", storedString);
}
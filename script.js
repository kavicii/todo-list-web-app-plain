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
};

//add task (function that handels default tasks, saved tasks or add a new task)
function addTask(text, checked) {
    const newTaskItemContainer = document.createElement('li');
    newTaskItemContainer.setAttribute('class', 'task_item__container');
    taskList.appendChild(newTaskItemContainer);
    
    const newTaskItem = document.createElement('li');
    newTaskItem.setAttribute('class', 'task__item');
    newTaskItemContainer.appendChild(newTaskItem);
    
    const newTaskBtn = document.createElement('div');
    if (typeof checked !== "undefined" && checked === 'true') {
        newTaskBtn.setAttribute('class', 'task__button button checked');
    } else {
        newTaskBtn.setAttribute('class', 'task__button button');
    }
    newTaskItem.appendChild(newTaskBtn);
    
    const newTaskText = document.createElement('span');
    newTaskText.setAttribute('class', 'task__text');
    newTaskItem.appendChild(newTaskText);
    
    const newTaskMask = document.createElement('div');
    newTaskMask.setAttribute('class', 'task__mask hidden');
    newTaskItem.appendChild(newTaskMask);
    
    const newDelBtn = document.createElement('div');
    newDelBtn.setAttribute('class', 'task__delete__button button');
    newTaskMask.appendChild(newDelBtn);
    
    const newModBtn = document.createElement('div');
    newModBtn.setAttribute('class', 'task__modify__button button');
    newTaskMask.appendChild(newModBtn);

    if (typeof text !== "undefined" && text.trim().length > 0) {
        newTaskText.innerText = text;
        addEventListenerToButtons();
    } else {
        // Create input field and hide the text from task item.
        const newTaskInput = document.createElement('textarea');
        newTaskInput.setAttribute('id', 'taskInput');
        newTaskInput.setAttribute('rows', '1');
        newTaskText.style.display = 'none';
        newTaskItem.appendChild(newTaskInput);
        newTaskInput.focus();

        // Create confirm button.
        const newConfirmBtn = document.createElement('div');
        newConfirmBtn.setAttribute('class', 'task__confirm__button');
        newConfirmBtn.innerText = 'Confirm';
        newTaskItemContainer.appendChild(newConfirmBtn);

        //Shrank task item's width to show the confirm button.
        newTaskItem.className = 'task__item--shrank';

        // Resize the textArea when it is created, user inputing and resizing the browser.
        // The scrollHeight property can sometimes be inaccurate when called immediately after the textarea is created. Used Timeout to solve.
        setTimeout( resizeTextArea, 10); 
        newTaskInput.addEventListener('input', resizeTextArea);
        window.addEventListener("resize", resizeTextArea);

        hideTaskMasks();

        Promise.race([
            onClickOutside(newTaskItem, () => confirmAddingTask(newTaskInput, newTaskText)),
            onClickConfirmButton(newConfirmBtn, () => confirmAddingTask(newTaskInput, newTaskText)),
            onPressEnterKey(newTaskInput, () => confirmAddingTask(newTaskInput, newTaskText))
        ])
            .then(() => {
                addEventListenerToButtons();
                newTaskText.style.display = '';
                newConfirmBtn.remove();
                newTaskItem.className = 'task__item';
                window.removeEventListener("resize", resizeTextArea);
            });
    }

    function addEventListenerToButtons(){
        newTaskItem.addEventListener('click', () => toggleTask(newTaskItem));
        newDelBtn.addEventListener('click', (event) => deleteTask(event));
        newModBtn.addEventListener('click', (event) =>  modifyTask(event));
        newTaskBtn.addEventListener('click', (event) => toggleCheckButton(event));
    };
};

//confirm adding task
const confirmAddingTask = (input, text) => {
    if (input.value !== '' && input.value.trim().length > 0) {
        text.innerText = input.value;
        input.remove();
    } else {
        input.closest('.task_item__container').remove();
    }
    updateLocalStorage();
};

//delete task
const deleteTask = (e) => {
    e.target.closest('.task_item__container').remove();
    updateLocalStorage();
};

//modify task
const modifyTask = (e) => {
    // Use stopPropagation() to prevent triggering click event from parent node. (Event Bubbling)
    e.stopPropagation();
    
    // Get nodes.
    let taskItem = e.target.closest('.task__item');
    let taskText = taskItem.querySelector('.task__text');
    let taskMask = taskItem.querySelector('.task__mask');
    
    // Create input field and hide the text from task item.
    const newTaskInput = document.createElement('textarea');
    newTaskInput.setAttribute('id', 'taskInput');
    newTaskInput.setAttribute('rows', '1');
    newTaskInput.value = taskText.innerText;
    taskText.style.display = 'none';
    taskItem.insertBefore(newTaskInput, taskMask);
    newTaskInput.focus();

    // Create confirm button.
    const newConfirmBtn = document.createElement('div');
    newConfirmBtn.setAttribute('class', 'task__confirm__button');
    newConfirmBtn.innerText = 'Confirm';
    taskItem.parentElement.appendChild(newConfirmBtn);

    // Resize the textArea when it is created, user inputing and resizing the browser.
    // The scrollHeight property can sometimes be inaccurate when called immediately after the textarea is created. Used Timeout to solve.
    setTimeout(resizeTextArea, 10); 
    newTaskInput.addEventListener('input', resizeTextArea);
    window.addEventListener("resize", resizeTextArea);

    if (!taskMask.classList.contains("hidden")) {
        taskMask.classList.add('hidden');
    }
    
    //Shrank task item's width to show the confirm button.
    taskItem.className = 'task__item--shrank';

    Promise.race([
        onClickOutside(taskItem, () => confirmAddingTask(newTaskInput, taskText)),
        onClickConfirmButton(newConfirmBtn, () => confirmAddingTask(newTaskInput, taskText)),
        onPressEnterKey(newTaskInput, () => confirmAddingTask(newTaskInput, taskText))
    ])
        .then(() => {
            taskText.style.display = '';
            newConfirmBtn.remove();
            taskItem.className = 'task__item';
            window.removeEventListener("resize", resizeTextArea);
        });
};

//toggle task edit mode
const toggleTask = (el) => {
    const taskMask = el.querySelector('.task__mask');
    const taskInput = el.querySelector('#taskInput');
    if (!taskInput) {
        if (taskMask.classList.contains("hidden")) {
            taskMask.classList.remove("hidden");
        } else {
            taskMask.classList.add("hidden");
        }
    }
    hideTaskMasks(taskMask);
};

//toggle task's check button
const toggleCheckButton = (e) => {
    // Use stopPropagation() to prevent triggering click event from parent node. (Event Bubbling)
    e.stopPropagation();
    if (e.target.classList.contains('checked')) {
        e.target.classList.remove('checked');
    } else {
        e.target.classList.add('checked');
    }
    updateLocalStorage();
};

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
};

//event listener of clicking confirm button
const onClickConfirmButton = (el, callback) => {
    return new Promise((resolve) => {
        el.addEventListener('click', (event) => {
            // Use stopPropagation() to prevent triggering click event from parent node. (Event Bubbling)
            event.stopPropagation();
            callback();
            resolve();
        });
    })
};

const onPressEnterKey = (el, callback) => {
    return new Promise((resolve) => {
        el.addEventListener('keypress', function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                callback();
                resolve();
            }
        });
    })
};

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
};

const resizeTextArea = () => {
    const textArea = document.querySelector('#taskInput');
    textArea.style.height = 'auto';
    textArea.style.height = (textArea.scrollHeight) + 'px';
};

const hideTaskMasks = (targetMask) => {
    const taskMasks = document.querySelectorAll('.task__mask');
    taskMasks.forEach((otherTaskMask) => {
        if (typeof targetMask !== 'undefined'){
            if (otherTaskMask !== targetMask) {
                otherTaskMask.classList.add("hidden");
            }
        }else{
            otherTaskMask.classList.add("hidden");
        }
    })
};
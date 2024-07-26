const taskList = document.getElementById('tasksList');

const addTaskBtn = document.getElementById('addTaskBtn');
addTaskBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    addTask();
});

document.addEventListener('keydown', function handleKeyPress(e) {
    const confirmButton = document.querySelector('.task__confirm__button');
    if (confirmButton) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            confirmButton.click();
        }
    }else{
        if (e.key === 'Enter'){
            e.preventDefault();
            addTaskBtn.click();
        }
    }
});

//event listener of clicking outside from the element
document.addEventListener('click', function handleClickOutside(e) {
    const confirmButton = document.querySelector('.task__confirm__button');
    if (confirmButton !== null && !confirmButton.previousElementSibling.contains(e.target)) {
        confirmButton.click();
    };
    const taskMask = document.querySelector('.show');
    if (taskMask && !taskMask.contains(e.target)) {
        taskMask.click();
    }
})

if (localStorage.length !== 0) {
    let retString = localStorage.getItem("data");
    JSON.parse(retString).forEach((task) => {
        addTask(task.text, task.checked);
    });
} else {
    addTask("Welcome to my to-do list! 👋", 'true');
    addTask("Click task item to toggle edit mode for deleting or modifying task.");
    addTask("Click \"+\" button below or press \"Enter\"  to add new task.", 'true');
    addTask("You can press \"Shift\" and \"Enter\" key at the same time for line breaks!", 'false');
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
    } else {
        editText(newTaskItem, newTaskText);
    }
    newTaskItem.addEventListener('click', (event) => toggleTask(event));
    newDelBtn.addEventListener('click', (event) => deleteTask(event));
    newModBtn.addEventListener('click', (event) => modifyTask(event));
    newTaskBtn.addEventListener('click', (event) => toggleCheckButton(event));

};

//confirm adding task
const confirmAddingTask = (input, text) => {
    if (input.value !== '' && input.value.trim().length > 0) {
        text.innerText = input.value;
        input.remove();
        text.style.display = '';
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

    // Create temp text field for input, change task text after confirmation.
    editText(taskItem, taskText);
};

//toggle task edit mode
const toggleTask = (e) => {
    e.stopPropagation();
    const taskMask = e.currentTarget.querySelector('.task__mask');
    const taskInput = e.currentTarget.querySelector('#taskInput');
    if (!taskInput) {
        if (taskMask.classList.contains("hidden")) {
            taskMask.classList.remove("hidden");
            taskMask.classList.add("show");
            hideTaskMasks(taskMask);
        } else {
            taskMask.classList.add("hidden");
            taskMask.classList.remove("show");
        }
    }
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
        if (typeof targetMask !== 'undefined') {
            if (otherTaskMask !== targetMask) {
                otherTaskMask.classList.add("hidden");
                otherTaskMask.classList.remove("show");
            }
        } else {
            otherTaskMask.classList.add("hidden");
            otherTaskMask.classList.remove("show");

        }
    })
};

const editText = (taskItem, taskText) => {
    // Clear all confirm button.
    const confirmButton = document.querySelector('.task__confirm__button');
    if (confirmButton !== null) {
        confirmButton.click();
    }

    // Create input field and hide the text from task item.
    const newTaskInput = document.createElement('textarea');
    newTaskInput.setAttribute('id', 'taskInput');
    newTaskInput.setAttribute('rows', '1');
    newTaskInput.value = taskText.innerText;
    taskText.style.display = 'none';
    taskItem.appendChild(newTaskInput);
    newTaskInput.focus();

    // Create confirm button.
    const newConfirmBtn = document.createElement('div');
    newConfirmBtn.setAttribute('class', 'task__confirm__button');
    newConfirmBtn.innerText = 'Confirm';
    taskItem.parentElement.appendChild(newConfirmBtn);

    //Shrank task item's width to show the confirm button.
    taskItem.className = 'task__item--shrank';

    // Resize the textArea when it is created, user inputing and resizing the browser.
    // The scrollHeight property can sometimes be inaccurate when called immediately after the textarea is created. Used Timeout to solve.
    setTimeout(resizeTextArea, 10);
    newTaskInput.addEventListener('input', resizeTextArea);
    window.addEventListener("resize", resizeTextArea);

    hideTaskMasks();

    newConfirmBtn.addEventListener('click', function handleClickConfirmBtn(e) {
        e.stopPropagation();
        confirmAddingTask(newTaskInput, taskText);
        newConfirmBtn.remove();
        taskItem.className = 'task__item';
        window.removeEventListener("resize", resizeTextArea);
    })
}

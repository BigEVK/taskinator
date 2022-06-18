var pageContentEl = document.querySelector("#page-content");

var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");

var tasksToDoEl = document.querySelector("#tasks-to-do");

var tasksInProgressEl = document.querySelector("#tasks-in-progress");

var tasksCompletedEl = document.querySelector("#tasks-completed");

var tasks = [];

var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    // the following two lines of code were missing from mine
    // reset form fields for next task to be entered
    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectIndex = 0;

    // check if task is new or one being edited by seeing if it has a data-task-id attribute
    var isEdit = formEl.hasAttribute("data-task-id");
    // console.log(isEdit);

    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object as normal as pass to createTaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskEl(taskDataObj);
    }
    // the following code was in mine but removed from the final - This looks to have been replaced by 
    // lines 26 and 27
    // formEl.reset();
};
var createTaskEl = function (taskDataObj) {
    // console.log(taskDataObj);
    // console.log(taskDataObj.status);

    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = 
    "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // the folliwing 16 lines of code were not in my original
    switch (taskDataObj.status) {
        case "to do":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.append(listItemEl);
            break;
        case "in progress":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.append(listItemEl);
            break;
        case "completed":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.append(listItemEl);
            break;
        default:
            console.log("Something went wrong!");    
    }

    // save task as an object with name, type, status, and id properties then push it into tasks array
    // add the value of the id to the taskDataObj
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    
    // the following code was removed from the final
    // tasksToDoEl.appendChild(listItemEl);

    // I had the folowing two lines of code switched in order....
    // save tasks to localStorage
    saveTasks();
    // increase task counter for next unique task id
    taskIdCounter++;
};
var createTaskActions = function (taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);

    // creat change status dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(statusSelectEl);

    // create status options
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;
};
// I had the following code here, but the final has it toward the bottom...I moved this to line 286
// formEl.addEventListener("submit", taskFormHandler);


var taskButtonHandler = function (event) {
    // console.log(event.target);
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    // if (event.target.matches(".delete-btn")){
    //     // get the element's task id
    //     var taskId = event.target.getAttribute("data-task-id");
    //     console.log("you clicked a delete button!");
    // }

    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        // i did not have console.log...
        console.log("delete", targetEl);
        // get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var editTask = function (taskId) {
    // added the following console.log()...
    console.log(taskId);
    // console.log("editing task #" + taskId);
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // get content from task and name type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    // added the following console.log()...
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    // added the following console.log()...
    console.log(taskType);

    // write values of taskName and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // the following two lines of code are switched in the final...
    // update form's button to reflect editing a task rather than creating a new one
    document.querySelector("#save-task").textContent = "Save Task";
    // set data attribute to the form with a value of the task's id so it knows which one is being edited
    formEl.setAttribute("data-task-id", taskId);
}


var deleteTask = function (taskId) {
    // added the following console.log()...
    console.log(taskId);

    // find task list element with taskId value and remove it
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
};

var completeEditTask = function (taskName, taskType, taskId) {
    // find the matchin task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks, length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    alert("Task Updated!");

    // reset the form by removing the task id and changing the text button back to normal
    formEl.removeAttribute("data-task-id");
    // update formEl button to go back to saying "Add Task" instead of "Edit Task"
    document.querySelector("#save-task").textContent = "Add Task";
    // save tasks to localStorage
    saveTasks();
};
var taskStatusChangeHandler = function (event) {
    // console.log(event.target, event.target.getAttribute("data-task-id"));

    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update tasks in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    // console.log(tasks);
    // save to local storage
    saveTasks();
};

var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function () {
    // 1. get task items from local storage
    var savedTasks = localStorage.getItem("tasks");
    // removed the following console log from the final...
    // console.log(savedTasks);
    // check to see if there is anything saved to be retrieved
    if (!savedTasks) {
        return false;
    }
    // added the following console.log()...
    console.log("Saved tasks found!");
    // 2. convert tasks from the string format into an array of objects
    savedTasks = JSON.parse(savedTasks);
    // 3. Iterate through a task array and create task elements on the page from it
    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task into the 'createTaslEl()' function
        createTaskEl(savedTasks[i]);
    }

};
// moved from 142...
formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();

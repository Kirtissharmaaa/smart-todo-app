const emptyState = document.getElementById("emptyState");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");
const progressBar = document.querySelector(".progress-bar");
const progressPercent = document.getElementById("progressPercent");
const completionMessage = document.getElementById("completionMessage");
const filterButtons = document.querySelectorAll(".filter-btn");
const toast = document.getElementById("toast");

filterButtons.forEach(function(button){
    button.addEventListener("click",function(){
        filterButtons.forEach(function(btn){
            btn.classList.remove("active");
        });
        button.classList.add("active");
        const filter = button.dataset.filter;
        const tasks = document.querySelectorAll(".task");
        tasks.forEach(function(task){
            const checkbox = task.querySelector(".check-task");
            if(filter === "all"){
                task.style.display = "flex";
            }
            else if(filter === "active"){
                if(checkbox.checked){
                    task.style.display = "none";
                }
                else{
                    task.style.display = "flex";
                }

            }
            else if(filter === "completed"){
                if(checkbox.checked){
                    task.style.display = "flex";
                }
                else{
                    task.style.display = "none";
                }
            }
        });
    });
});

function updateTaskCount(){
    const total = document.querySelectorAll(".task").length;
    if(total === 0){
        emptyState.style.display = "block";
    }
    else{
        emptyState.style.display = "none";
    }
    const completed = document.querySelectorAll(".check-task:checked").length;
    const remaining = total - completed;
    taskCount.textContent = total;
    completedCount.textContent = completed;
    remainingCount.textContent = remaining;

    let percentage = 0;
    if(total>0){
        percentage = Math.round((completed/total)*100);
    }
    progressBar.style.width = percentage + "%";
    progressPercent.textContent = percentage + "%";

    if(percentage===100 && total > 0){
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6}
        });
        completionMessage.textContent = "🎉Awesome! You completed all your tasks.";
        progressBar.style.background = "linear-gradient(to right, rgb(255, 215, 0), rgb(255, 165, 0))";

    }
    else{
         completionMessage.textContent = "";
         progressBar.style.background = "linear-gradient(to right, rgb(0, 210, 106), rgb(155, 225, 93))";
    }
}


addTaskBtn.addEventListener("click", addTask);

function showToast(message){
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function(){
        toast.classList.remove("show");
    },3000);
}

function addTask(){
    const taskText = taskInput.value.trim();

    if(taskText === ""){
        showToast("⚠️ Please enter a task!");
        return;
    }
    const task = document.createElement("div");
    task.classList.add("task");
    task.innerHTML = 
                    `<div class="task-content"><input type = "checkbox" class= "check-task"> <span class="task-name">${taskText}</span></div> <div class = "task-buttons"><button class = "edit-btn"><i class="fa-solid fa-pen"></i></button><button class = "delete-btn"><i class="fa-solid fa-trash-can"></i></button></div>`;
    const deleteBtn = task.querySelector(".delete-btn");
    const editBtn = task.querySelector(".edit-btn");
    const checkbox = task.querySelector(".check-task");
    checkbox.addEventListener("change",function(){
        task.classList.toggle("completed");
        updateTaskCount();
    });
    editBtn.addEventListener("click",function(){
        const taskName = task.querySelector(".task-name");
        const updatedTask = prompt("Edit your task",taskName.textContent);
        if(updatedTask != null && updatedTask.trim() != ""){
            taskName.textContent = updatedTask.trim();
        }
    });
    deleteBtn.addEventListener("click",function(){
        task.remove();
         updateTaskCount();
    });
    taskList.appendChild(task);
    taskInput.value = "";
    updateTaskCount();
}
taskInput.addEventListener("keydown",function(event){
    if(event.key === "Enter"){
        addTask();
    }
})

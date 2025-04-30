// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const taskCountEl = document.getElementById('taskCount');
const completedCountEl = document.getElementById('completedCount');
const themeToggle = document.getElementById('themeToggle');

// App State
let tasks = [];
let darkTheme = false;

// Load data from localStorage
function loadFromLocalStorage() {
    // Load tasks
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
        updateStats();
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        darkTheme = true;
        document.body.classList.add('dark-theme');
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('darkTheme', darkTheme);
}

// Render tasks in the UI
function renderTasks() {
    // Clear the task list first
    taskList.innerHTML = '';

    // Render each task
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item task-enter';
        
        // Create checkbox
        const checkbox = document.createElement('div');
        checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
        checkbox.addEventListener('click', () => toggleTask(index));
        
        // Create task text
        const taskText = document.createElement('span');
        taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
        taskText.textContent = task.text;
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-task';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', () => deleteTask(index));
        
        // Append elements to task item
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteBtn);
        
        // Append task item to task list
        taskList.appendChild(taskItem);
    });
}

// Add a new task
function addTask() {
    const text = taskInput.value.trim();
    
    if (text === '') {
        // Shake the input if it's empty
        taskInput.classList.add('shake');
        setTimeout(() => {
            taskInput.classList.remove('shake');
        }, 500);
        return;
    }
    
    // Add task to array
    tasks.push({
        text,
        completed: false,
        createdAt: new Date().toISOString()
    });
    
    // Clear input
    taskInput.value = '';
    
    // Save and render
    saveToLocalStorage();
    renderTasks();
    updateStats();
    
    // Bounce the stats to indicate update
    animateStats();
}

// Toggle task completion status
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    
    // Apply animation to the task item
    const taskItems = document.querySelectorAll('.task-item');
    taskItems[index].classList.add('bounce');
    setTimeout(() => {
        taskItems[index].classList.remove('bounce');
    }, 600);
    
    // Save and render
    saveToLocalStorage();
    renderTasks();
    updateStats();
}

// Delete a task
function deleteTask(index) {
    // Apply animation before deleting
    const taskItems = document.querySelectorAll('.task-item');
    taskItems[index].classList.add('task-delete');
    
    // Remove task after animation completes
    setTimeout(() => {
        tasks.splice(index, 1);
        saveToLocalStorage();
        renderTasks();
        updateStats();
    }, 400);
}

// Update task statistics
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    taskCountEl.textContent = totalTasks;
    completedCountEl.textContent = completedTasks;
}

// Animate the stats counters
function animateStats() {
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => {
        stat.classList.add('bounce');
        setTimeout(() => {
            stat.classList.remove('bounce');
        }, 600);
    });
}

// Toggle dark theme
function toggleTheme() {
    darkTheme = !darkTheme;
    
    if (darkTheme) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    saveToLocalStorage();
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

themeToggle.addEventListener('click', toggleTheme);

// Initialize the app
loadFromLocalStorage();
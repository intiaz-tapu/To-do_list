const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const filterBtns = document.querySelectorAll('.filter-btn');
const priorityBtns = document.querySelectorAll('.priority-btn');
const taskDate = document.getElementById('taskDate');
const taskTime = document.getElementById('taskTime');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let selectedPriority = 'red';

// Priority selection
priorityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        priorityBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedPriority = btn.dataset.priority;
    });
});

// Add task
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    if (taskInput.value.trim() === '') return;

    const task = {
        id: Date.now(),
        text: taskInput.value,
        completed: false,
        priority: selectedPriority,
        date: taskDate.value,
        time: taskTime.value
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskInput.value = '';
    taskDate.value = '';
    taskTime.value = '';
}

// Render tasks
function renderTasks(filter = getCurrentFilter()) {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.style.borderLeft = `5px solid ${task.priority}`;
        li.classList.toggle('completed', task.completed);
        li.innerHTML = `
            <div>
                <span>${task.text}</span>
                <small>${task.date ? task.date : ''} ${task.time ? task.time : ''}</small>
            </div>
            <div>
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${task.id})">
                <button onclick="deleteTask(${task.id})">🗑️</button>
            </div>
        `;
        taskList.appendChild(li);
    });

    totalTasks.textContent = `${tasks.length} tasks`;
    completedTasks.textContent = `${tasks.filter(t => t.completed).length} completed`;
}

// Toggle complete
function toggleComplete(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTasks(btn.dataset.filter);
    });
});

function getCurrentFilter() {
    return document.querySelector('.filter-btn.active').dataset.filter;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Expose functions for inline HTML
window.toggleComplete = toggleComplete;
window.deleteTask = deleteTask;

// Initial render
renderTasks();

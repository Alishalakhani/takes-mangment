import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIn6meJASUWeoBLYQ63alzsxqQRKxG38I",
    authDomain: "auth-93543.firebaseapp.com",
    projectId: "auth-93543",
    storageBucket: "auth-93543.firebasestorage.app",
    messagingSenderId: "747460557876",
    appId: "1:747460557876:web:abd5b53a3892e3a11dde61",
    measurementId: "G-SBC56V5T8N"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Select Elements
const createBtn = document.getElementById('create-task-btn');
const closeBtn = document.getElementById('close-modal-btn');
const saveBtn = document.getElementById('save-task-btn');
const modal = document.getElementById('task-modal');

const todoColumn = document.getElementById('todo-tasks');
const progressColumn = document.getElementById('in-progress-tasks');
const doneColumn = document.getElementById('done-tasks');

let editTaskId = null;

// Open Modal
createBtn.addEventListener('click', () => {
  openModal();
});

// Close Modal
closeBtn.addEventListener('click', () => {
  closeModal();
});

// Save Button
saveBtn.addEventListener('click', () => {
  if (editTaskId) {
    updateTask(editTaskId);
  } else {
    createTask();
  }
});

// Open Modal Helper
function openModal(task = {}) {
  modal.style.display = 'flex';
  document.getElementById('task-title').value = task.title || '';
  document.getElementById('task-description').value = task.description || '';
  document.getElementById('task-assigned').value = task.assignedTo || '';
}

// Close Modal Helper
function closeModal() {
  modal.style.display = 'none';
  clearModalFields();
  editTaskId = null;
}

// Clear Inputs
function clearModalFields() {
  document.getElementById('task-title').value = '';
  document.getElementById('task-description').value = '';
  document.getElementById('task-assigned').value = '';
}

// Create Task
async function createTask() {
  const title = document.getElementById('task-title').value.trim();
  const description = document.getElementById('task-description').value.trim();
  const assignedTo = document.getElementById('task-assigned').value.trim();

  if (title === '') {
    alert('Title is required');
    return;
  }

  try {
    await addDoc(collection(db, "tasks"), {
      title,
      description,
      assignedTo,
      status: 'To Do'
    });
    closeModal();
    loadTasks();
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

// Load Tasks
async function loadTasks() {
  todoColumn.innerHTML = '';
  progressColumn.innerHTML = '';
  doneColumn.innerHTML = '';

  const querySnapshot = await getDocs(collection(db, "tasks"));
  querySnapshot.forEach((docSnap) => {
    const task = docSnap.data();
    const taskId = docSnap.id;
    renderTask(task, taskId);
  });
}

// Render Task Cards
function renderTask(task, id) {
  const card = document.createElement('div');
  card.classList.add('task-card');
  card.innerHTML = `
    <h4>${task.title}</h4>
    <p>${task.description}</p>
    <p><strong>Assigned:</strong> ${task.assignedTo || 'N/A'}</p>
    <div class="task-actions">
      <button class="move-btn">Move</button>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  // Move Button
  card.querySelector('.move-btn').addEventListener('click', () => moveTask(id, task.status));

  // Edit Button
  card.querySelector('.edit-btn').addEventListener('click', () => {
    editTaskId = id;
    openModal(task);
  });

  // Delete Button
  card.querySelector('.delete-btn').addEventListener('click', () => deleteTask(id));

  // Append to correct column
  if (task.status === 'To Do') {
    todoColumn.appendChild(card);
  } else if (task.status === 'In Progress') {
    progressColumn.appendChild(card);
  } else if (task.status === 'Done') {
    doneColumn.appendChild(card);
  }
}

// Update Task
async function updateTask(id) {
  const title = document.getElementById('task-title').value.trim();
  const description = document.getElementById('task-description').value.trim();
  const assignedTo = document.getElementById('task-assigned').value.trim();

  if (title === '') {
    alert('Title is required');
    return;
  }

  try {
    await updateDoc(doc(db, "tasks", id), {
      title,
      description,
      assignedTo
    });
    closeModal();
    loadTasks();
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

// Delete Task
async function deleteTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await deleteDoc(doc(db, "tasks", id));
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
}

// Move Task (Change Status)
async function moveTask(id, currentStatus) {
  let newStatus = '';
  if (currentStatus === 'To Do') newStatus = 'In Progress';
  else if (currentStatus === 'In Progress') newStatus = 'Done';
  else if (currentStatus === 'Done') newStatus = 'To Do'; // loop back to start

  try {
    await updateDoc(doc(db, "tasks", id), {
      status: newStatus
    });
    loadTasks();
  } catch (error) {
    console.error("Error moving task:", error);
  }
}

// First Load
loadTasks();
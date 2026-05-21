(function () {
  // -------------------- Data Model --------------------
  class Task {
    /**
     * @param {string} id - Unique identifier for the task
     * @param {string} text - Task description
     * @param {boolean} [completed=false] - Completion status
     */
    constructor(id, text, completed = false) {
      this.id = id;
      this.text = text;
      this.completed = completed;
    }
  }

  // -------------------- Persistence --------------------
  const STORAGE_KEY = 'todo-tasks';

  /**
   * Load tasks from localStorage. Returns an array of Task instances.
   * @returns {Task[]}
   */
  function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      // Ensure each object becomes a Task instance
      return parsed.map(item => new Task(item.id, item.text, item.completed));
    } catch (e) {
      console.error('Failed to parse tasks from localStorage', e);
      return [];
    }
  }

  /**
   * Save an array of Task instances to localStorage.
   * @param {Task[]} tasksArray
   */
  function saveTasks(tasksArray) {
    try {
      const serial = JSON.stringify(tasksArray);
      localStorage.setItem(STORAGE_KEY, serial);
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }

  // -------------------- Application State --------------------
  /** @type {Task[]} */
  let tasks = [];
  /** @type {'all'|'active'|'completed'} */
  let currentFilter = 'all';

  // -------------------- Helper Utilities --------------------
  /**
   * Find a task by its id.
   * @param {string} id
   * @returns {Task|undefined}
   */
  function getTaskById(id) {
    return tasks.find(t => t.id === id);
  }

  /**
   * Simple HTML escaper to avoid XSS when rendering task text.
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // -------------------- Rendering --------------------
  function renderTasks() {
    const listEl = document.getElementById('task-list');
    if (!listEl) return;
    // Clear existing list
    listEl.innerHTML = '';

    const filtered = tasks.filter(task => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    });

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.dataset.id = task.id;

      // Checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'toggle-complete';
      if (task.completed) checkbox.checked = true;
      li.appendChild(checkbox);

      // Text span
      const span = document.createElement('span');
      span.className = 'task-text';
      if (task.completed) span.classList.add('completed');
      span.innerHTML = escapeHtml(task.text);
      li.appendChild(span);

      // Edit button
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-task';
      editBtn.textContent = '✎';
      li.appendChild(editBtn);

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.className = 'delete-task';
      delBtn.textContent = '🗑️';
      li.appendChild(delBtn);

      listEl.appendChild(li);
    });
  }

  // -------------------- Event Handlers --------------------
  function handleAddTask() {
    const input = document.getElementById('new-task-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return; // ignore empty
    const id = Date.now().toString();
    const newTask = new Task(id, text);
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
    input.value = '';
    input.focus();
  }

  function handleToggleComplete(e) {
    const checkbox = e.target;
    const li = checkbox.closest('li');
    if (!li) return;
    const task = getTaskById(li.dataset.id);
    if (!task) return;
    task.completed = checkbox.checked;
    saveTasks(tasks);
    renderTasks();
  }

  function handleDeleteTask(e) {
    const btn = e.target;
    const li = btn.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
    renderTasks();
  }

  function handleEditTask(e) {
    const btn = e.target;
    const li = btn.closest('li');
    if (!li) return;
    const task = getTaskById(li.dataset.id);
    if (!task) return;

    const span = li.querySelector('.task-text');
    if (!span) return;

    // Replace span with input field
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = task.text;
    li.replaceChild(editInput, span);
    editInput.focus();
    editInput.select();

    const finalizeEdit = () => {
      const newText = editInput.value.trim();
      if (newText) {
        task.text = newText;
        saveTasks(tasks);
      }
      // Restore span
      const newSpan = document.createElement('span');
      newSpan.className = 'task-text';
      if (task.completed) newSpan.classList.add('completed');
      newSpan.innerHTML = escapeHtml(task.text);
      li.replaceChild(newSpan, editInput);
      renderTasks();
    };

    editInput.addEventListener('blur', finalizeEdit);
    editInput.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        editInput.blur();
      }
    });
  }

  function handleFilterClick(e) {
    const btn = e.target;
    const filter = btn.dataset.filter;
    if (!filter) return;
    currentFilter = filter;
    // Update active button styling
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTasks();
  }

  // -------------------- Initialization --------------------
  document.addEventListener('DOMContentLoaded', () => {
    tasks = loadTasks();
    renderTasks();

    // Add task via button click
    const addBtn = document.getElementById('add-task-btn');
    if (addBtn) {
      addBtn.addEventListener('click', handleAddTask);
    }
    // Add task via Enter key on input field
    const input = document.getElementById('new-task-input');
    if (input) {
      input.addEventListener('keydown', ev => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          handleAddTask();
        }
      });
    }

    // Delegated listeners for task list actions
    const taskList = document.getElementById('task-list');
    if (taskList) {
      taskList.addEventListener('change', e => {
        if (e.target.matches('.toggle-complete')) {
          handleToggleComplete(e);
        }
      });
      taskList.addEventListener('click', e => {
        if (e.target.matches('.delete-task')) {
          handleDeleteTask(e);
        } else if (e.target.matches('.edit-task')) {
          handleEditTask(e);
        }
      });
    }

    // Filter buttons
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', handleFilterClick);
    });
  });
})();

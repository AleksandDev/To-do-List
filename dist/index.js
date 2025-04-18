var TodoApp = /** @class */ (function () {
    function TodoApp(taskList) {
        this.tasks = [];
        this.nextId = 1;
        this.taskList = taskList;
        this.loadTasks();
    }
    TodoApp.prototype.add = function (title) {
        var task = { id: this.nextId++, title: title, completed: false };
        this.tasks.push(task);
        this.saveTasks();
        this.render();
    };
    TodoApp.prototype.delete = function (id) {
        this.tasks = this.tasks.filter(function (task) { return task.id !== id; });
        this.saveTasks();
        this.render();
    };
    TodoApp.prototype.toggleComplete = function (id) {
        var task = this.tasks.find(function (task) { return task.id === id; });
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    };
    TodoApp.prototype.saveTasks = function () {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    };
    TodoApp.prototype.loadTasks = function () {
        var tasksJson = localStorage.getItem('tasks');
        if (tasksJson) {
            this.tasks = JSON.parse(tasksJson);
            this.nextId = this.tasks.length > 0 ? Math.max.apply(Math, this.tasks.map(function (task) { return task.id; })) + 1 : 1;
            this.render();
        }
    };
    TodoApp.prototype.clearTasks = function () {
        localStorage.clear();
        this.tasks = [];
        this.render();
    };
    TodoApp.prototype.render = function () {
        var _this = this;
        this.taskList.innerHTML = '';
        this.tasks.forEach(function (task) {
            var li = document.createElement('li');
            li.className = "taskInput";
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', function () { return _this.toggleComplete(task.id); });
            var title = document.createElement('p');
            title.textContent = task.title;
            if (task.completed) {
                title.style.textDecoration = "line-through";
            }
            var button = document.createElement('button');
            button.className = "taskDelete";
            button.textContent = 'Delete';
            button.addEventListener('click', function () { return _this.delete(task.id); });
            var buttonClear = document.createElement('button');
            buttonClear.className = "taskClear";
            buttonClear.textContent = 'Limpar Lista';
            buttonClear.addEventListener('click', function () { return _this.clearTasks(); });
            li.appendChild(checkbox);
            li.appendChild(title);
            li.appendChild(button);
            _this.taskList.appendChild(li);
        });
    };
    return TodoApp;
}());
document.addEventListener('DOMContentLoaded', function () {
    var taskList = document.getElementById('taskList');
    var taskAdd = document.getElementById('taskAdd');
    var taskNew = document.getElementById('taskNew');
    var taskClear = document.getElementById('taskClear');
    var todoApp = new TodoApp(taskList);
    taskAdd.addEventListener('click', function () {
        var title = taskNew.value.trim();
        if (title) {
            todoApp.add(title);
            taskNew.value = '';
        }
        else {
            alert('Por favor, insira uma tarefa.');
        }
    });
    taskClear.addEventListener('click', function () {
        if (taskList.childElementCount === 0) {
            alert('Não há tarefas a serem excluídas.');
        }
        else if (confirm('Deseja realmente limpar a lista de tarefas?')) {
            todoApp.clearTasks();
        }
    });
});

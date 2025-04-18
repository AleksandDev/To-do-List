  interface Task {
    id: number;
    title: string;
    completed: boolean;
  }

  class TodoApp {
    private taskList: HTMLUListElement;
    private tasks: Task[] = [];
    private nextId: number = 1;

    constructor(taskList: HTMLUListElement) {
      this.taskList = taskList;
      this.loadTasks();
    }

    add(title: string): void {
      const task: Task = { id: this.nextId++, title, completed: false };
      this.tasks.push(task);
      this.saveTasks();
      this.render();
    }

    delete(id: number): void {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.saveTasks();
      this.render();
    }

    toggleComplete(id: number): void {
      const task = this.tasks.find(task => task.id === id);
      if (task) {
        task.completed = !task.completed;
        this.saveTasks();
        this.render();
      }
    }

    private saveTasks(): void {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    private loadTasks(): void {
      const tasksJson = localStorage.getItem('tasks');
      if (tasksJson) {
        this.tasks = JSON.parse(tasksJson);
        this.nextId = this.tasks.length > 0 ? Math.max(...this.tasks.map(task => task.id)) + 1 : 1;
        this.render();
      }
    }

    public clearTasks(): void {
      localStorage.clear();
      this.tasks = [];
      this.render();
    }

    private render(): void {
      this.taskList.innerHTML = '';
      this.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = "taskInput";

        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => this.toggleComplete(task.id));

        const title = document.createElement('p');
        title.textContent = task.title;
        if (task.completed) {
          title.style.textDecoration = "line-through";
        }

        const button = document.createElement('button');
        button.className = "taskDelete";
        button.textContent = 'Delete';
        button.addEventListener('click', () => this.delete(task.id));

        const buttonClear = document.createElement('button');
        buttonClear.className = "taskClear";
        buttonClear.textContent = 'Limpar Lista';
        buttonClear.addEventListener('click', () => this.clearTasks());

        li.appendChild(checkbox);
        li.appendChild(title);
        li.appendChild(button);

        this.taskList.appendChild(li);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList') as HTMLUListElement;
    const taskAdd = document.getElementById('taskAdd') as HTMLButtonElement;
    const taskNew = document.getElementById('taskNew') as HTMLInputElement;
    const taskClear = document.getElementById('taskClear') as HTMLButtonElement;

    const todoApp = new TodoApp(taskList);

    taskAdd.addEventListener('click', () => {
      const title = taskNew.value.trim();
      if (title) {
        todoApp.add(title);
        taskNew.value = '';
      } else {
        alert('Por favor, insira uma tarefa.');
      }
    });

    taskClear.addEventListener('click', () => {
      if (taskList.childElementCount === 0){
          alert('Não há tarefas a serem excluídas.');
    }
      else if(confirm('Deseja realmente limpar a lista de tarefas?')) {
          todoApp.clearTasks();
  }
    });

  });


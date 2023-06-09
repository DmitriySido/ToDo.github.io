const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const taskList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

let tasks = []

if(localStorage.getItem('tasks')){
	tasks = JSON.parse(localStorage.getItem('tasks'))
	tasks.forEach((task) => renderTask(task)) //Рендерим задачу на странице
}

checkEmptyList()

//Добавление задачи
form.addEventListener('submit', addTask)

//Удаление задачи
taskList.addEventListener('click', deleteTask)

//Отмучаем задачу Выполненой
taskList.addEventListener('click', doneTask)

//Функции
function addTask(event){
	//Отменяем отправку формы
	event.preventDefault()

	//Достаем текст задачи из поля ввода
	const taskText = taskInput.value

	//Описываем задачу в виде объекта
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false
	}

	//Дoбавим задачу в массив с задачами
	tasks.push(newTask)

	//Сохранение задачи
	saveToLocalStorage()

	//Рендерим задачу на странице
	renderTask(newTask)

	//Очищаем поле ввода и аозвращаем фокус на него
	taskInput.value = ''
	taskInput.focus()

	checkEmptyList()
}

function deleteTask(event){
	//Проверяем если клик был НЕ по кнопке *Удалить задачу*
	if(event.target.dataset.action !== 'delete') return

	//Проверяем что клик был по кнопку *Удалить задачу*
	const parentNode = event.target.closest('li')

	//Определяем ID задачи
	const id = Number(parentNode.id)

	//Находим индекс задачи в массиве
	const index = tasks.findIndex((task) => task.id === id)

	//Удаляем задачу из массива
	tasks.splice(index, 1)

	//Сохранение задачи
	saveToLocalStorage()

	//Удаляем из разметки задачу
	parentNode.remove()

	checkEmptyList()
}

function doneTask(event){
	//Проверяем если клик был НЕ по кнопке *Задача выполнена*
	if(event.target.dataset.action !== 'done') return

	//Проверяем что клик был по кнопке *Задача выполнена*
	const parentNode = event.target.closest('li')
	
	//Определяем ID задачи
	const id = Number(parentNode.id)
	const task = tasks.find((task) => task.id === id)
	task.done = !task.done

	//Сохранение задачи
	saveToLocalStorage()

	const taskTitle = parentNode.querySelector('.task-text')
	taskTitle.classList.toggle('task-text--done')
}

function checkEmptyList(){
	if(tasks.length === 0){
		const emptyListHTML = `
				<li id="emptyList">Your to-do list is empty!</li>`

		taskList.insertAdjacentHTML('afterbegin', emptyListHTML)
	}

	if(tasks.length > 0){
		const emptyListElement = document.querySelector('#emptyList')
		emptyListElement ? emptyListElement.remove() : null
	}
}

function saveToLocalStorage(){
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task){
	//Формируем CSS Класс
	const cssClass = task.done ? "task-text task-text--done" : "task-text"

	//формируем разметку для новой задачи
	const taskHTML = `
			<li class="task" id="${task.id}">
				<p class="${cssClass}">${task.text}</p>
				<div class="task-button__wrapper">
					<button class="task-button done" data-action="done">
						<img class="button-img" src="img/check-mark.png" alt="Done Button">
					</button>
					<button class="task-button delete" data-action="delete">
						<img class="button-img" src="img/check-mark__delete.png" alt="Delete Button">
					</button>
				</div>
			</li>`

	//Добавляем задачу на страницу
	taskList.insertAdjacentHTML('beforeend', taskHTML)
}
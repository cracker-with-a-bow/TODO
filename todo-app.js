(function () {

    let listArray = [];
    let listName = '';

    //создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    //создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';


        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    //создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    let whatTodoAtTheFirst1 = {
        task1: {
            name: '1', done: 'true',
        },
        task2: {
            name: '2', done: 'false',
        },
        task3: {
            name: '3', done: 'true',
        },
    }

    let whatTodoAtTheFirst = [
        {
           id:1, name: '1', done: true,
        },
        {
            id:2, name: '2', done: false,
        },
        {
            id:3, name: '3', done: true,
        },
    ]

    function createTodoItem(objOfTasks) {
        let item = document.createElement('li');
        //кнопки помещаем в один элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        //устанавливаем стили для элемента списка, а также для размещения кнопок
        //в его правой части с помощью флекс
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        
        

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'удалить';

        //tasks.task3.name = text;
        item.textContent = objOfTasks.name;
        if (objOfTasks.done == 'true') {
            item.classList.add('list-group-item-success');
        }
            
        //добавляем обработчики на кнопки
        doneButton.addEventListener('click', function () {
            item.classList.toggle('list-group-item-success');
            for (const listItem of listArray) {
                if (listItem.id == objOfTasks.id) {
                    listItem.done = !listItem.done;
                    
                }
                
            }
            saveList(listArray, listName);
        });
        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                item.remove();
                for (i = 0; i < listArray.length; i++){
                    if (listArray[i].id == objOfTasks.id) {
                        listArray.splice(i, 1);
                        saveList(listArray, listName);
                    }
                }
            }
        });



        //вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);




        //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function saveList(arr, keyName) {
       localStorage.setItem(keyName ,JSON.stringify(arr));
    };

    function getNewID (arr) {
        let max = 0;
        for (const item of arr) {
            if (item.id > max) {
                max=item.id;
            }
        }
        return max + 1;
    };


    function createTodoApp(container, title = 'список дел', keyName) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        let todoItem;
        listName = keyName;
        listArray = whatTodoAtTheFirst;
        console.log(whatTodoAtTheFirst);
        console.log(listArray);

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let localData = localStorage.getItem(listName);
        if (localData !== null && localData !== '') {
            listArray = JSON.parse(localData)
            console.log(listArray);
        }

        for (const itemList of listArray) {
            todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        };

        // те задачи, которые сначала

        /*
       tasks = whatTodoAtTheFirst;

        for (let key in tasks) {
            todoItem = createTodoItem(tasks[key]);
            todoList.append(todoItem.item);        
        }*/
        

    todoItemForm.form[1].disabled = true;
    //если пользователь ничего не ввел, то кнопка disabled
    todoItemForm.form.addEventListener('input', function (e) {
        if (todoItemForm.input.value == "") {
            todoItemForm.form[1].disabled = true;
        }
        todoItemForm.form[1].disabled = false;
    });

    //браузер создает событие submit на форме по нажатию на enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {
        //эта строчка необходима, чтобы предотвратить стандартное действие браузера
        //в данном случае мы не хотим, чтобы страница презагружалась при отправке формы
        e.preventDefault();

        //игнорируем создание элемента, если пользователь ничего не ввел
        if (!todoItemForm.input.value) {
            todoItemForm.form[1].disabled = true;
            return;
        }
   
        
        newTasks = {
            id: getNewID(listArray),
            name: todoItemForm.input.value,
            done: false,
        },

        todoItem = createTodoItem(newTasks);
        todoItemForm.form[1].disabled = true;

        listArray.push(newTasks);
        saveList(listArray, listName);
        //console.log(newTasks);
        //console.log(tasks);

        //содаем и добавляем в список новое дело с названием из поля для ввода
        todoList.append(todoItem.item);

        //обнуляем значение в поле, чтобы не пришлось стирать его вручную
        todoItemForm.input.value = '';

        /*localStorage.setItem('myCat', 'Tom');
        let cat = localStorage.getItem('myCat');
        console.log(cat);*/
    });
}
 


    

    window.createTodoApp = createTodoApp;

}) ();
const todos =JSON.parse(localStorage.getItem('todos')) || [];

function createList(id,title,isComplete){
  // li 
    const li = document.createElement("li")
    li.classList.add('task-card')
    // span
    const titleSpan = document.createElement("span")
    titleSpan.id = `todo-${id}`
    titleSpan.classList.add('task-text')
    titleSpan.innerHTML = title
    // task div
    const taskActionsDiv = document.createElement("div")
    taskActionsDiv.classList.add("task-actions")
    // edit btn
    const editButon = document.createElement("button")
    editButon.id = `edit-btn-${id}`
    editButon.classList.add("edit-btn")
    editButon.onclick = ()=>editTodo(id)
    editButon.innerHTML = "edit"
    editButon.classList.add('edit')
    editButon.setAttribute('aria-label', `Edit task ${title}`);
    // complete btn
    const completeBtn = document.createElement("button")
    completeBtn.id = `complete-btn-${id}`
    completeBtn.onclick = ()=>markComplete(id)
    completeBtn.classList.add('complete-btn')
    completeBtn.innerHTML = "Complete"
    completeBtn.setAttribute('aria-label', `complete task ${title}`);
    // delete btn
    const deleteButton = document.createElement("button")
    deleteButton.classList.add('delete-btn')
    deleteButton.onclick = ()=>deleteTodo(id)
    deleteButton.innerHTML = "delete"
    deleteButton.setAttribute('aria-label', `delete task ${title}`);
    
    li.appendChild(titleSpan)
    if(isComplete){
     titleSpan.classList.add('completed')
     li.classList.add('completed')
    }
    else{
     taskActionsDiv.appendChild(editButon)
     taskActionsDiv.appendChild(completeBtn)
     li.classList.add('active')
    }
    taskActionsDiv.appendChild(deleteButton)
    li.appendChild(taskActionsDiv)
    return li
}


function renderTodo(){
   const ul = document.getElementById("task-list")
   ul.innerHTML = ""
   if(todos.length === 0) {
    const div = document.createElement("div")
    div.id = "emptydiv"
    div.innerHTML = "no task found"
    div.setAttribute('role', 'listitem');
    ul.appendChild(div)
    return
   } 
    todos.forEach((todo)=>{
        const li = createList(todo.id,todo.title,todo.isComplete)
        ul.appendChild(li)
    })
}

function renderActiveTodo(){
   const ul = document.getElementById("task-list")
   ul.innerHTML = ""
   const activeTodos = todos.filter((todo)=>!todo.isComplete)
   if(activeTodos.length === 0) {
    const div = document.createElement("div")
    div.id = "emptydiv"
    div.innerHTML = "no task found"
    div.setAttribute('role', 'listitem');
    ul.appendChild(div)
    return
   } 
    activeTodos.forEach((todo)=>{
        const li = createList(todo.id,todo.title,todo.isComplete)
        ul.appendChild(li)
    })
}

function renderCompletedTodo(){
   const ul = document.getElementById("task-list")
   ul.innerHTML = ""
   const completedTodos = todos.filter((todo)=>todo.isComplete)
   if(completedTodos.length === 0) {
    const div = document.createElement("div")
    div.id = "emptydiv"
    div.innerHTML = "no task found"
    div.setAttribute('role', 'listitem');
    ul.appendChild(div)
    return
   } 
    completedTodos.forEach((todo)=>{
        const li = createList(todo.id,todo.title,todo.isComplete)
        ul.appendChild(li)
    })
}


function editTodo(id){    
 const editInput = document.getElementById('editInput')
 const savebtn = document.getElementById('saveBtn')
 savebtn.onclick = ()=>saveTask(id)
 const todo = todos.find((todo)=>todo.id == id)
 editInput.value = todo.title
  openModal()
}


function openModal(){
  const modal = document.getElementById('editModal')
  modal.classList.add('visible')
}


function closeModal(){
  document.getElementById('editInput').value = ""
  document.getElementById("modalError").innerHTML = ""
  const modal = document.getElementById('editModal')
  modal.classList.remove('visible')
}


function saveTask(id){
    const error = document.getElementById("modalError")
    const updatedValue = document.getElementById('editInput').value
        if(!updatedValue || updatedValue.trim().length === 0){
        error.innerHTML = "please enter a value"
       return
    }
  const updatedTodos = todos.map(todo =>
    todo.id === id
      ? { ...todo, title: updatedValue }
      : todo
  );
  localStorage.setItem('todos', JSON.stringify(updatedTodos));
  const todo = todos.find((todo)=>todo.id == id)
  todo.title = updatedValue
  document.getElementById(`todo-${id}`).innerHTML = updatedValue
  closeModal()
}


function createId(){
    const id = crypto.randomUUID();
    return id
}

function markComplete(id){    
    const todo = todos.find((todo)=>todo.id == id)
      const updatedTodos = todos.map(todo =>
    todo.id === id
      ? { ...todo, isComplete: true }
      : todo
  );
  localStorage.setItem('todos', JSON.stringify(updatedTodos));

    todo.isComplete = true
    const span = document.getElementById(`todo-${id}`)
    span.parentElement.classList.add('done')
    const editButon = document.getElementById(`edit-btn-${id}`)
    const completeButton = document.getElementById(`complete-btn-${id}`)
    const activeTab = document.querySelector('.tab.tab-active')
    const tabName = activeTab.getAttribute('data-tab')
    if(tabName === "active"){  
     span.parentElement.remove()   
    }
    else{
     editButon.remove()
     completeButton.remove()
    }
}


function deleteTodo(id){
    const index = todos.findIndex(todo => todo.id === id)
   if (index !== -1) {
    const filtered = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(filtered));
   const span = document.getElementById(`todo-${id}`)
   span.parentElement.remove()

   todos.splice(index, 1);
  }
    if(todos.length === 0) {
    const ul = document.getElementById("task-list")
    const div = document.createElement("div")
    div.id = "emptydiv"
    div.innerHTML = "no task found"
    div.setAttribute('role', 'listitem');
    ul.appendChild(div)
  }
}


function createTodo(e){
    e.preventDefault()
    const ul = document.getElementById("task-list")
    const error = document.getElementById("error-message")
    const inputValue = document.getElementById("task-input").value
    if(!inputValue || inputValue.trim().length === 0){
      error.innerHTML = "please enter a value"
      return
    }
    error.innerHTML = ""
    const id = createId()
      localStorage.setItem('todos', JSON.stringify([
        ...todos,
          {
          id,
          title:inputValue,
          isComplete:false
        }
      ]));
      document.getElementById("emptydiv")?.remove()
    todos.push({id,title:inputValue,isComplete:false})
    const activeTab = document.querySelector('.tab.tab-active')
    const tabName = activeTab.getAttribute('data-tab')
    if(tabName === "active" || tabName === "all"){   
    const li = createList(id,inputValue,false)
    ul.appendChild(li)
    }
    document.getElementById("task-input").value = ""
    return
}


renderActiveTodo()

const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => {
      t.classList.remove('tab-active');
      t.setAttribute('aria-selected', 'false');
    });

    tab.classList.add('tab-active');
    tab.setAttribute('aria-selected', 'true');

    const tabName = tab.getAttribute('data-tab');
    if(tabName === "active"){
    renderActiveTodo()  
    }
    if(tabName === "completed"){
      renderCompletedTodo()
    }
    if(tabName === "all"){
      renderTodo()
    }
  });
});

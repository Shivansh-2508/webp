// Get reference to the form and todo container
const form = document.getElementById("form");
const todoContainer = document.getElementById("todo-container");

const spanDate = document.getElementById("date");
const spanMonth = document.getElementById("month");
const spanYear = document.getElementById("year");
const spanWeekday = document.getElementById("weekday");

function loadbody() {
  // console.log('body is loaded');
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  const myDate = date.getDate();
  const year = date.getFullYear();
  const day = date.toLocaleDateString("default", { weekday: "long" });

  spanDate.innerText = myDate;
  spanMonth.innerText = month;
  spanYear.innerText = year;
  spanWeekday.innerText = day;
}

// Add event listener to the form for submitting tasks
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get the task input value
  const taskInput = form["todos"].value.trim();

  // Add task to Firestore
  if (taskInput !== "") {
    db.ref("todos")
      .push()
      .set({
        task: taskInput,
      })
      .then(() => {
        // Clear the input field after adding task
        form.reset();
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
});

// Listen for changes in the todos collection in Firestore
db.ref("todos").on("value", (snapshot) => {
  // Clear existing todos
  todoContainer.innerHTML = "";

  // Loop through each todo in the snapshot
  snapshot.forEach((childSnapshot) => {
      const todoId = childSnapshot.key;
      const todo = childSnapshot.val().task;

      // Create a new todo item
      const todoItem = document.createElement("div");
      todoItem.classList.add("todo-item");
      todoItem.textContent = todo;

      // Create delete button for each todo item
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Done";
      deleteButton.classList.add("btn", "btn-danger", "btn-sm", "ml-2");
      deleteButton.onclick = () => deleteTask(todoId); // Call deleteTask function when clicked

      // Append the delete button to the todo item
      todoItem.appendChild(deleteButton);

      // Append the todo item to the todo container
      todoContainer.appendChild(todoItem);
  });
});

// Function to delete a task
function deleteTask(todoId) {
  db.ref("todos").child(todoId).remove()
      .then(() => {
          console.log("Task deleted successfully");
      })
      .catch((error) => {
          console.error("Error deleting task: ", error);
      });
}
// Function to logout and redirect to index.html
function logout() {
  // Add logout functionality here if needed

  // Redirect to index.html
  window.location.href = "index.html";
}

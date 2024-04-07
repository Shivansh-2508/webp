// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxy8YeGa2y4pZa-QukAbWqZBRts7OxWvY",
  authDomain: "todo-f7576.firebaseapp.com",
  projectId: "todo-f7576",
  storageBucket: "todo-f7576.appspot.com",
  messagingSenderId: "961072637187",
  appId: "1:961072637187:web:2edcec7e9ce6adebf9b536",
  measurementId: "G-W34K5JKWCP",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const listcontainer = document.getElementById("task-container");

$("button").on("click", function () {
  const taskInput = $("#input-box").val();
  if (taskInput === "") {
    alert("Write something");
  } else {
    db.collection("tasks")
      .add({
        task: taskInput,
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        // Clear input box after successful addition
        $("#input-box").val("");
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }
});

// Realtime listener for changes in tasks collection
db.collection("tasks").onSnapshot(function (snapshot) {
  listcontainer.innerHTML = ""; // Clear previous tasks
  snapshot.forEach(function (doc) {
    const task = doc.data().task;
    const taskId = doc.id;
    const li = $("<li>", {
      html: task,
      "data-task-id": taskId,
    });
    const span = $("<span>", {
      html: "\u00d7",
    });
    li.append(span);
    listcontainer.append(li);
  });
});

// Delete task from Firestore when delete button (span) is clicked
$("ul").on("click", "span", function (event) {
  const taskId = $(this).closest("li").data("task-id");
  db.collection("tasks")
    .doc(taskId)
    .delete()
    .then(function () {
      console.log("Document successfully deleted");
    })
    .catch(function (error) {
      console.error("Error removing document: ", error);
    });
});

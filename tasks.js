const fs=require('fs');
const fileName= process.argv[2] || "database.json";
/**
 * Starts the application
 * This is the function that is run when the app starts
 * 
 * It prints a welcome line, and then a line with "----",
 * then nothing.
 *  
 * @param  {string} name the name of the app
 * @returns {void}
 */
let tasks=[];
try {
  const data = fs.readFileSync(fileName, "utf8");
  tasks = JSON.parse(data);
} catch (err) {
  // If file doesn't exist or is empty, just start with an empty array
  tasks = [];
}
function hello(text){
    const parts = text.split(" "); // 
    if (parts.length > 1) {
        console.log(`hello ${parts.slice(1).join(" ")}!`);
    } else {
        console.log("hello!");
    }
}
function listTasks() {
  if (tasks.length === 0) {
    console.log("No tasks to show.");
  } else {
    for (let i = 0; i < tasks.length; i++) {
      let status = tasks[i].done ? "[✓]" : "[ ]";
      console.log(`${i + 1} - ${status} ${tasks[i].name}`);
    }
  }
}

function startApp(name){
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', onDataReceived);
  console.log(`Welcome to ${name}'s application!`)
  console.log("--------------------")
}


/**
 * Decides what to do depending on the data that was received
 * This function receives the input sent by the user.
 * 
 * For example, if the user entered 
 * ```
 * node tasks.js batata
 * ```
 * 
 * The text received would be "batata"
 * This function  then directs to other functions
 * 
 * @param  {string} text data typed by the user
 * @returns {void}
 */
function help(){
  console.log("Available commands:");
  console.log(" - hello [name]        : Greets you (hello or hello John)");
  console.log(" - list                : Shows all tasks");
  console.log(" - add <task text>     : Adds a new task");
  console.log(" - remove [n]          : Remove last task or task number n");
  console.log(" - edit [n] <new text> : Edit last task or task n");
  console.log(" - check <n>           : Mark task n as done");
  console.log(" - uncheck <n>         : Mark task n as not done");
  console.log(" - quit / exit         : Save and exit the app");
  console.log(" - help                : Shows this help menu");
}
function removeTask(text) {
  if (text === 'remove') {
    // Remove last task
    if (tasks.length === 0) {
      console.log("No tasks to remove.");
      return;
    }
    let removed = tasks.pop();
    console.log(`Removed task: "${removed.name}"`);
  } else {
    // Remove specific task by number
    let parts = text.split(" ");
    let index = parseInt(parts[1]) - 1;
    if (isNaN(index) || index < 0 || index >= tasks.length) {
      console.log("Invalid task number.");
      return;
    }
    let removed = tasks.splice(index, 1)[0];
    console.log(`Removed task: "${removed.name}"`);
  }
}

function addTask(text) {
  if (!text) {
    console.log("Error: please provide a task to add.");
    return;
  }
  tasks.push({ name : text, done: false });
  console.log(`Task added: "${text}"`);
}
function checkTask(index){
  if(index >= 0 && index < tasks.length){
    tasks[index].done = true;
    console.log(`task ${index+1} is marked as checked`);
  } else {
    console.log("No task with this number");
  }
}

function editTask(text) {
  let parts = text.split(" ");
  if (parts.length === 1) {
    console.log("Error: please provide new text for the task.");
    return;
  }

  let index = parts.length > 2 ? parseInt(parts[1]) - 1 : tasks.length - 1;
  let newText = parts.length > 2 ? parts.slice(2).join(" ") : parts.slice(1).join(" ");

  if (isNaN(index) || index < 0 || index >= tasks.length) {
    console.log("Invalid task number.");
    return;
  }

  tasks[index].name = newText;
  console.log(`Task ${index + 1} changed to "${newText}"`);
}
function uncheckTask(index) {
  if (index >= 0 && index < tasks.length) {
    tasks[index].done = false;
    console.log(`task ${index + 1} is marked as unchecked`);
  } else {
    console.log("No task with this number");
  }
}


function onDataReceived(text) {
    text=text.trim();

  if (text === 'quit'|| text==='exit') {
    
    quit();
  }
  else if(text.startsWith ('hello')){
    hello(text);
  }
    else if(text === 'help'){
    help();
    }
    else if (text === 'list') {
    listTasks();
}
else if (text.startsWith('add ')) {
    let taskText = text.slice(4).trim();
    addTask(taskText);
}
else if (text.startsWith('remove')) {
    removeTask(text);
}
else if (text.startsWith('edit')) {
    editTask(text);
}
else if(text.startsWith("check ")){
  let index = parseInt(text.substring(6)) - 1; 
  checkTask(index);
}
else if (text.startsWith('uncheck ')) {
  let index = parseInt(text.substring(8)) - 1;
  uncheckTask(index);
}
  else{
    unknownCommand(text);
  }
}


/**
 * prints "unknown command"
 * This function is supposed to run when all other commands have failed
 *
 * @param  {string} c the text received
 * @returns {void}
 */
function unknownCommand(c){
  console.log('unknown command: "'+c.trim()+'"')
}


/**
 * Says hello
 *
 * @returns {void}
 */



/**
 * Exits the application
 *
 * @returns {void}
 */
function quit(){
fs.writeFileSync(fileName, JSON.stringify(tasks, null, 2));
  console.log('Quitting now, goodbye!')
  process.exit();
}

// The following line starts the application
startApp("AbedAlMajid")
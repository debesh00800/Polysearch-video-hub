// Declare a variable in a wider scope (e.g., global scope)
var sharedValue;

// Function 1: Assigns a value to the shared variable
function function1() {
  sharedValue = "Hello from Function 1";
}

// Function 2: Accesses the shared variable
function function2() {
  console.log(sharedValue); // Use the shared value in Function 2
}

// Call the functions
function1(); // Call Function 1 to set the shared value
function2(); // Call Function 2 to use the shared value

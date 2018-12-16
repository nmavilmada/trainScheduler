
//   Initialize Firebase
  var config = {
    apiKey: "AIzaSyCcWvwpF6LD2kK2xYlEjUWbOAq8DV7tTsk",
    authDomain: "trainscheduler-091684.firebaseapp.com",
    databaseURL: "https://trainscheduler-091684.firebaseio.com",
    projectId: "trainscheduler-091684",
    storageBucket: "",
    messagingSenderId: "45878825714"
  };
  firebase.initializeApp(config);

  var dataBase = firebase.database();

//button to add new train to the schedule
$("#newTrainAdd").on("click",function(trainEvent){

//add prevent.default to prevent auto submission
trainEvent.preventDefault();

//grab user input and store in a variable
var nameInput = $("#trainNameInput").val().trim();
var destinationInput = $("#destination").val().trim();
var firstDepartureInput = moment($("#firstTrainTime").val().trim(),"HH:mm").format("HH:mm");
var frequencyInput = $("#frequency").val().trim();
var frequencyInputInMins = frequencyInput
//create local object variable to hold the data 
var newTrain = {
        trainName: nameInput,
        destinationName: destinationInput,
        firstDepartureTime: firstDepartureInput,
        frequency: frequencyInputInMins
};

// upload new train information to the database
dataBase.ref().push(newTrain);

//console log to veryfiy that new train information has been submitted to the local database.

console.log(newTrain.trainName);
console.log(newTrain.destinationName);
console.log(newTrain.firstDepartureTime);
console.log(newTrain.frequency);

// clear the data input form once the submit button is clicked.

$("#trainNameInput").val("");
$("#destination").val("");
$("#firstTrainTime").val("")
$("#frequency").val("")

});

// Creating Firebase event for adding employee to the database and a row in the html when a user adds an entry
dataBase.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var nameInput = childSnapshot.val().trainName;
    var destinationInput = childSnapshot.val().destinationName;
    var firstDepartureInput = childSnapshot.val().firstDepartureTime;
    var frequencyInputInMins = childSnapshot.val().frequency;
  
    // Train Information
    console.log(nameInput);
    console.log(destinationInput);
    console.log(firstDepartureInput);
    console.log(frequencyInputInMins);

// Function to determine the next train arrival time
var firstDepartureInput ;

function nextTrain(firstDepartureInput,frequencyInputInMins){
    
    //  This will provide the current time 
    var currentTime = moment();
    //  This will format the first train departure time to military time and store it in "firstTrainTime"
    var firstTrainTime = moment(firstDepartureInput,"HH:mm")

    // Calculate the difference between the current time and first train departure time and convert it to minutes
    var timeDifference = moment.duration(currentTime.diff(firstTrainTime)).asMinutes();

    // Minutes remaining for the next train
    var minutesRemaining = timeDifference%frequencyInputInMins;

    //  calculate the next train arriival time
    // (currentTime-minutesRemaining)+train Interval

    return currentTime.subtract(minutesRemaining,"minutes").add(frequencyInputInMins,"minutes").format("HH.mm")
    
}

  var nextTrainTime = nextTrain(firstDepartureInput,frequencyInputInMins);
  console.log(nextTrain(firstDepartureInput,frequencyInputInMins));

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(nameInput),
        $("<td>").text(destinationInput),
        $("<td>").text(firstDepartureInput),
        $("<td>").text(frequencyInputInMins),
        $("<td>").text(nextTrainTime),
      );
    
      // Append the new row to the table
      $("#train-table > tbody").append(newRow);
});
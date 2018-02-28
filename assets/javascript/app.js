window.onload = function() {

 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyCTCvn5-nM73Nu1A-w25oa554hmLaxZl8Q",
    authDomain: "train-scheduler-321c9.firebaseapp.com",
    databaseURL: "https://train-scheduler-321c9.firebaseio.com",
    projectId: "train-scheduler-321c9",
    storageBucket: "train-scheduler-321c9.appspot.com",
    messagingSenderId: "1030667431613"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName = "";
  var destination = "";
  var trainTime;
  var frequency = 0;
  var minutesAway;
  var nextArrival;

$("#submit").on("click", function(){
    event.preventDefault();
    
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var trainTime = $("#trainTime").val().trim();
    var frequency = $("#frequency").val().trim();

    database.ref().push({
        name: trainName,
        destination: destination,
        firstTrain: trainTime,
        frequency: frequency
    });
    
    //clear form after user hits submit
    function emptyInput(){
        $("input").val("");         
    }

    // function calculateNextArrival(){
    //     var trainTimeNum = parseInt(trainTime);
    //     console.log(trainTimeNum);
    // }
   
    // calculateNextArrival();
    // alert("Train has successfully been submitted!");

    emptyInput();
    });

    database.ref().on("child_added", function(snapshot){

        var tName = snapshot.val().name;
        var tDestination = snapshot.val().destination;
        var tTime = snapshot.val().firstTrain;
        var tFrequency = snapshot.val().frequency;

        console.log(snapshot.val());
        console.log(snapshot.val().name);
        console.log(snapshot.val().destination);
        console.log(snapshot.val().firstTrian);
        console.log(snapshot.val().frequency);

        console.log("FirstTrain: " + tTime);

        var tTimeConverted = moment(tTime, "HH:mm");
        console.log("TIME CONVERTED: " + tTimeConverted);
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));
        var diffTime = moment().diff(moment(tTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
        var tRemainder = diffTime % tFrequency;
        console.log("remainder: " + tRemainder);
        var minutesTillTrain = (tFrequency - tRemainder);
        console.log("minTilTrain: " + minutesTillTrain);
        var nextTrain = moment().add(minutesTillTrain, "minutes").format("HH:mm");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

        var tBody = $("#trainTable");
        var tRow = $("<tr>");
        var trainTd = $("<td>").text(tName);
        var destinationTd = $("<td>").text(tDestination);
        var trainTimeTd = $("<td>").text(nextTrain);
        var frequencyTd = $("<td>").text(tFrequency);
        var minutesAwayTd = $("<td>").text(minutesTillTrain);
        
        // Append the newly created table data to the table row
        tRow.append(trainTd, destinationTd, frequencyTd, trainTimeTd, minutesTillTrain);
        // Append the table row to the table body
        tBody.append(tRow);
    
    }, function(errorObject){
        console.log("The read failed: " + errorObject.code)      
    })
}

//NEED TO DO:
//store data into Firebase 
//use moment.js to calculate next Arrival and Minutes Away
    //turn trainTime input into integer
    //turn frequency input into integer
    // add frequency to trainTime = Next Arrival
    //use .fromNow() (from Next Arrival) to calculate Minutes Away
    //next arrival - current time = minutes away OR
        //current time - next arrival = minutes away
  //** MAYBE USE FUNCTION moment(time).fromNow() and moment.duration(result).humanize() OR .as('minutes')

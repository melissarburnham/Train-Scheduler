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
  var trainCount = 0;

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

    emptyInput();
    });

    database.ref().on("child_added", function(snapshot){

        var sv = snapshot.val();
        var tName = sv.name;
        var tDestination = sv.destination;
        var tTime = sv.firstTrain;
        var tFrequency = sv.frequency;
        
        console.log(sv);
        console.log(sv.name);
        console.log(sv.destination);
        console.log(sv.firstTrian);
        console.log(sv.frequency);

        console.log("FirstTrain: " + tTime);
        //CONVERTS AND CALCULATES TIME FIRST ARRIVAL...
        //...AND MINUTES AWAY
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
        var nextTrain = moment().add(minutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

        var tBody = $("#trainTable");
        var tRow = $("<tr>");
        var trainTd = $("<td>").text(tName);
        var destinationTd = $("<td>").text(tDestination);
        var trainTimeTd = $("<td>").text(nextTrain.format("LT"));
        var frequencyTd = $("<td>").text(tFrequency);
        var minutesAwayTd = $("<td>").text(minutesTillTrain);
        var button = $("<td>").html($("<button>"));
        button.attr("data-delete", trainCount);
        button.addClass("deleteButton");
        button.text("DELETE");
        
        tRow.attr("id", "train-" + trainCount);
        // Append the newly created table data to the table row
        tRow.append(trainTd, destinationTd, frequencyTd, trainTimeTd, minutesTillTrain, button);
        // Append the table row to the table body
        tBody.append(tRow);

        trainCount++;

        $(document.body).on("click", ".deleteButton", function() {
            var trainNumber = $(this).attr("data-delete");
            
            $("#train-" + trainNumber).remove();  

          });

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

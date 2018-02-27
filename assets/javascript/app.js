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
  var nextArrival;
  var minutesAway;


$("#submit").on("click", function(){
    event.preventDefault();

    function createRows(){
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var trainTime = $("#trainTime").val().trim();
    var frequency = $("#frequency").val().trim();

    database.ref().set({
        Name: trainName,
        Destination: destination,
        Departure: trainTime,
        Frequency: frequency
    });

    //dynamically creates a row for each submission
    var tBody = $("#trainTable");
    var tRow = $("<tr>");
    var trainTd = $("<td>").text(trainName);
    var destinationTd = $("<td>").text(destination);
    var trainTimeTd = $("<td>").text(trainTime);
    var frequencyTd = $("<td>").text(frequency);
    // Append the newly created table data to the table row
    tRow.append(trainTd, destinationTd, frequencyTd, trainTimeTd);
    // Append the table row to the table body
    tBody.append(tRow);
    console.log(trainTimeTd);
    }

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
    createRows();
    emptyInput();

    database.ref().on("value", function(snapshot){
        
        console.log(snapshot.val().Name);
        console.log(snapshot.val().Destination);
        console.log(snapshot.val().Departure);
        console.log(snapshot.val().Frequency);
    
        trainName.text(snapshot.val().Name);
        destination.text(snapshot.val().Destination);
        trainTime.text(snapshot.val().Departure);
        frequency.text(snapshot.val().Freqeuncy);

    }, function(errorObject){
        console.log("The read failed: " + errorObject.cod)
                
        })
    });
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

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
var trains = database.ref("/trains");

var trainName = "";
var destination = "";
var trainTime;
var frequency = 0;
var minutesAway;
var nextArrival;
var trainCount = 0;

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccess: function(currentUser, credential, redirectUrl) {
        return true;
    },
},
    signInFlow: 'popup',
    signInSuccessUrl: '<https://melissarburnham.github.io/Train-Scheduler/>',
    signInOptions: [
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ]
  };

ui.start('#firebaseui-auth-container', uiConfig);

$(".login").on("click", function(){

    var provider = new firebase.auth.GithubAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        window.location.href = "app.html";;
        console.log(result.user);
        // ...
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        // ...
      });
     });
    
$(".logout").on("click", function(){
    firebase.auth().signOut().then(function() {
        window.location.href = "index.html";;
        }).catch(function(error) {
    });
    });

$("#submit").on("click", function(){
    event.preventDefault();
    
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var trainTime = $("#trainTime").val().trim();
    var frequency = $("#frequency").val().trim();
    

    trains.push({
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
    window.reload();
    });

trains.on("child_added", function(snapshot){

    var sv = snapshot.val();
    var key = snapshot.key;
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
    var tTimeConverted = moment(tTime, "HH:mm").subtract(1, "years");
    console.log("TIME CONVERTED: " + tTimeConverted);
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));
    var diffTime = moment().diff(moment(tTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    var tRemainder = diffTime % tFrequency;
    console.log("remainder: " + tRemainder);
    var minutesTillTrain = tFrequency - tRemainder;
    console.log("minTilTrain: " + minutesTillTrain);
    var nextTrain = moment().add(minutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));


    //dynamically creates a row for each train
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
    //delete train
    $(".deleteButton").on("click", function() {
        alert("Train removal was a success"); 
        var trainNumber = $(this).attr("data-delete");
        firebase.database().ref().child("trains/" + key).remove();
        $("#train-" + trainNumber).remove();
        window.reload();
        });
}, function(errorObject){
    console.log("The read failed: " + errorObject.code)      
})   
}


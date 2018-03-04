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
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '<https://melissarburnham.github.io/Train-Scheduler/>',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ]
  };

  // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);


    var provider = new firebase.auth.GithubAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });

      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });




// $(".container").hide();

// function login(){
   
//     var provider = new firebase.auth.GithubAuthProvider();
//     firebase.auth().signInWithPopup(provider).then(function(result) {
//         var token = result.credential.accessToken;
//         var user = result.user;

//         console.log(user);
//       }).catch(function(error) {
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         var email = error.email;
//         var credential = error.credential;
//         console.log(errorMessage);
//       });
//   }
// $(".login").on("click", function(){
//     login();
//     $(".container").show();
// });
    

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

        
        // setInterval(function(){
        //     $(trainTimeTd).load( "https://melissarburnham.github.io/Train-Scheduler/");
        //   }, 5000);

        $(document.body).on("click", ".deleteButton", function() {
            var trainNumber = $(this).attr("data-delete");
            firebase.database().ref().child("trains/" + key).remove();
            $("#train-" + trainNumber).remove();  
            alert('Train was successfully removed');
            
          });

    }, function(errorObject){
        console.log("The read failed: " + errorObject.code)      
    })   
}


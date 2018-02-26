window.onload = function() {

$("#submit").on("click", function(){
    event.preventDefault();

    function createRows(){
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var trainTime = $("#trainTime").val().trim();
    var frequency = $("#frequency").val().trim();

    
    var tBody = $("#trainTable");
    var tRow = $("<tr>");
    var trainTd = $("<td>").text(trainName);
    var destinationTd = $("<td>").text(destination);
    var trainTimeTd = $("<td>").text(trainTime);
    var frequencyTD = $("<td>").text(frequency);
    // Append the newly created table data to the table row
    tRow.append(trainTd, destinationTd, frequencyTD, trainTimeTd);
    // Append the table row to the table body
    tBody.append(tRow);
    console.log(trainTimeTd);
    }
    
    function emptyInput(){
        $("input").val("");         
    }

    createRows();
    emptyInput();
    // alert("Train has successfully been submitted!");
});
}

//NEED TO DO:
//store input in local storage
//use moment.js to calculate next Arrival and Minutes Away
    //parseInt ---> trainTime input + frequency = Next Arrival
    //next arrival - current time = minutes away OR
        //current time - next arrival = minutes away
  //** MAYBE USE FUNCTION moment(time).fromNow() and moment.duration(result).humanize() OR .as('minutes')

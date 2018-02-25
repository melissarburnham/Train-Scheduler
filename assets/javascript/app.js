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
    }
    function emptyInput(){
        $("#trainName").val(" ");
        $("#destination").val(" ");
        $("#trainTime").val(" ");
        $("#frequency").val(" ");          
    }
    createRows();
    emptyInput();
    // alert("Train has successfully been submitted!");
});


//NEED TO DO:
//store input in local storage
//use moment.js to calculate next Arrival and Minutes Away

$(document).ready(function() {
    // firebase initialization
    var firebaseConfig = {
        apiKey: "AIzaSyBjIrGE0NiiJRgimq1z5c1x9KY0SgME4uE",
        authDomain: "train-scheduler-99b0e.firebaseapp.com",
        databaseURL: "https://train-scheduler-99b0e.firebaseio.com",
        projectId: "train-scheduler-99b0e",
        storageBucket: "train-scheduler-99b0e.appspot.com",
        messagingSenderId: "523533296134",
        appId: "1:523533296134:web:a0dc5fddd4937f886cd987"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    // onclick function for input submits
    $("#trainButton").on("click", function(event) {
        event.preventDefault();
        // vars for inputs
        trainName = $("#trainName").val().trim();
        trainDestination = $("#trainDestination").val().trim();
        firstTrainTime = $("#trainTime").val().trim();
        trainFrequency = $("#trainFrequency") .val().trim();
        
        // temp object to hold inputs
        newTrain = {
            name: trainName,
            destination: trainDestination,
            firstTime: firstTrainTime,
            frequency: trainFrequency
        };

        // push data to firebase
        database.ref().push(newTrain);

        // console.log(newTrain.name);
        // console.log(newTrain.destination);
        // console.log(newTrain.firstTime);
        // console.log(newTrain.frequency);

        // clear input values
        $("#trainName").val("");
        $("#trainDestination").val("");
        $("#trainTime").val("");
        $("#trainFrequency") .val("");
    });

    // firebase event for new submits
    database.ref().on("child_added", function(childSnapshot) {
        // console.log(childSnapshot.val());

        // vars for snapshots
        trainName = childSnapshot.val().name;
        trainDestination = childSnapshot.val().destination;
        firstTrainTime = childSnapshot.val().firstTime;
        trainFrequency = childSnapshot.val().frequency;
        
        // console.log(trainName);
        // console.log(trainDestination);
        // console.log(firstTrainTime);
        // console.log(trainFrequency);

        // calculations for arrivals/how far away + current time bug fix
        firstTrainTimeConversion = moment(firstTrainTime, "hh:mm a").subtract(1, "years");
        currentTime = moment().format("HH:mm a");
        trainTimeDifference = moment().diff(moment(firstTrainTimeConversion), "minutes");
        timeLeft = trainTimeDifference % trainFrequency;
        minutesAway = trainFrequency - timeLeft;
        nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");

        //append new data to table
        $("#trainTable > tbody").append("<tr><td>"  + trainName + "</td><td>" + trainDestination +  "</td><td>" + trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
    });
});
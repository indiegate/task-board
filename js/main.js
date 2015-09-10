var gui = require('nw.gui');
console.log( "ready!" );
var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://sty-board.firebaseio.com/");


myFirebaseRef.child("teams/frw-int/sections/").once("value", function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var key = childSnapshot.key();
    var content = childSnapshot.child("content").val();
    myFirebaseRef.child("teams/frw-int/sections/"+key+"/tasks").on("value", function(tasksSnapshot) {
        var tasksList = $("#"+key+">.content>.list");
        tasksList.empty();
        tasksSnapshot.forEach(function(taskSnapshot) {
          var task = taskSnapshot.val();
          $("<div />")
            .attr("id", taskSnapshot.key())
            .attr("section", key)
            .attr("plain", task.content)
            .attr("ondblclick",'changeTask(this);')
            .addClass("item")
            .html(constructTaskHtml(task))
            .appendTo(tasksList);
        });
    });
  });
});


function createTask(sectionId) {
  var text = prompt("New task description (#tags)", "");
  if (text != null) {
    var tasksFirebaseRef = myFirebaseRef.child("teams/frw-int/sections/"+sectionId+"/tasks/");
    var newTaskRef = tasksFirebaseRef.push();
    newTaskRef.set({'content': text});
  }
}

function changeTask(taskElement) {
  console.log("changeTask", taskElement);
  var text = prompt("New task description (#tags)", taskElement.getAttribute("plain"));
  if (text != null) {
    myFirebaseRef.child("teams/frw-int/sections/"+taskElement.getAttribute("section")+"/tasks/"+taskElement.id)
      .update({'content':text});
  }
}

function removeTask(taskKey) {

}

function constructTaskHtml(task) {
  var words = task.content.split(" ");
  var tags = [];
  var sentence = "";
  words.forEach(function(word) {
    if (word.startsWith("#")) {
      tags.push(word.substring(1,word.length));
    } else {
      sentence += word + " ";
    }
  });
  var html = "";
  tags.forEach(function(tag) {
    html += "<div class=\"ui mini horizontal label "+tag+"\">"+tag+"</div>";
  });
  html += sentence;
  return html;
}

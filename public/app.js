$.getJSON("/articles", function (data) {

    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + data[i].summary + "</p");
    }
});

$(document).on("click", "p", function () {
    $("#notes").empty();
    var dId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + dId
    }).then(function (data) {
        console.log(data);

        $("#notes").append("<h2>" + data.title + "</h2>");

        $("#notes").append("<input id='t-input' name='title' >");

        $("#notes").append("<textarea id='b-input' name='body'></textarea>");

        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Add Note</button>");

        if (data.note) {
            $("#t-input").val(data.note.title);
            $("#b-input").val(data.note.body);
        }
    });
});

$(document).on("click", "#savenote", function () {
    var dId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + dId,
        data: {
            title: $("#t-input").val(),
            body: $("#b-input").val()
        }
    }).then(function (data) {
        console.log(data);

        $("#notes").empty();
    });

    $("#t-input").val("");
    $("#b-input").val("");
});
;
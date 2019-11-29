// Check Off Specific Todos By Clicking v1.0
// $('li').click(function(){
//     $(this).css("color", "gray");
//     $(this).css("text-decoration", "line-through");
// });

// Check Off Specific Todos By Clicking v1.1
// $('li').click(function(){
//     // if li is gray
//     if($(this).css("color") === "rgb(128, 128, 128)"){
//         // turn it black
//         $(this).css({
//             color: "black",
//             textDecoration: "none"
//         });
//     // else
//     } else {
//         // turn it gray
//         $(this).css({
//             color: "gray",
//             textDecoration: "line-through"
//         });
//     }
// });

// Check Off Specific Todos By Clicking v2.0
// $("li").click(function(){
//     $(this).toggleClass("completed");
// });

// Check Off Specific Todos By Clicking v2.1
$("ul").on("click", "li",function(){
    $(this).toggleClass("completed");
})

// Click on X to delete Todos v1.0
// $("span").click(function(event){
//     $(this).parent().fadeOut(500, function(){
//         $(this).remove();
//     });
//     event.stopPropagation();
// });

// Click on X to delete Todos v1.1
$("ul").on("click", "li span", function(event){
    $(this).parent().fadeOut(500, function(){
        $(this).remove();
    });
    event.stopPropagation();
});

// Add new todos
$("input[type='text']").keypress(function(event){
    if(event.which === 13){
        // grabbing new todo text from input
        var todoText = $(this).val();
        $(this).val("");
        // create a new li add to ul
        $("ul").append("<li><span><i class=\"fa fa-trash\"></i></span> " + todoText + "</li>");
    };
});

$(".fa-plus").click(function(){
    $("input[type='text']").fadeToggle();
});


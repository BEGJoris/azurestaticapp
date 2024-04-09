
$("#servicesTab").click(function() {
  $("#servicesTab").addClass("text-purple-600 border-purple-600")
  $("#materielTab").removeClass("text-purple-600 border-purple-600")
  $("#servicesContent").show();
  $("#materielContent").hide();
})

$("#materielTab").click(function() {
  $("#materielTab").addClass("text-purple-600 border-purple-600")
  $("#servicesTab").removeClass("text-purple-600 border-purple-600")
  $("#servicesContent").hide();
  $("#materielContent").show();
})


$("#listTab").click(function() {
  $("#listTab").addClass("text-purple-600 border-purple-600")
  $("#renduTab").removeClass("text-purple-600 border-purple-600")
  $("#reservationTab").removeClass("text-purple-600 border-purple-600")
  $("#recuTab").removeClass("text-purple-600 border-purple-600")
  $("#listContent").show();
  $("#renduContent").hide();
  $("#recuContent").hide();
  $("#reservationContent").hide();
})

$("#renduTab").click(function() {
  $("#renduTab").addClass("text-purple-600 border-purple-600")
  $("#listTab").removeClass("text-purple-600 border-purple-600")
  $("#recuTab").removeClass("text-purple-600 border-purple-600")
  $("#reservationTab").removeClass("text-purple-600 border-purple-600")
  $("#listContent").hide();
  $("#renduContent").show();
  $("#recuContent").hide();
  $("#reservationContent").hide();
});

$("#recuTab").click(function() {
  $("#recuTab").addClass("text-purple-600 border-purple-600")
  $("#listTab").removeClass("text-purple-600 border-purple-600")
  $("#reservationTab").removeClass("text-purple-600 border-purple-600")
  $("#renduTab").removeClass("text-purple-600 border-purple-600")
  $("#listContent").hide();
  $("#renduContent").hide();
  $("#recuContent").show();
  $("#reservationContent").hide();
})

$("#reservationTab").click(function() {
  $("#reservationTab").addClass("text-purple-600 border-purple-600")
  $("#listTab").removeClass("text-purple-600 border-purple-600")
  $("#renduTab").removeClass("text-purple-600 border-purple-600")
  $("#recuTab").removeClass("text-purple-600 border-purple-600")
  $("#listContent").hide();
  $("#renduContent").hide();
  $("#recuContent").hide();
  $("#reservationContent").show();
})

$('#serviceBtn').click(function() {
  window.location.href = './ajouter-service.html';
})

$('#materielBtn').click(function() {
  window.location.href = './ajouter-materiel.html';
})


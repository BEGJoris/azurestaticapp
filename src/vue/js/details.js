import { fetchData } from "../js/fetchData.js";
import { getCookie } from "../js/getCookies.js";

function getQueryParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

async function favData(datas) {
  try {
    const response = await $.ajax({
      type: 'POST',
      url: 'https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php?',
      data: {
        action: datas.action,
        id_voisin: datas.id_voisin,
        id_annonce: datas.id_annonce,
        type_annonce: datas.type_annonce,
      },
      dataType: 'json'
    });
    return response;
  } catch (error) {
    return null;
  }
}

$.noConflict(); // Avoid jQuery conflicts

async function displayDetails() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  $("#dateFin").attr("min", formattedDate);

  const id = getQueryParam('id');
  const type = getQueryParam('type') === "Service" ? "services" : "materiels";

  const isReserveQuery = "get=" + (type == "services" ? "antidoubleservice" : "antidoublemateriel") + "&id=" + getCookie().userId + "&annonce=" + id;
  const isReserve = await fetchData(isReserveQuery);

  const categories = type == "services" ? await fetchData("get=typesservice&id=" + id) : await fetchData("get=typesmateriel&id=" + id);
  const mainImage = document.querySelector('img[alt="Main Image"]');
  const titleElement = document.querySelector('div > h2');
  const descriptionElement = $("#description");
  const forfait = $("#jetons");
  
  const categ = $("#categ");
  const user = $("#utilisateur");
  let data = await fetchData("get=" + type + "&id=" + id);
  let voisin = await fetchData("get=voisins&id=" + data.id_voisin);
  let localisation = await fetchData("get=localisation&id=" + data.localisation);

  if(getCookie().userId !== null) {
    var map = L.map('map').setView([localisation.latitude, localisation.longitude], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([localisation.latitude, localisation.longitude]).addTo(map);


    user.text(voisin.nom_voisin + " " + voisin.prenom_voisin);
   
  }
  else{
    $("#map").append("Vous devez être connecté pour voir la carte.");
    $("#map").addClass("text-red-600");
    user.text("Vous devez être connecté pour voir l'utilisateur.");
    user.removeClass("cursor-pointer text-blue-600 hover:text-blue-700")
    user.addClass("text-red-600")
    
    
  }
 

  forfait.text((data.val_forf_mat || data.val_forf_serv) + " JETONS OU " + (data.val_quot_mat || data.val_quot_serv) + " JETONS/JOUR");
  
  mainImage.src = "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id=" + id + "&type=" + type;
  mainImage.alt = data.desc_mat || data.desc_service;
  titleElement.textContent = data.nom_mat || data.nom_service;
  descriptionElement.text(data.desc_mat || data.desc_service);

  let listCateg = categories.map(categ => categ.nom_type).join(", ");
  categ.text(listCateg);

  if (type == "materiels") {
    const marque = $("#marque");
    const modele = $("#modele");
    const taille = $("#taille");
    marque.text(data.marque_mat);
    modele.text(data.modele_mat);
    taille.text(data.taille_mat);
  }

  const id_vois = getCookie().userId;
  const type_annonce = getQueryParam('type') === "Service" ? "service" : "materiel";
  const isFav = await favData({ action: 'isfavori', id_voisin: id_vois, id_annonce: id, type_annonce: type_annonce });

  if (isFav == true) {
    $("#favBtn").text("Retirer des favoris");
  } else {
    $("#favBtn").text("Ajouter au favoris");
  }

  // Modal de réservation
  $("#reserveModal").dialog({
    autoOpen: false,
    show: {
      effect: 'slide',
      duration: 500
    },
    hide: {
      effect: 'slide',
      duration: 500
    },
    resizable: false,
    height: 250,
    width: $(window).width() < 450 ? $(window).width() - 20 : 450,
    modal: true,
    buttons: {
      "Confirmer la date": function () {
        const dateFin = $("#dateFin").val();
        if (dateFin !== "") {
          $("#step1").hide();
          $("#step2").show();
          $(this).dialog({
            title: "Confirmer la réservation",
            buttons: {
              'Confirmer': function () {
                $.ajax({
                  type: 'POST',
                  url: 'https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php?',
                  data: {
                    action: "addTransaction",
                    id_annonce: id,
                    id_acheteur: getCookie().userId,
                    id_vendeur: voisin.id_voisin,
                    type_annonce: type,
                    date_fin: dateFin
                  },
                  dataType: 'json',
                });
                $(this).dialog("close");
                window.location.reload();
              },
              'Annuler': function () {
                $(this).dialog("close");
                $("#step1").show();
                $("#step2").hide();
              }
            }
          });
        }
      },
      Annuler: function () {
        $(this).dialog("close");
      }
    }
  });

  $(window).resize(function () {
   
    if ($(window).width() < 450) {
      $("#reserveModal").dialog("option", "width", $(window).width() - 20);
    } else {
      $("#reserveModal").dialog("option", "width", 450);
    }
  });

  let VoisinConnecte = await fetchData("get=voisins&id=" + getCookie().userId);
  let VoisinConnecteJetons = VoisinConnecte.nb_jetons;
  
  let transacConcerne = null;
  let allTransac = await fetchData("get=transactions");

  if(type == "materiels"){
    transacConcerne = allTransac.filter(transac => transac.id_mat == id)[0];
  }
  else if (type == "services"){
    transacConcerne = allTransac.filter(transac => transac.id_service == id)[0];
  }





  if (isReserve.length > 0) {
    $("#reserveBtn").prop("disabled", true);
    $("#reserveBtn").addClass("cursor-not-allowed");

    if (isReserve[0].statut == 0) {
      $("#reserveBtn").text("Reservation en attente");
      $("#reserveBtn").css("background-color", "gray");
      $("#reserveBtn").prop("disabled", true);
      $("#reserveBtn").addClass("cursor-not-allowed");
    }
  }



  if (VoisinConnecteJetons < data.val_forf_mat || VoisinConnecteJetons < data.val_forf_serv) {
    $("#reserveBtn").prop("disabled", true);
    $("#reserveBtn").addClass("cursor-not-allowed");
    $("#reserveBtn").text("Pas assez de jetons");
    $("#reserveBtn").css("background-color", "red");
  }

  

  if(transacConcerne!==null && transacConcerne!==undefined){
    if(transacConcerne.statut==1){
 
      $("#reserveBtn").prop("disabled", true);
      $("#reserveBtn").addClass("cursor-not-allowed");
      $("#reserveBtn").text("Indisponible");
      $("#reserveBtn").css("background-color", "gray");
    }
  }

  $("#reserveBtn").click(function () {
    $("#reserveModal").dialog("open");
  });

  document.getElementById('utilisateur').addEventListener('click', function () {
    window.location.href = `fiche-gentilVoisin.html?userId=${data.id_voisin}`;
  });

  if (getCookie().userType !== "voisin" || getCookie().userId == voisin.id_voisin) {
    $("#favBtn").css("display", "none");
    $("#reserveBtn").css("display", "none");
  }
}

displayDetails();

if (getCookie().userType !== "voisin") {
  $("#favBtn").css("display", "none");
  $("#reserveBtn").css("display", "none");
}

$("#favBtn").click(function () {
  const texteBouton = $(this).text();
  const id_voisin = getCookie().userId;
  const id = getQueryParam('id');
  const type_annonce = getQueryParam('type') === "Service" ? "service" : "materiel";
  if (texteBouton.trim() === "Ajouter au favoris") {
    favData({ action: 'addfavori', id_voisin: id_voisin, id_annonce: id, type_annonce: type_annonce });
    $(this).text("Retirer des favoris");
  } else {
    favData({ action: 'deletefavori', id_voisin: id_voisin, id_annonce: id, type_annonce: type_annonce });
    $(this).text("Ajouter au favoris");
  }
});

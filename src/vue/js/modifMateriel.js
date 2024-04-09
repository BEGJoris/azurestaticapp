import { fetchData } from "./fetchData.js"
import { getCookie } from "./getCookies.js"
async function getCoordinates(address) {
  try {
    var openStreetMapAPIUrl =
      "https://nominatim.openstreetmap.org/search?q=" +
      encodeURIComponent(address) +
      "&format=json&limit=1";
    const response = await fetch(openStreetMapAPIUrl);

    if (!response.ok) {
      throw new Error("Erreur lors de la requête à l'API");
    }

    const data = await response.json();

    const latitude = data[0].lat;
    const longitude = data[0].lon;

    return { address, latitude, longitude };
  } catch (error) {
    console.log("Une erreur s'est produite : ", error);
  }
}

function getQueryParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
  }


  const idMat = getQueryParam('id');
  const idVois = getCookie().userId;

  
const nom=$("#nom")
const description=$("#description")
const val_forf = $("#val_forf")
const val_quot = $("#val_quot")
const taille = $("#taille")
const modele = $("#modele")
const marque = $("#marque")

const currentImage = $("#currImage")[0]
currentImage.src = "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id=" + idMat + "&type=materiels";





let localisation = await fetchData("get=voisins&id=" + getCookie().userId);
  localisation = await getCoordinates(localisation["adresse_voisin"]);
  let localisationAddress= localisation["address"];
  let localisationLongitude = localisation["longitude"];
  let localisationLatitude = localisation["latitude"];

const materiels =  await fetchData("get=materiels&id=" + idMat) 

nom.val(materiels["nom_mat"])
description.val(materiels["desc_mat"])
val_forf.val(materiels["val_forf_mat"])
val_quot.val(materiels["val_quot_mat"])
taille.val(materiels["taille_mat"])
modele.val(materiels["modele_mat"])
marque.val(materiels["marque_mat"])
const categoriesData = await fetchData("get=typeservicemateriels");
  
  const categorySelect = document.getElementById("categorie");

  const categorieParDefaut = await fetchData("get=typesmateriel&id="+idMat);

  categoriesData.forEach((category) => {
    const option = document.createElement("option");
    if (category.nom_type === categorieParDefaut[0]["nom_type"]) {
      option.selected = true;
    }
    option.value = category.id_type;
    option.textContent = category.nom_type;
    categorySelect.appendChild(option);
  });


$("#modifMaterielForm").submit(async function (e) {

  e.preventDefault();
  const categId = $("#categorie").val()
  const image = $("#images")[0].files[0];
  const formData = new FormData();
  formData.append("action", "updatemateriel");
  formData.append("id_materiel", idMat);
  formData.append("id", idVois);
  formData.append("nom", nom.val());
  formData.append("description", description.val());
  formData.append("forfaitaire", val_forf.val());
  formData.append("quotidien", val_quot.val());
  formData.append("taille", taille.val());
  formData.append("modele", modele.val());
  formData.append("marque", marque.val());
  formData.append("categId", categId);
  formData.append("image", image);
  formData.append("localisationAddress", localisationAddress);
  formData.append("localisationLongitude", localisationLongitude);
  formData.append("localisationLatitude", localisationLatitude);
  $.ajax({
    type: "POST",
    url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
    data: formData,
    processData: false,
    contentType: false,
    
  }).then(async function (data) {
    alert("Votre modification sera pris en charge");
    window.location.href = "./gestion-materiels-services.html";
  })
  
})


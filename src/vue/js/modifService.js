import { fetchData } from "./fetchData.js"
import { getCookie } from "./getCookies.js"

function getQueryParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
  }


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

  const id = getQueryParam('id');
    

const nom=$("#nom")
const description=$("#description")
const val_forf = $("#val_forf")
const val_quot = $("#val_quot")

const currentImage = $("#currImage")[0] 
currentImage.src = "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id=" + id + "&type=services";


let localisation = await fetchData("get=voisins&id=" + getCookie().userId);
  localisation = await getCoordinates(localisation["adresse_voisin"]);
  let localisationAddress= localisation["address"];
  let localisationLongitude = localisation["longitude"];
  let localisationLatitude = localisation["latitude"];


const service =  await fetchData("get=services&id=" + id) 


nom.val(service["nom_service"])
description.val(service["desc_service"])
val_forf.val(service["val_forf_serv"])
val_quot.val(service["val_quot_serv"])
const categoriesData = await fetchData("get=typeservicemateriels");
  const categorySelect = document.getElementById("categorie");
  const categorieParDefaut = await fetchData("get=typesservice&id="+id);
  categoriesData.forEach((category) => {
    const option = document.createElement("option");
    if (category.nom_type === categorieParDefaut[0]["nom_type"]) {
        option.selected = true;
      }
    option.value = category.id_type;
    option.textContent = category.nom_type;
    categorySelect.appendChild(option);
  });

  
$("#modifServiceForm").submit(async function (e) {
  const categId = $("#categorie").val()
  const image = $("#images")[0].files[0];
  e.preventDefault();
  const formData = new FormData();
  formData.append("action", "updateservice");
  formData.append("nom", nom.val());
  formData.append("description", description.val());
  formData.append("forfaitaire", val_forf.val());
  formData.append("quotidien", val_quot.val());
  formData.append("id_service", id);
  formData.append("id", getCookie().userId);
  formData.append("image", image);
  formData.append("categId", categId);
  formData.append("localisationAddress", localisationAddress);
  formData.append("localisationLongitude", localisationLongitude);
  formData.append("localisationLatitude", localisationLatitude);
  $.ajax({
    type: "POST",
    url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
    data: formData,
    processData: false,
    contentType: false,
    
  }).then(async function (response) {
    alert("Votre modification sera pris en charge");
    window.location.href = "./gestion-materiels-services.html";
  })

})

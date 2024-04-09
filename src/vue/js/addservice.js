import { fetchData } from "./fetchData.js";
import { getCookie } from "./getCookies.js";

async function loadCategories() {
  const categoriesData = await fetchData("get=typeservicemateriels");

  const categorySelect = document.getElementById("categorie");
  categoriesData.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id_type;
    option.textContent = category.nom_type;
    categorySelect.appendChild(option);
  });
}


const image = $("#images")
image.change(function () {
  const reader = new FileReader();
  reader.onload = function (e) {
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.innerHTML = "";
    const img = document.createElement("img");
    img.src = e.target.result;
    imagePreview.appendChild(img);
  };
  reader.readAsDataURL(this.files[0]);

})

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
document.getElementById('choixOption').addEventListener('change', function() {
  var optionSelectionnee = this.value;
  if (optionSelectionnee === 'fichier') {
      document.getElementById('optionFichier').style.display = 'block';
      document.getElementById('optionCamera').style.display = 'none';
  } else if (optionSelectionnee === 'camera') {
      document.getElementById('optionFichier').style.display = 'none';
      document.getElementById('optionCamera').style.display = 'block';
  }
});
document.addEventListener('DOMContentLoaded', function() {
  const option=document.getElementById('choixOption').value;
  if (option === 'fichier') {
      document.getElementById('optionFichier').style.display = 'block';
      document.getElementById('optionCamera').style.display = 'none';
  } else if (option === 'camera') {
      document.getElementById('optionFichier').style.display = 'none';
      document.getElementById('optionCamera').style.display = 'block';
  }
});

async function ajoutService() {
  let nom = $("#nom").val();
  let description = $("#description").val();
  let val_forf = $("#val_forf").val();
  let val_quot = $("#val_quot").val();
  let image = $("#images")[0].files[0];

  let voisin = getCookie().userId;
  let categorie = $("#categorie").val();
  let localisation = await fetchData("get=voisins&id=" + getCookie().userId);
  localisation = await getCoordinates(localisation["adresse_voisin"]);
  let localisationAddress= localisation["address"];
  let localisationLongitude = localisation["longitude"];
  let localisationLatitude = localisation["latitude"];

  let formData = new FormData();
  formData.append("action", "addservice");
  formData.append("nom", nom);
  formData.append("description", description);
  formData.append("image", image);
  formData.append("id", voisin);
  formData.append("forfaitaire", val_forf);
  formData.append("quotidien", val_quot);
  formData.append("categorie", categorie);
  formData.append("localisationAddress", localisationAddress);
  formData.append("localisationLongitude", localisationLongitude);
  formData.append("localisationLatitude", localisationLatitude);


  // Effectuer une requête AJAX
  $.ajax({
    type: "POST",
    url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
    data: formData,
    processData: false,
    contentType: false,

  }).then(async function (data) {
    
    alert("Votre ajout sera pris en charge");
    window.location.href = "./gestion-materiels-services.html";
    
  });
  
}


$(document).ready(function () {
  $("#addServiceForm").submit(function (e) {
    e.preventDefault();
    ajoutService();
 
  });
});

loadCategories();

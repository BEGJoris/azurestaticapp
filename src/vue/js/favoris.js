
import { getCookie } from "../js/getCookies.js";
import { fetchData } from "../js/fetchData.js";

$(document).ready(async function () {
  let userId = getCookie().userId
  let userType = getCookie().userType
  if (userType == "voisin" && userId) {
    let favoris = await fetchData("get=favoris&id=" + userId);
    let servicesContent = ""
    let materielsContent = ""
    for (const fav of favoris) {
     
      let src = "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id="+fav.id_mat+"&type="+fav.type
      if (fav.type == "service") {

        servicesContent += `<div onClick="affiche('service', ` + fav.id_mat + `)" class="flex items-center justify-between p-4 mb-2 bg-white shadow rounded"><!-- mettre l'id de la bdd -->
            <div class="flex items-center">
              <div class="mr-4">
                <img src="${src}" alt="Service Icon" class="w-10 h-10 rounded-full" />
              </div>
              <div>
                <div class="w-40 font-bold">${fav.nom_mat}</div>
              </div>
            </div>
            <div class="font-bold">${fav.val_quot_mat} Jetons</div>
          </div>`;

      } else {
        materielsContent += `<div onclick="affiche('materiel', ${fav.id_mat})" class="flex items-center justify-between p-4 mb-2 bg-white shadow rounded"><!-- mettre l'id de la bdd -->
            <div class="flex items-center">
              <div class="mr-4">
                <img src="${src}" alt="Service Icon" class="w-10 h-10 rounded-full" />
              </div>
              <div>
                <div class="w-40 font-bold">${fav.nom_mat}</div>
              </div>
            </div>
            <div class="font-bold">${fav.val_quot_mat} Jetons</div>
          </div>`;
      }
    }

    $("#servicesContent").html(servicesContent)
    $("#materielContent").html(materielsContent)
  }
  else {
    $("#servicesContent").html("Veuillez vous connecter en tant que GentVoisin")
    $("#materielContent").html("Veuillez vous connecter en tant que GentiVoisin")
  }


});


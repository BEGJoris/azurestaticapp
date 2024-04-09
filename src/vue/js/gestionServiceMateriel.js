import { fetchData } from "./fetchData.js";
import { getCookie } from "./getCookies.js";

$.noConflict()

const servicesContent = $("#servicesContent")
const materielsContent = $("#materielContent")
const userId = getCookie().userId
let services = await fetchData("get=servicesvoisin&id=" + userId);
let materiels = await fetchData("get=materielsvoisin&id=" + userId);

function supprimer(id_annonce, type) {
    $("#supprimerModal").data('id_annonce', id_annonce);
    $("#supprimerModal").data('type', type);
    $("#supprimerModal").dialog("open");
}
window.supprimer = supprimer;


function modifier(id_annonce, type) {
    if(type=="materiels") window.location.href = "modificationMateriel.html?id="+id_annonce
    else window.location.href = "modificationService.html?id="+id_annonce

}
window.modifier = modifier;

$(function () {
    $("#supprimerModal").dialog({
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
      width: 450,
      modal: true,
      buttons: {
        "Confirmer": function () {
            let id_annonce = $(this).data('id_annonce');
            let type = $(this).data('type');
            if (type=="materiels") {
                $.ajax({
                    type: "POST",
                    url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
                    data: {
                        action: 'deletemateriel',
                        id_materiel: id_annonce,
                    },

                })
            }
            else {
              $.ajax({
                type: "POST",
                url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
                data: {
                    action: 'deleteservice',
                    id_service: id_annonce,
                },

            })

            }
            $(this).dialog("close");
            window.location.reload();
        },
        "Annuler": function () {
          $(this).dialog("close");
        }
      }

    });
  })

  $(window).resize(function () {

    if ($(window).width() < 450) {
      $("#supprimerModal").dialog("option", "width", $(window).width() - 20);

    } else {
      $("#supprimerModal").dialog("option", "width", 450);

    }
  });

let serviceHtml = ""

for (const service of services) {
  let srcS= "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id="+service.id_service+"&type=service"
    serviceHtml += `<div class="flex items-center justify-between p-4 mb-2 bg-white shadow rounded">
      <div class="flex items-center">
        <div class="mr-4">
          <img src="${srcS}" alt="Service Icon" class="w-10 h-10 rounded-full" />
        </div>
        <div>
          <div class="w-40 font-bold">${service.nom_service}</div>
        </div>
      </div>
      <div class="flex items-center">
      ${service.admin ?
        `<button onClick="modifier(${service.id_service},'services')" class="text-gray-600 hover:text-gray-800 mr-2">
          <i class="fas fa-pencil-alt"></i> <!-- Replace with pencil icon -->
        </button>`
        :
        `<div class="text-red-600 mr-3">En attente de validation</div>`
      }
      <button  onClick="supprimer(${service.id_service},'services')" class="text-red-600 hover:text-red-800">
        <i class="fas fa-trash"></i> <!-- Replace with trash icon -->
      </button>
      </div>
      <div class="font-bold">${service.val_forf_serv} Jetons</div>
    </div>`;
}

let materielHtml = ""
for (const materiel of materiels) {
  let srcM= "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id="+materiel.id_mat+"&type=materiel"

    materielHtml += `<div class="flex items-center justify-between p-4 mb-2 bg-white shadow rounded">
      <div class="flex items-center">
        <div class="mr-4">
          <img src="${srcM}" alt="Service Icon" class="w-10 h-10 rounded-full" />
        </div>
        <div>
          <div class="w-40 font-bold">${materiel.nom_mat}</div>
        </div>
      </div>
      <div class="flex items-center">
      ${materiel.admin ?
        `<button onClick="modifier(${materiel.id_mat},'materiels')" class="text-gray-600 hover:text-gray-800 mr-2">
          <i class="fas fa-pencil-alt"></i> <!-- Replace with pencil icon -->
        </button>`
        :
        `<div class="text-red-600 mr-3 flex space-x-4">En attente de validation</div>`
      }
      <button  onClick="supprimer(${materiel.id_mat},'materiels')" class="text-red-600 hover:text-red-800">
        <i class="fas fa-trash"></i> <!-- Replace with trash icon -->
      </button>
      </div>
      <div class="font-bold">${materiel.val_forf_mat} Jetons</div>
    </div>`;
}

servicesContent.html(serviceHtml+`<button id="serviceBtn" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4">
Ajouter un service
</button>`)
materielsContent.html(materielHtml+`<button id="materielBtn" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4">
Ajouter un matériel
</button>`)

$("#materielBtn").click(function () {
   window.location.href = "ajouter-materiel.html"
})

$("#serviceBtn").click(function () {
   window.location.href = "ajouter-service.html"
})
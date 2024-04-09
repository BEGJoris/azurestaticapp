import { fetchData } from './fetchData.js';
import { getCookie } from './getCookies.js';

$.noConflict()

const API_BASE_URL = 'https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php';
function refuserDemande(id_trans) {

  $("#refuserModal").data('id_transac', id_trans);
  $("#refuserModal").dialog("open");

}

function accepterDemande(id_trans, type) {
  $("#acceptModal").data('id_transac', id_trans);
  $("#acceptModal").data('type', type);
  $("#acceptModal").dialog("open");

}


$(function () {
  $("#refuserModal").dialog({
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
    height: 200,
    width: 450,
    modal: true,
    draggable: false,

    buttons: {
      "Confirmer": function () {
        let id_trans = $(this).data('id_transac');
        $.ajax({
          type: "POST",
          url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
          data: {
            action: 'deleteTransaction',
            id_transaction: id_trans,

          },
          dataType: "json",
        })
        $(this).dialog("close");
        window.location.reload();
      },

      "Annuler": function () {
        $(this).dialog("close");
      }
    }

  });
})




$(function () {
  $("#acceptModal").dialog({
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
    height: 200,
    width: 450,
    modal: true,
    draggable: false,
    buttons: {
      "Confirmer": function () {
        let id_trans = $(this).data('id_transac');
        let type = $(this).data('type');
        $.ajax({
          type: "POST",
          url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
          data: {
            action: 'updateTransaction',
            id_transaction: id_trans,
            type: type,
          },
          dataType: "json",
        }).then(function (data) {
        })
        $(this).dialog("close");
        window.location.reload();
      },

      "Annuler": function () {
        $(this).dialog("close");
      }
    }

  });
})

$(function () {
  $("#resilierModal").dialog({
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
    draggable: false,
    buttons: {
      "Confirmer": function () {
        let id_transac = $(this).data('id_transac');
        $.ajax({
          type: "POST",
          url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
          data: {
            action: 'resilier',
            id_transaction: id_transac
          },
          dataType: "json",
        })
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
    $("#resilierModal").dialog("option", "width", $(window).width() - 20);
    $("#acceptModal").dialog("option", "width", $(window).width() - 20);
    $("#refuserModal").dialog("option", "width", $(window).width() - 20);
  } else {
    $("#resilierModal").dialog("option", "width", 450);
    $("#acceptModal").dialog("option", "width", 450);
    $("#refuserModal").dialog("option", "width", 450);
  }
});


function resilier(objet) {
  let id_transac = objet.id;
  $("#resilierModal").data('id_transac', id_transac);
  // Ouvrir le modal
  $("#resilierModal").dialog("open");
}

window.resilier = resilier;


function clearList(selector) {
  const list = document.querySelector(selector);
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

async function loadTransactions() {
  const { userId } = getCookie();
  if (!userId) {
    console.error("ID utilisateur introuvable dans les cookies.");
    return;
  }

  const transactionsData = await fetchData("get=transactions");

  if (!transactionsData || transactionsData.length === 0) {
    console.log("Aucune transaction disponible.");
    return;
  }

  const numericUserId = parseInt(userId, 10);
  const prêtsServicesRendus = transactionsData.filter(transaction => parseInt(transaction.id_vendeur, 10) === numericUserId);
  const empruntsServicesReçus = transactionsData.filter(transaction => parseInt(transaction.id_acheteur, 10) === numericUserId);

  displayTransactions(prêtsServicesRendus, 'renduContent');
  displayTransactions(empruntsServicesReçus, 'recuContent');
}

async function displayTransactions(transactions, contentId) {
  const contentDiv = document.querySelector(`#${contentId} ul`);
  clearList(`#${contentId} ul`);

  const promises = transactions.map(transaction => createTransactionListItem(transaction));
  const listItems = await Promise.all(promises);

  listItems.forEach(listItem => {
    contentDiv.appendChild(listItem);
  });
}


async function createTransactionListItem(transaction) {
  const listItem = document.createElement('li');
  listItem.className = "px-6 py-4 flex items-center space-x-4";
  const isService = transaction.id_service !== null;
  const idObjet = isService ? transaction.id_service : transaction.id_mat;
  const type = isService ? 'services' : 'materiels';
  let acheteur = await fetchData("get=voisins&id=" + transaction.id_acheteur);
  const apiUrl = `${API_BASE_URL}?get=${type}&id=${idObjet}`;


  try {
    const response = await fetch(apiUrl);
    let date = new Date();
    let date_vente = new Date(transaction.date_vente);
    let differenceEnMilliseconds = date_vente - date

    // Convertir la différence de millisecondes en jours
    let joursRestants = Math.ceil(differenceEnMilliseconds / (1000 * 60 * 60 * 24))+1


    // Extraire l'année, le mois et le jour
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Mois commence à 0, donc ajouter 1
    let day = String(date.getDate()).padStart(2, '0');

    // Formatage de la date en 'yyyy-mm-dd'
    let formattedDate = `${year}-${month}-${day}`;

    const data = await response.json();

    const divAcheteur = transaction.id_acheteur == getCookie().userId ? "" : `<div class="inline-flex items-center text-base">
<span class="type text-gray-500">Acheté par ${acheteur.nom_voisin} ${acheteur.prenom_voisin}</span>
</div>`
    const resBtn = transaction.id_acheteur == getCookie().userId && formattedDate < transaction.date_vente && transaction.statut === 1 ? `<button id=${transaction.id_trans} onClick="resilier(this)" class="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">Resilier</button>` : ""
    let transacStatut = ""
    if(transaction.statut == 0){
      transacStatut = "En Attente"
    }
    if(transaction.statut == 1){
      transacStatut = "Accepté"
    }
    if(transaction.statut == 2){
      transacStatut = "Terminé"
    }
    if(joursRestants<1){
      transacStatut = "Terminé"
    }
    // const transacStatut = transaction.statut === 0 ? "En Attente" : "Accepté";
    let src=isService?"https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id="+data.id_service+"&type=service"
    :"https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id="+data.id_mat+"&type=materiel";
    listItem.innerHTML = `

    <div class="flex-shrink-0">
      <img class="h-10 w-10 rounded-full" src="${src}" alt="${isService ? data.nom_service : data.nom_mat}">
    </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">${isService ? data.nom_service : data.nom_mat}</p>
        <div class="statut text-${transacStatut == 'Accepté' ? 'green' : 'pink'}-600">${transacStatut}</div>

      </div>
      ${divAcheteur}

      <div class="type text-gray-500">Date de fin : ${transaction.date_vente}</div>
        ${resBtn}
      </div>

      <div class="inline-flex items-center text-sm">
        <span class="text-gray-900 font-bold">${isService ? data.val_forf_serv : data.val_forf_mat} Jetons</span>
      </div>
    `;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la transaction', error);
  }
  

  return listItem;
}



async function loadUserItems(type) {
  const { userId } = getCookie();
  if (!userId) return;
  // const param = `get=${type}&id=${userId}${categoryId ? `&category=${categoryId}` : ''}`;
  const itemsData = await fetchData("get=" + type + "voisin&id=" + userId)
 

  const items = Array.isArray(itemsData) ? itemsData : [itemsData];

  items.forEach(item => {
    const listItem = createItemListItem(item, type);
    document.querySelector('#listContent ul').appendChild(listItem);
  });
}

function createItemListItem(item, type) {
  const li = document.createElement('li');
  li.className = "px-6 py-4 flex items-center space-x-4";

  let src=type=="services"?"https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id="+item.id_service+"&type=service":"https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id="+item.id_mat+"&type=materiel";

  let htmlContent = `
    <div class="flex-shrink-0">
      <img class="h-10 w-10 rounded-full" src="${src}" alt="${item.nom_service || item.nom_mat}">
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 truncate">${item.nom_service || item.nom_mat}</p>
    <div class="inline-flex items-center text-base">
    <span class="text-gray-900 font-bold">${item.val_forf_serv || item.val_forf_mat} Jetons</span>
  </div>`;
  li.innerHTML = htmlContent;
  li.onclick = () => {
    if (type === 'materiels') {
      window.location.href = `détail-materiel.html?id=${item.id_mat}&type=Materiel`;
    } else if (type === 'services') {
      window.location.href = `détail-service.html?id=${item.id_service}&type=Service`;
    }
  };
  return li;
}

async function loadUserJetons() {
  const { userId } = getCookie();
  if (!userId) return;
  const voisinsData = await fetchData(`get=voisins&id=${userId}`);
  if (voisinsData) {
    document.querySelector('.text-lg span').textContent = `${voisinsData.nb_jetons} JETONS`;
  } else {
    console.error("Impossible de charger les données du voisin.");
  }
}




document.addEventListener('DOMContentLoaded', async function () {
  const { userId } = getCookie();
  if (!userId) {
    console.error("ID utilisateur introuvable dans les cookies.");
    return;
  }

  clearList('#listContent ul');
  await loadUserItems('services');
  await loadUserItems('materiels');
  await loadUserJetons();
  await loadTransactions();
});


let demandeContent = ""
const demandesReservation = await fetchData("get=transattente&id=" + getCookie().userId);


for (const demande of demandesReservation) {

  let typeDemande = "services"
  if (demande.id_service == null) {
    typeDemande = "materiels"
  }

  let demandeItem = await fetchData("get=" + typeDemande + "&id=" + (demande.id_service || demande.id_mat))
  let src=typeDemande=="services"?"https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id="+demande.id_service+"&type=service":"https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id="+demande.id_mat+"&type=materiel";
  let demandeAcheteur = await fetchData("get=voisins&id=" + demande.id_acheteur)

  demandeContent += `
  <div class="flex items-center justify-between p-4 mb-2 bg-white shadow rounded"><!-- mettre l'id de la bdd -->
    <div class="flex items-center">
      <div class="mr-4">
        <img src="${src}" alt="Service Icon" class="w-10 h-10 rounded-full" />
      </div>
      <div>
        <div class="w-40 font-bold">${demandeItem.nom_service || demandeItem.nom_mat}</div>
      </div>
        <div>
          <div class="inline-flex items-center text-base">
                  <span class="type text-gray-500">Par ${demandeAcheteur.nom_voisin} ${demandeAcheteur.prenom_voisin}</span>
          </div>

      </div>
    </div>
    <div class="type text-gray-500">Jusqu'au : ${demande.date_vente}</div>
            <button id=${demande.id_trans}.${typeDemande} class="acceptBtn bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded">Accepter</button>
            <button id=${demande.id_trans} class="rejectBtn bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">Refuser</button>
      </div>
</div>`


}
$("#reservationContent").html(demandeContent)

$(".rejectBtn").click(function () {
  const id_trans = $(this).attr('id');
  refuserDemande(id_trans)
})


$(".acceptBtn").click(function () {
  const id_trans = $(this).attr('id').split('.')[0];
  const type = $(this).attr('id').split('.')[1];
  accepterDemande(id_trans, type)
})







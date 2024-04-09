import { fetchData } from './fetchData.js';
import { getCookie } from './getCookies.js';

const API_BASE_URL = 'https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php';

async function fetchAndDisplayUserDetails() {
  const { userId } = getCookie();

  if (userId) {
    const apiUrl = `${API_BASE_URL}?get=voisins&id=${userId}`;

    try {
      const response = await fetch(apiUrl);
      const userData = await response.json();

      document.querySelector('#nom').textContent = `Profil de ${userData.prenom_voisin} ${userData.nom_voisin}`;
      document.querySelector('#tel').textContent = userData.tel_voisin;
      document.querySelector('#mail').textContent = userData.email_voisin;
      document.querySelector('#adresse').textContent = userData.adresse_voisin;
      document.querySelector('#jetons').textContent = `Solde : ${userData.nb_jetons} Jetons`;
      document.querySelector('#date').textContent = `Date d'inscription : ${userData.date_inscription}`;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'utilisateur', error);
    }
  }
}

fetchAndDisplayUserDetails();

function clearList(selector) {
  const list = document.querySelector(selector);
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

async function loadTransactions() {
  const { userId } = getCookie();
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
  const contentDiv = document.querySelector('#transactions-list');
  clearList('#transactions-list');

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

  const apiUrl = `${API_BASE_URL}?get=${type}&id=${idObjet}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const src = `https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id=${idObjet}&type=${type}`;

    listItem.innerHTML = `
      <div class="flex-shrink-0">
        <img class="h-10 w-10 rounded-full" src="${src}" alt="${isService ? data.nom_service : data.nom_mat}">
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">${isService ? data.nom_service : data.nom_mat}</p>

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

loadTransactions();

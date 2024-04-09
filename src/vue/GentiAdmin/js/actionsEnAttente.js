let actionsData = [];

function fetchActionsEnAttente() {
  Promise.all([
    fetch('https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php?get=voisinsattente').then(r => r.json()),
    fetch('https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php?get=servicesattente').then(r => r.json()),
    fetch('https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php?get=materielsattente').then(r => r.json()),
  ]).then(([nouveauxComptes, servicesEnAttente, materielsEnAttente]) => {
    actionsData = [
      ...nouveauxComptes.map(item => ({...item, type: 'Nouveau compte'})),
      ...servicesEnAttente.map(item => ({...item, type: 'Service', admin: item.admin})),
      ...materielsEnAttente.map(item => ({...item, type: 'Matériel', admin: item.admin})),
    ];
    displayActionsEnAttente(actionsData); 
  }).catch(error => console.error('Erreur lors de la récupération des actions en attente:', error));
}

function displayActionsEnAttente(actions) {
  const actionsList = document.getElementById('actionsList');
  actionsList.innerHTML = '';

  actions.forEach(action => {
    const item = document.createElement('div');
    item.className = 'bg-white p-4 rounded shadow flex justify-between items-center';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'font-bold mb-2';
    if (action.type === 'Nouveau compte') {
      infoDiv.textContent = `${action.nom_voisin} ${action.prenom_voisin}`;
    } else {
      infoDiv.textContent = action.nom_service || action.nom_mat;
    }

    const typeSpan = document.createElement('span');
    typeSpan.textContent = ` - ${action.type}`;
    infoDiv.appendChild(typeSpan);

    const detailBtn = document.createElement('img');
    detailBtn.src = '../image/edit.png';
    detailBtn.className = 'cursor-pointer';
    detailBtn.style.width = '20px';
    detailBtn.style.height = '20px';
    detailBtn.addEventListener('click', () => {
      if (action.type === 'Nouveau compte') {
        openModal(action);
      } else {
        openModalServiceMateriel(action);
      }
    });

    item.appendChild(infoDiv);
    item.appendChild(detailBtn);
    actionsList.appendChild(item);
  });
}

async function openModalServiceMateriel(action) {
  const utilisateurId = action.id_voisin;

  try {
      const response = await fetch(`https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php?get=voisins&id=${utilisateurId}`);
      const utilisateurDetails = await response.json();

      document.getElementById('modalIdUtilisateur').textContent = `Utilisateur: ${utilisateurDetails.nom_voisin} ${utilisateurDetails.prenom_voisin}`;
  } catch (error) {
      console.error('Erreur lors de la récupération des détails de l’utilisateur:', error);
      document.getElementById('modalIdUtilisateur').textContent = 'Erreur lors de la récupération des détails de l’utilisateur';
  }
  document.getElementById('modalId').textContent = action.id_service || action.id_mat;
  document.getElementById('modalType').textContent = action.type;
  if(action.type === 'Service'){
    document.getElementById('modalImage').src = "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id=" +action.id_service + "&type=" + action.type;
  }else if(action.type === 'Matériel'){
    document.getElementById('modalImage').src = "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id=" +action.id_mat + "&type=" + action.type;
  }   
  document.getElementById('modalNom').textContent = action.nom_service || action.nom_mat;
  document.getElementById('modalDescription').textContent = action.desc_service || action.desc_mat;
  document.getElementById('modalValeurs').innerHTML = `Valeur Forfaitaire: ${action.val_forf_serv || action.val_forf_mat}<br>Valeur Quotidienne: ${action.val_quot_serv || action.val_quot_mat}`;

  document.getElementById('modalServiceMateriel').style.display = 'block';
}



function closeModalServiceMateriel() {
  document.getElementById('modalServiceMateriel').style.display = 'none';
}

fetchActionsEnAttente();

function searchActions(searchTerm) {
    const filteredActions = actionsData.filter(action => {
      let nomPrenom;
      if (action.type === 'Nouveau compte') {
        nomPrenom = `${action.nom_voisin.toLowerCase()} ${action.prenom_voisin.toLowerCase()}`;
      } else if (action.type === 'Service') {
        nomPrenom = action.nom_service.toLowerCase();
      } else if (action.type === 'Matériel') {
        nomPrenom = action.nom_mat.toLowerCase();
      } else {
        return false;
      }
      return nomPrenom.includes(searchTerm.toLowerCase());
    });
  
    displayActionsEnAttente(filteredActions);
  }
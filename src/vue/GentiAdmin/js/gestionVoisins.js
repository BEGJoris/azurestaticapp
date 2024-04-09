function searchVoisins(searchTerm) {
    const filteredVoisins = voisinsData.filter(voisin => {
      const nomPrenom = `${voisin.nom_voisin.toLowerCase()} ${voisin.prenom_voisin.toLowerCase()}`;
      return nomPrenom.includes(searchTerm.toLowerCase());
    });
  
    displayVoisins(filteredVoisins);
  }

function displayVoisins(data) {
    const voisinsList = document.getElementById('gentiVoisinsList');
    voisinsList.innerHTML = '';
  
    data.forEach(voisin => {
      const item = document.createElement('div');
      item.classList.add('bg-white', 'p-4', 'rounded', 'shadow', 'flex', 'justify-between', 'items-center');
  
      const nomPrenomWrapper = document.createElement('div');
      nomPrenomWrapper.classList.add('flex', 'flex-col');
  
      const prenom = document.createElement('div');
      prenom.classList.add('font-bold', 'mb-2');
      prenom.textContent = voisin.prenom_voisin;
      nomPrenomWrapper.appendChild(prenom);
  
      const nom = document.createElement('div');
      nom.textContent = voisin.nom_voisin;
      nom.classList.add('font-bold', 'mb-2');
      nomPrenomWrapper.appendChild(nom);
  
      const adresse = document.createElement('div');
      adresse.classList.add('text-gray-600', 'ml-auto');
      adresse.textContent = voisin.adresse_voisin;
      adresse.style.textAlign = 'center';
  
      const detailBtn = document.createElement('img');
      detailBtn.classList.add('detailBtn');
      detailBtn.src = '../image/edit.png';
      detailBtn.alt = 'Modifier';
      detailBtn.style.cursor = 'pointer';
      detailBtn.setAttribute('data-id', voisin.id);
      detailBtn.onclick = function() {
        openModal(voisin, true);
      };
  
      item.appendChild(nomPrenomWrapper);
      item.appendChild(adresse);
      item.appendChild(detailBtn); 
      voisinsList.appendChild(item);
    });
  }
  
function fetchVoisins() {
        fetch('https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php?get=voisins')
          .then(response => response.json())
          .then(data => {
            voisinsData = data.filter(voisin => voisin.id_gentiadmin !== null);
  
            updateStats("Total");
  
            displayVoisins(voisinsData);
          })
          .catch(error => console.error('Erreur lors de la récupération des données des voisins:', error));
  }
  
      window.addEventListener('load', function () {
        fetchVoisins();
      });
  
  
  function fetchVoisinsEnAttente() {
        fetch('https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php?get=voisinsattente')
          .then(response => response.json())
          .then(data => {
            displayVoisinsEnAttente(data);
          })
          .catch(error => console.error('Erreur lors de la récupération des données des voisins en attente:', error));
  }

  function displayVoisinsEnAttente(data) {
    const actionsList = document.getElementById('actionsList');
    actionsList.innerHTML = '';
  
    data.forEach(voisin => {
      const item = document.createElement('div');
      item.classList.add('bg-white', 'p-4', 'rounded', 'shadow', 'flex', 'justify-between', 'items-center');
  
      const nomPrenom = document.createElement('div');
      nomPrenom.classList.add('font-bold', 'mb-2');
      nomPrenom.textContent = `${voisin.nom_voisin} ${voisin.prenom_voisin}`;
  
      const adresse = document.createElement('div');
      adresse.classList.add('text-gray-600');
      adresse.textContent = voisin.adresse_voisin;
  
      const detailBtn = document.createElement('img');
      detailBtn.classList.add('detailBtn');
      detailBtn.src = '../image/edit.png';
      detailBtn.alt = 'Détails';
      detailBtn.style.cursor = 'pointer';
      detailBtn.onclick = function() {
        openModal(voisin, false);
      };
  
      item.appendChild(nomPrenom);
      item.appendChild(adresse);
      item.appendChild(detailBtn); 
      actionsList.appendChild(item);
    });
  }
  
  function bannirVoisin(voisinId) {
      
    $.ajax({
      type: "POST",
      url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
      data: {
        action: "bannirvoisin",
        id_voisin: voisinId
      }
    }).then(function (data) {
      alert("Le voisin a été banni avec succès.");
      window.location.reload();
    })
  }

  function confirmValider() {
    const voisinId = document.getElementById('bannirBtn').getAttribute('data-id');
    
    let userId = null;
    const cookies = document.cookie.split(',');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const [key, value] = cookie.split('=');
      if (key === "userId") {
        userId = value;
        break;
      }
    }
    
    if (userId !== null) {
      validerVoisin(userId, voisinId);
    } else {
      console.error("Impossible de trouver l'ID de l'admin dans les cookies.");
      alert("Erreur : Impossible de valider le compte. Veuillez réessayer plus tard.");
    }
  }

  function confirmBannir() {
    const voisinId = document.getElementById('bannirBtn').getAttribute('data-id');

    if (confirm("Êtes-vous sûr de vouloir bannir ce voisin ?")) {
      bannirVoisin(voisinId);
    }
  }

function openModal(voisin, fromActionsList) {
    document.getElementById('modalNomPrenom').textContent = `${voisin.nom_voisin} ${voisin.prenom_voisin}`;
    document.getElementById('modalAdresse').textContent = voisin.adresse_voisin;
    document.getElementById('modalEmail').textContent = voisin.email_voisin;
    document.getElementById('modalTelephone').textContent = voisin.tel_voisin;
    document.getElementById('modalNbJetons').textContent = voisin.nb_jetons;
    document.getElementById('modalRayon').textContent = voisin.rayon_voisin + ' km';
    document.getElementById('modalDateInscription').textContent = voisin.date_inscription;
    document.getElementById('bannirBtn').setAttribute('data-id', voisin.id_voisin);
    document.getElementById('modal').style.display = 'block';
  
    if (fromActionsList) {
      document.getElementById('validerBtn').style.display = 'none';
    } else {
      document.getElementById('validerBtn').style.display = 'inline-block';
    }
  }
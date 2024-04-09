function validerVoisin(adminId, voisinId) {
    $.ajax({
      type: "POST",
      url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
      data: {
        action: "validercompte",
        id_admin: adminId,
        id_voisin: voisinId
      }
    }).then(function (data) {
      alert("Le compte a été validé avec succès.");
      window.location.reload();
      fetchVoisins(); 
    }).fail(function (error) {
      console.error('Erreur lors de la validation du compte:', error);
      alert("Une erreur s'est produite lors de la validation du compte.");
    });
  }
  
function validerMateriel(adminId, materielId) {
    $.ajax({
      type: "POST",
      url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
      data: {
        action: "validermateriel",
        id_materiel: materielId,
        id_admin: adminId,
        }
    }).then(function (data) {
      alert("Le matériel a été validé avec succès.");
      window.location.reload();
    }).fail(function (error) {
      console.error('Erreur lors de la validation du matériel:', error);
      alert("Une erreur s'est produite lors de la validation du matériel.");
    });
  }
  
  function validerService(adminId, serviceId) {

    $.ajax({
      type: "POST",
      url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
      data: {
        action: "validerservice",
        id_service: serviceId,
        id_admin: adminId,
        
      }
    }).then(function (data) {
      alert("Le service a été validé avec succès.");
      window.location.reload();
    }).fail(function (error) {
      console.error('Erreur lors de la validation du service:', error);
      alert("Une erreur s'est produite lors de la validation du service.");
    });
  }

  function confirmValiderAct (){
    const adminId = getIdAdmin();
    if (!adminId) {
      alert("Erreur: Admin non identifié.");
      return;
    }
    
    const actionType = document.getElementById('modalType').textContent;
    const actionId = document.getElementById('modalId').textContent; 
  
    if (actionType === 'Service') {
      validerService(adminId, actionId);
    } else if (actionType === 'Matériel') {
      validerMateriel(adminId, actionId);
    }
  }


function confirmSupprimerAct (){
    const actionId = document.getElementById('modalId').textContent;
    const actionType = document.getElementById('modalType').textContent;
  
    if (actionType === 'Service') {
      supprimerService(actionId);
    } else if (actionType === 'Matériel') {
      supprimerMateriel(actionId);
    }
  }

function supprimerService(serviceId) {
  $.ajax({
    type: "POST",
    url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
    data: {
      action: "deleteservice",
      id_service: serviceId,
    }
  }).then(function (data) {

    alert("Le service a été supprimé avec succès.");
    fetchActionsEnAttente(); 
    window.location.reload();
  }).fail(function (error) {
    console.error('Erreur lors de la suppression du service:', error);
    alert("Une erreur s'est produite lors de la suppression du service.");
  });
}

function supprimerMateriel(materielId) {
  $.ajax({
    type: "POST",
    url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php",
    data: {
      action: "deletemateriel",
      id_materiel: materielId,
    }
  }).then(function (data) {

    alert("Le matériel a été supprimé avec succès.");
    fetchActionsEnAttente(); 
    window.location.reload();
  }).fail(function (error) {
    console.error('Erreur lors de la suppression du matériel:', error);
    alert("Une erreur s'est produite lors de la suppression du matériel.");
  });
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
  }

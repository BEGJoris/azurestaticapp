// Fonction pour récupérer les données des transactions depuis l'API
function fetchTransactions() {
    fetch('https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php/?get=transactions')
      .then(response => response.json())
      .then(data => {
        transactionsData = data;

        updateTransactionStats("Total");
      })
      .catch(error => console.error('Erreur lors de la récupération des données des transactions:', error));
  }

  window.addEventListener('load', function () {
    fetchTransactions();
  });
function updateStats(filterType) {
    let voisinsTabsEnCours = 0;
    let totalVoisins = voisinsData.length;

    if (filterType === "Mois") {
      const moisEnCours = new Date().getMonth() + 1;
      const anneeEnCours = new Date().getFullYear();

      voisinsData.forEach(voisin => {
        const dateInscription = new Date(voisin.date_inscription);
        if (dateInscription.getMonth() + 1 === moisEnCours && dateInscription.getFullYear() === anneeEnCours) {
          voisinsTabsEnCours++;
        }
      });
    }

    if (filterType === "Année") {
      const anneeEnCours = new Date().getFullYear();

      voisinsData.forEach(voisin => {
        const dateInscription = new Date(voisin.date_inscription);
        if (dateInscription.getFullYear() === anneeEnCours) {
          voisinsTabsEnCours++;
        }
      });
    }

    if (filterType === "Total") {
      voisinsTabsEnCours = totalVoisins;
    }

    document.getElementById("gentiVoisinCount").innerText = voisinsTabsEnCours;
  }

  function updateTransactionStats(filterType) {
    let transactionCount = 0;

    if (filterType === "Mois") {
      const moisEnCours = new Date().getMonth() + 1;
      const anneeEnCours = new Date().getFullYear();

      transactionsData.forEach(transaction => {
        const dateTransaction = new Date(transaction.date_trans);
        if (dateTransaction.getMonth() + 1 === moisEnCours && dateTransaction.getFullYear() === anneeEnCours) {
          transactionCount++;
        }
      });
    }

    if (filterType === "Année") {
      const anneeEnCours = new Date().getFullYear();
      transactionsData.forEach(transaction => {
        const dateTransaction = new Date(transaction.date_trans);
        if (dateTransaction.getFullYear() === anneeEnCours) {
          transactionCount++;
        }
      });
    }

    if (filterType === "Total") {
      transactionCount = transactionsData.length;
    }

    document.getElementById("transactionCount").innerText = transactionCount;
  }

  document.getElementById("Anneetab").addEventListener("click", function () {
    updateStats("Année");
    updateTransactionStats("Année");
    document.getElementById("Anneetab").classList.add("activeTab");
    document.getElementById("Moistab").classList.remove("activeTab");
    document.getElementById("Totaltab").classList.remove("activeTab");
  });

  document.getElementById("Moistab").addEventListener("click", function () {
    updateStats("Mois");
    updateTransactionStats("Mois");
    document.getElementById("Anneetab").classList.remove("activeTab");
    document.getElementById("Moistab").classList.add("activeTab");
    document.getElementById("Totaltab").classList.remove("activeTab");
  });

  document.getElementById("Totaltab").addEventListener("click", function () {
    updateStats("Total");
    updateTransactionStats("Total");
    document.getElementById("Anneetab").classList.remove("activeTab");
    document.getElementById("Moistab").classList.remove("activeTab");
    document.getElementById("Totaltab").classList.add("activeTab");
  });

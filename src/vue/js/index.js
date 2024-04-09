document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".grid");
  let allItems = [];

  // Reset checkboxes and search input
  document.getElementById("checkMaterial").checked = false;
  document.getElementById("checkService").checked = false;
  document.getElementById("searchInput").value = "";

  function fetchAndDisplayItems() {
    const apiUrl = "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php";
    const params = { get: "materiels" };

    axios.all([
      axios.get(apiUrl, { params }),
      axios.get(apiUrl, { params: { get: "services" } })
    ])
    .then(axios.spread((materielsResponse, servicesResponse) => {
      const materiels = materielsResponse.data.filter(mat => mat.admin !== null);
      const services = servicesResponse.data
        .filter(serv => serv.admin !== null)
        .map((service) => ({
          ...service,
          nom_mat: service.nom_service,
          desc_mat: service.desc_service,
          type: "Service",
          taille_mat: null,
        }));

      allItems = [
        ...materiels.map((item) => ({ ...item, type: "Matériel" })),
        ...services,
      ];
      displayItems(allItems);
    }))
    .catch((error) => {
      console.error(error);
    });
  }

  function RechercheBar() {
    const val = document.getElementById("searchInput").value;
    filterItems(val);
  }

  function displayItems(items) {
    container.innerHTML = "";
    items.forEach((item) => {
      const detailPage = item.type === "Matériel" ? "détail-materiel.html?type=Materiel" : "détail-service.html?type=Service";
      const itemDiv = document.createElement("div");
      itemDiv.id = item.id_mat || item.id_service;
      itemDiv.className = "bg-white p-4 rounded shadow";
      itemDiv.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
          <div class="h-48 bg-gray-200 rounded mb-3 overflow-hidden">
            <img src="https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/testDAO.php?id=${item.id_mat || item.id_service}&type=${item.type}" alt="${item.desc_mat || item.desc_service}" class="object-cover h-full w-full">
          </div>
          <h3 class="font-semibold mb-1 text-gray-800">${item.nom_mat || item.nom_service}</h3>
          <p class="text-sm mb-1 text-gray-600">${item.type}</p>
        </div>
      `;
      axios.get(`https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php?get=localisation&id=${item.localisation}`)
        .then((response) => {
          const adresse = response.data.adresse_loc;
          itemDiv.innerHTML += `<br><p class="text-sm text-grey-600">${adresse}</p>`;
        });

      itemDiv.addEventListener("click", () => {
        window.location.href = detailPage + "&id=" + (item.id_mat || item.id_service);
      });

      container.appendChild(itemDiv);
    });
  }

  const materialCheckbox = document.getElementById("checkMaterial");
  const serviceCheckbox = document.getElementById("checkService");
  const searchInput = document.getElementById("searchInput");

  function filterItems(searchTerm) {
    let filteredItems = allItems;

    if (materialCheckbox.checked && !serviceCheckbox.checked) {
      filteredItems = filteredItems.filter((item) => item.type === "Matériel");
    } else if (!materialCheckbox.checked && serviceCheckbox.checked) {
      filteredItems = filteredItems.filter((item) => item.type === "Service");
    }

    filteredItems = filteredItems.filter((item) =>
      item.nom_mat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    displayItems(filteredItems);
  }

  materialCheckbox.addEventListener("change", function () {
    filterItems(searchInput.value);
  });

  serviceCheckbox.addEventListener("change", function () {
    filterItems(searchInput.value);
  });

  searchInput.addEventListener("input", () => {
    RechercheBar();
  });

  fetchAndDisplayItems();
});

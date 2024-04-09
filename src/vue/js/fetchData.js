export async function fetchData(param) {
    try {
      const response = await $.ajax({
        type: "GET",
        url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php/?" + param,
        dataType: "json", // Indiquer que vous attendez une réponse JSON
        data: {
          param: param
        }
      });
      return response; // Retourner directement la réponse JSON
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return null; // Retourner null en cas d'erreur
    }
  }

function inscription() {
    let nom = $("#nom").val();
    let prenom = $("#prenom").val();
    let adresse = $("#adresse").val();
    let telephone = $("#telephone").val();
    let email = $("#email").val();
    let mdp = $("#mot_de_passe").val();
    let confMdp = $("#conf_mot_de_passe").val();
    let rayonDeplacement = $("#rayon_deplacement").val();

    let errorMdp = $("#erreur_conf_mot_de_passe");
  
    if (mdp !== confMdp && confMdp !== "") {
        errorMdp.removeClass("hidden")
        return
    }
    $.ajax({
        type: "POST",
        url: "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php", // URL vers l'API
        data: {
            action: 'inscription',
            nom: nom,
            prenom: prenom,
            adresse: adresse,
            telephone: telephone,
            email: email,
            motDePasse: mdp,
            rayon: rayonDeplacement
        }
    }).then(async function () {
    
        alert("Votre inscription sera pris en charge");
        window.location.href = "./index.html";
    })
}

$(document).ready(function () {
    $("#inscriptionForm").submit(function (e) {
        e.preventDefault();
        inscription();
       
    })
})
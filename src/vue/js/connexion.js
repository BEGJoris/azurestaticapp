import { fetchData } from "./fetchData.js";

$(document).ready(function() {
    $('#formConnexion').submit(function(e) {
        e.preventDefault(); 
        
        var email = $('#email').val();
        var motDePasse = $('#mot_de_passe').val();
        
        $.ajax({
            type: 'POST',
            url: 'https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE401/controleur/api.php',
            data: {
                action: 'connexion',
                email: email,
                motDePasse: motDePasse
            },
            dataType: 'json'
        }).then(async function(data) {
            if (data.res === true) {
                document.cookie = "userId=" + data.id + ",type=" + data.type; 
                let voisinAttent = await fetchData("get=voisinsattente");
                let attente=false
                voisinAttent.filter((voisin) => {
                    if(voisin.id_voisin == data.id) {
                        attente=true
                    }
                })

                if (data.type === 'voisin' && !attente) {
                    window.location.href = './index.html';
                } else if (data.type === 'admin') {
                    window.location.href = './GentiAdmin/dashboard.html';
                }
                else if(attente) {
                    alert('Veuillez attendre la validation de votre compte');
                }
            } else {
                alert('Mot de passe ou email incorrect.');
            }
        }).catch(function(error) {
            console.error(error);
            alert('Erreur lors de la connexion.');
        });
    });
});

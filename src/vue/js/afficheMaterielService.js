function affiche(type, id){
    if(type=="materiel" || "materiels") window.location.href = "détail-materiel.html?id="+id+"&type=Materiel"
    else window.location.href = "détail-service.html?id="+id+"&type=Service"
}
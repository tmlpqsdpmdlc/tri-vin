/******************************Fonctions*****************************************/
// Fonction pour supprimer les accents
function removeAccents(str) {
    var accents    = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
    str = str.split('');
    var strLen = str.length;
    var i, x;
    for (i = 0; i < strLen; i++) {
        if ((x = accents.indexOf(str[i])) != -1) {
            str[i] = accentsOut[x];
        }
    }
    return str.join('');
}

// Obtenir la couleur au singulier depuis le numéro de l'onglet
function tabToCouleurPlurielle(tab) {
    if (tab === 0) {
        return 'rouges'
    }
    if (tab === 1) {
        return 'blancs'
    }
    if (tab === 2) {
        return 'rosés'
    }
}

// Obtenir la couleur au singulier depuis le numéro de l'onglet
function tabToCouleurSingulier(tab) {
    if (tab === 0) {
        return 'rouge'
    }
    if (tab === 1) {
        return 'blanc'
    }
    if (tab === 2) {
        return 'rose'
    }
}

// Obtenir le numéro de l'onglet depuis la couleur au singulier
function couleurSingulierToTab(couleur) {
    if (couleur === 'false' || couleur === 'rouge') {
        return 0
    }
    if (couleur === 'blanc') {
        return 1
    }
    if (couleur === 'rose') {
        return 2
    }
}
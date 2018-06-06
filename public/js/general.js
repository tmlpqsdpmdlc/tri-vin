/******************************Fonctions*****************************************/
// Delete accents
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

function upperCase(str) {
    return str.toUpperCase()
}

// Get the color at plural from the tab number
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

// Get the color at singular from the tab number
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

// get tab number from singular color
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
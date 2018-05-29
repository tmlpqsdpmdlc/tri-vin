// Redimensionnement de l'image pour que sa diagonale soit de 424px
// Si le côté horizontal est plus large que le container avec cette taille de diago, on diminuera encore un peu
// on renvoie les dimensions que sont censés faire les côtés
function dimensionnerImage(largeurImage, hauteurImage, containerWidth) {
    let a = largeurImage
    let b = hauteurImage
    let diagonale = 424
    let alpha1 = Math.sqrt( diagonale * diagonale / ( a*a + b*b ))
    let A = alpha1 * a
    let B = alpha1 * b
    
    if (A > containerWidth) {
        let alpha2 = containerWidth / A
        A = alpha2 * A
        B = alpha2 * B
        return {largeurImage: A, hauteurImage: B}
    }
    return {largeurImage: A, hauteurImage: B}
}
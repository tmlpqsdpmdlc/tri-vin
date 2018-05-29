// Resize of the picture for getting its diagonal at 424px
// if the horizontal side is wider than the container with this diag size, we will resize again
// send the dimensions of the edges
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
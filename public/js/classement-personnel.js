// Modification de l'affichage du menu
var tabSousMenu = document.getElementsByClassName('tabSousMenu')

for(let i = 0 ; i < tabSousMenu.length ; i++)
{
    tabSousMenu[i].addEventListener('click', (event)=>{
        getActive(i)
    })
}

getActive = function(tab)
{
    for(var i = 0 ; i < tabSousMenu.length ; i++)
    {
        tabSousMenu[i].setAttribute('class', 'item tabSousMenu') 
    }

    tabSousMenu[tab].setAttribute('class', 'item active tabSousMenu')
}
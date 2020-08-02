document.addEventListener('DOMContentLoaded',()=>{
    console.log('loaded');

    //number of cells in the minefield per row
    const width = 10;

    let minefield = document.querySelector('.minefield');

    //creating the game logic arrays
    const bombCount = 20;
    const bombCells = Array(bombCount).fill('bomb');
    const emptyCells = Array(width*width-bombCount).fill('empty');
    const combinedCells =  bombCells.concat(emptyCells);

    //Shuffles the array using a Fisher-Yates shuffle
    function shuffle(array){
        for(i=array.length-1;i>0;i--){
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }
    const shuffledCells = shuffle(combinedCells);

    //add the 100 cells to the minefield
    for(i=0;i<width*width;i++){
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('id',i);

        //setting colors in a checkerboard pattern
        if (i%20<10){
            if(i%2==0){
                cell.classList.add('light');
            }
            else{
                cell.classList.add('dark');
            }
        }
        else{
            if(i%2==1){
                cell.classList.add('light');
            }
            else{
                cell.classList.add('dark');
            }
        }

        //adding the bomb status of the cell
        cell.classList.add(shuffledCells[i]);
        minefield.appendChild(cell);

    };
});

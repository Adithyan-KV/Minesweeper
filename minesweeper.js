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
    for(let i=0;i<width*width;i++){
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('id',i);
        cell.setAttribute('count',neigboringBombCount(cell));
        // cell.innerHTML=i;
        // cell.innerHTML=neigboringBombCount(cell);

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

    //given a cell in the shuffled array, computes the number of neighbouring
    //cells which have a bomb
    function neigboringBombCount(cell){
        let cellIndex = Number(cell.getAttribute('id'));
        // alert(cellIndex);
        let count = 0;
        //Indices of all the corners
        corners=[0,(width-1),width*(width-1),width*width-1];
        //indices of neighboring cells
        const top=cellIndex-width;
        const topLeft=(cellIndex-width)-1;
        const topRight=(cellIndex-width)+1;
        const bottom=(cellIndex+width);
        const bottomLeft=(cellIndex+width)-1;
        const bottomRight=(cellIndex+width)+1;
        const right=cellIndex+1;
        const left=cellIndex-1;

        //if cell is not on left or right edge
        if(cellIndex%width!=0&&cellIndex%width!=9){
            //if cell is not on top or bottom edge
            if(cellIndex<90&&cellIndex>9){
                //indices of all the neighboring cells
                const neighborCells = [topLeft,top,topRight,left,right,bottomLeft,bottom,bottomRight];
                checkCells(neighborCells);
            }
            //if cell is in bottom row
            else if(cellIndex>90&&!corners.includes(cellIndex)){
                const neighborCells = [left,right,topLeft,top,topRight];
                checkCells(neighborCells);
            }
            else if(cellIndex<10&&!corners.includes(cellIndex)){
                const neighborCells = [left,right,bottomLeft,bottom,bottomRight];
                checkCells(neighborCells);
            }
        }
        //if cell is on left edge but not a corner
        else if(cellIndex%width===0&& !corners.includes(cellIndex)){
            const neighborCells = [top,topRight,right,bottom,bottomRight];
            checkCells(neighborCells);
        }
        //if cell is on right edge but not a corner
        else if(cellIndex%width===9&& !corners.includes(cellIndex)){
            const neighborCells = [topLeft,top,left,bottomLeft,bottom];
            checkCells(neighborCells);
        }
        //if cells are in the 4 corners
        //top left
        else if(cellIndex===0){
            const neighborCells = [right,bottomRight,bottom];
            checkCells(neighborCells);
        }
        //top right
        else if(cellIndex===(width-1)){
            const neighborCells = [left,bottomLeft,bottom];
            checkCells(neighborCells);
        }
        //bottom left
        else if(cellIndex===(width*(width-1))){
            const neighborCells = [right,topRight,top];
            checkCells(neighborCells);
        }
        //bottom right
        else{
            const neighborCells = [left,topLeft,top];
            checkCells(neighborCells);
        };

        //checks all the neighbouring cells and tallies out a count
        function checkCells(neighborCells){
            for (let j=0;j< neighborCells.length;j++){
                if(shuffledCells[neighborCells[j]]==='bomb'){
                    count++;
                }
            }
        };

        return count;
    };




    //implementing gameplay
    cells = document.querySelectorAll('.cell');
    cells.forEach((cell)=>{cell.addEventListener('click', clicked)});

    //if a cell gets clicked
    function clicked(){
        //if cell has bomb end game
        const count=Number(this.getAttribute('count'));
        if (this.classList.contains('bomb')){
            this.innerHTML='&#11044;';
            // alert('Game over');
        }
        //if cell contains bomb display count on click
        else if(count!=0){
            this.innerHTML=count;
        }


        //paints the cell as clicked
        this.classList.add('clicked');
    };
});

document.addEventListener('DOMContentLoaded',()=>{
    console.log('loaded');

    //number of cells in the minefield per row
    const width = 10;

    let minefield = document.querySelector('.minefield');

    let gameStart=false;

    let gameOver = false;

    //creating the game logic arrays
    const bombCount = 10;
    const bombCells = Array(bombCount).fill('bomb');
    const emptyCells = Array(width*width-bombCount).fill('empty');
    const combinedCells =  bombCells.concat(emptyCells);

    //variables for the timer
    var minutesLabel = document.getElementById("minutes");
    var secondsLabel = document.getElementById("seconds");
    var totalSeconds = 0;

    //variable for counting the number of flags the user has to use
    var flagCount = bombCount;

    function updateFlagCount(newCount){
        count = document.querySelector('#flag-count');
        //timeout to allow the variable enough time to change
        setTimeout(()=>{
            count.innerHTML = newCount;
        },10);

    }

    //set the timer value
    function setTime() {
        //if game is not over, increment time
        if(!gameOver){
            ++totalSeconds;
            secondsLabel.innerHTML = pad(totalSeconds % 60);
            minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
        }
    }

    //calculate the padding required for proper formatting of timer
    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        }
        else {
            return valString;
        }
    };

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
    cells.forEach((cell)=>{cell.addEventListener('contextmenu', (e)=>{
        e.preventDefault();
        addFlag(cell);
    })});

    //if a cell gets clicked
    function clicked(){
        //if game hasn't started yet, start the timer
        if(!gameStart){
            gameStart= true;
            setInterval(setTime, 1000);
        }

        //if game over do nothing
        if(gameOver){
            return false;
        }
        //if the cell is already flagged do nothing
        if(this.classList.contains('flagged')){
            return false;
        }
        //if cell has bomb end game
        const count=Number(this.getAttribute('count'));
        if (this.classList.contains('bomb')){
            this.innerHTML='&#11044;'
            triggerAllBombs();
            gameOver = true;
            message = document.querySelector('.message');
            message.innerHTML = 'BOOM goes the landmine';
            message.classList.add('loss');
            // alert('Game over');
        }
        //if cell contains bomb display count on click
        else if(count!=0){
            this.innerHTML=count;
        }
        else if(count===0){
            setTimeout(recursiveCheckNeighbors(this),10);
        }

        //paints the cell as clicked
        this.classList.add('clicked');
    };

    function addFlag(cell){
        //if game over then do nothing
        if(gameOver){
            return false;
        }
        // if cell is unclicked, add a flag
        if(!cell.classList.contains('clicked')){
            if(cell.classList.contains('flagged')){
                if(flagCount!=bombCount){
                    flagCount++;
                    updateFlagCount(flagCount);
                }
                cell.classList.remove('flagged');
                cell.innerHTML='';
                checkWin();
            }
            else{
                flagCount--;
                updateFlagCount(flagCount);
                cell.classList.add('flagged');
                //add flag character, UTF skull and bones
                cell.innerHTML='&#9760;';
                checkWin();
            }
        }
    }

    function recursiveCheckNeighbors(cell){
        if(!cell.classList.contains('clicked')&&!cell.classList.contains('flagged')){
            cell.classList.add('clicked');
            cellIndex=Number(cell.getAttribute('id'));

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
                    clearCells(neighborCells);
                }
                //if cell is in bottom row
                else if(cellIndex>90&&!corners.includes(cellIndex)){
                    const neighborCells = [left,right,topLeft,top,topRight];
                    clearCells(neighborCells);
                }
                else if(cellIndex<10&&!corners.includes(cellIndex)){
                    const neighborCells = [left,right,bottomLeft,bottom,bottomRight];
                    clearCells(neighborCells);
                }
            }
            //if cell is on left edge but not a corner
            else if(cellIndex%width===0&& !corners.includes(cellIndex)){
                const neighborCells = [top,topRight,right,bottom,bottomRight];
                clearCells(neighborCells);
            }
            //if cell is on right edge but not a corner
            else if(cellIndex%width===9&& !corners.includes(cellIndex)){
                const neighborCells = [topLeft,top,left,bottomLeft,bottom];
                clearCells(neighborCells);
            }
            //if cells are in the 4 corners
            //top left
            else if(cellIndex===0){
                const neighborCells = [right,bottomRight,bottom];
                clearCells(neighborCells);
            }
            //top right
            else if(cellIndex===(width-1)){
                const neighborCells = [left,bottomLeft,bottom];
                clearCells(neighborCells);
            }
            //bottom left
            else if(cellIndex===(width*(width-1))){
                const neighborCells = [right,topRight,top];
                clearCells(neighborCells);
            }
            //bottom right
            else{
                const neighborCells = [left,topLeft,top];
                clearCells(neighborCells);
            };

            function clearCells(neighborCells){
                neighborCells.forEach((item)=>{
                    cell=document.getElementById(item);
                    count=Number(cell.getAttribute('count'));
                    //if the cell is empty recursively clear the neighboring cells
                    if(!cell.classList.contains('flagged')){                        
                        if(count===0){
                            recursiveCheckNeighbors(cell);
                        }
                        else{
                            cell.innerHTML=count;
                            cell.classList.add('clicked');
                        }
                    }
                });
            }
        }
    };

    //triggers all bombs sequentially
    function triggerAllBombs(){
        //randomizing the order in which the bombs are triggered as top to bottom doesn't look good
        bombs = shuffle(Array.from(document.querySelectorAll('.bomb')));
        bombs.forEach((bomb,i)=>{
            if(!bomb.classList.contains('clicked')){
                //detonate bombs one by one with a delay between them
                setTimeout(()=>{
                    bomb.classList.add('clicked');
                    bomb.innerHTML='&#11044;'
                },i*200);
            };
        });
    };

    //checks if all the cells which have bombs in them have been flagged
    function checkWin(){
        console.log('checking win');
        cells= document.querySelectorAll('.bomb');
        flags= document.querySelectorAll('.flagged');
        if(flagCount===0 && nodeListsAreEqual(cells,flags)){
            console.log('you won');
            gameOver = true;
            message = document.querySelector('.message');
            message.innerHTML = 'Mines Cleared!';
            clearAllCells();
        }
    }

    function nodeListsAreEqual( list1, list2 ) {
        if ( list1.length !== list2.length ) {
            return false;
        }
        return Array.from( list1 ).every( ( node, index ) => node === list2[ index ] );
    };

    function clearAllCells(){
        cells = document.querySelectorAll('.cell');
        cells.forEach((cell)=>{
            if(!cell.classList.contains('bomb')){
                cell.classList.add('clicked');
            }
        })
    }


});

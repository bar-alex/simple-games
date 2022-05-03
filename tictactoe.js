// use the table from the activities to create a a tic-tac-toe game
// find a way to get input from user
// get input in format row:column
// check win/loose opportunities - array for each situation? 

let prefix = 'GameSys';
let gameBoard = [       // using array.fill( array.fill() ) fills with the same array ref instead of creating new array ?!
    [' ',' ',' '],
    [' ',' ',' '],
    [' ',' ',' '],
];  
//console.log( gameBoard );


const displayBoard = () => {
    let gb = gameBoard;
    // gB[row][col]
    let displayBoard = `
    ${gb[0][0]} | ${gb[0][1]} | ${gb[0][2] }
   -----------
    ${gb[1][0]} | ${gb[1][1]} | ${gb[1][2] }
   -----------
    ${gb[2][0]} | ${gb[2][1]} | ${gb[2][2] }
    `;
    console.log(displayBoard);
};


// check if the move is allowed: row/col = 1/1..3/3 | target space has to be available
const isMoveAllowed = (row,col) => {
    //console.log('~~iMA~', gameBoard, gameBoard[ row, col ])
    const result = ( gameBoard[row-1][col-1]==' ' );  // empty string is falsy, which makes the move valid
    //console.log('~~iMA~', row, col, gameBoard[row-1][col-1], result);
    return result;
};

// returns an array for the checks - 3 for horizontal, 3 for vertical, last 2 for diagonals
const getBoardSolutions = (stripSpaces) => {

    let checks = [
        // horizontal lines -- you have the row
        gameBoard[0].join(''),
        gameBoard[1].join(''),
        gameBoard[2].join(''),
        // vertical lines -- you have the column
        gameBoard[0][0]+gameBoard[1][0]+gameBoard[2][0],
        gameBoard[0][1]+gameBoard[1][1]+gameBoard[2][1],
        gameBoard[0][2]+gameBoard[1][2]+gameBoard[2][2],
        // diagonals -- you know to check the diagonals
        gameBoard[0][0]+gameBoard[1][1]+gameBoard[2][2],
        gameBoard[2][0]+gameBoard[1][1]+gameBoard[0][2],
    ];

    if( stripSpaces ) 
        checks = checks.map( (x) => x.replaceAll(' ','') );

    return checks;
};



// check if the game is won or lost: 0 / 1 / 2 / 3 = in play / won / lost / draw
const checkGameStatus = () => {

    let checks = getBoardSolutions(false);
     //console.log(checks);

    const playerWon = checks.includes('xxx');
    const playerLost = checks.includes('ooo');
    //const hasEmptyCell = ( checks.find( x => x.charAt(' ')>-1 ) != undefined );
    const hasEmptyCell = gameBoard.find( x => x.includes(' ') );

    const result = playerWon ? 1        // has a 'xxx'
                : playerLost ? 2        // has a 'ooo'
                : !hasEmptyCell ? 3     // draw
                : 0;                    // still playing

    //console.log('~~GStat~~playerWon,playerLost,hasEmptyCell,result: ', playerWon, playerLost, hasEmptyCell, result );
    return result;
};


// implements the user move
const gameUserMove = (row, col) => {
    //let [ row, col ] = [ userMove.charAt[0], userMove[2] ];
    //console.log('~~USER~~', row, col, gameBoard);
    gameBoard[row-1][col-1] = 'x';
    //console.log('~~USER~~', row, col, gameBoard);
    console.log(`${prefix}: The player moves on ${row}:${col}.`);
};


// implements the computer move - evaluates the risks and implements the best move - thats why it's unbeatable (almost?)
const gameComputerMove = () => {
    
    // checks if 1 move from winning
    // checks if 1 move from losing
    // otherwise choses a random move

    const checks = getBoardSolutions(true); // strips spaces, then I can check for 'xx' and 'oo'
    const isWinning = checks.filter( it => it.length==2 && it == 'oo' ).length > 0; 
    const isLosing = checks.filter( it => it.length==2 && it == 'xx' ). length > 0;
    //const randY = Math.floor(Math.random()*2);
    //const randX = ( gameBoard[randY][0]==' '?0: gameBoard[randY][2]==' '?2: 0 );

    let [xIdx, yIdx] = [NaN,NaN];

    //console.log('~~CPU~1~~isWinning,isLosing,checks: ', isWinning,isLosing, checks );
    //console.log('~~CPU~1b~', gameBoard[randY][0], !gameBoard[randY][0] );

    // if winning or losing, find where so you can handle it
    for( const it of checks)
        if( (isWinning && it == 'oo') || (isLosing && it == 'xx') ) {

            const idx = checks.indexOf( it );
            //console.log('~~CPU~2~idx,it: ',idx, it);
            if( idx<=2 ){           // horizontal solutions: I have y, locate x
                yIdx = idx;
                if(gameBoard[yIdx][0]!=' ')
                    if(gameBoard[yIdx][1]!=' ') 
                        xIdx = 2;
                    else 
                        xIdx = 1;
                else 
                    xIdx = 0;
            } 
            else if( idx<=5 ){      // vertical solutions: I have x, locate y
                xIdx = idx-3;
                if(gameBoard[0][xIdx]!=' ')
                    if(gameBoard[1][xIdx]!=' ') 
                        yIdx = 2;
                    else 
                        yIdx = 1;
                else 
                    yIdx = 0;
            }
            else if( idx == 6 ){    // diagonal solution \
                if(gameBoard[0][0]!=' ')
                    if(gameBoard[1][1]!=' ')
                        [yIdx, xIdx] = [2, 2];
                    else 
                        [yIdx, xIdx] = [1, 1];
                else 
                    [yIdx, xIdx] = [0, 0];
            }
            else if( idx == 7 ){    // diagonal solution /
                if(gameBoard[2][0]!=' ')
                    if(gameBoard[1][1]!=' ')
                        [yIdx, xIdx] = [0, 2];
                    else 
                        [yIdx, xIdx] = [1, 1];
                else 
                    [yIdx, xIdx] = [2, 0];
            }
            else // should never be, all cases are covered
                console.log( `Error: gameComputerMove(): default on switch for idx = ${idx}. Should be 0-8. `);

            //console.log('~~CPU~3~~idx,it,yIdx,xIdx: ',idx, it, yIdx, xIdx);
            break;  // breaks the loop
        }

    // if its winning or losing use the x/y you found, else x/y become the random ones
    if( isWinning || isLosing );
    else {
        let [idx, randY, randX] = [-1, NaN, NaN];
        for(const it of gameBoard)
            if(it.includes(' ')){                   // for a y to be valid, one of it's x must be ' '
                idx = gameBoard.indexOf(it);    
                if(Math.floor(Math.random()*2)==1)  // try some random assignment
                    randY = idx;
            }
        if(isNaN(randY) && idx!=-1)    // random assignment failed, get last valid y
            randY = idx;
        //console.log('~~CPU~a4~~randY,gameBoard[randY]: ', randY, gameBoard[randY]);
        randX = ( gameBoard[randY][0]==' '?0: gameBoard[randY][2]==' '?2: 1 );  // find the valid x
        // x,y become the random values
        [ yIdx, xIdx ] = [ randY, randX ];
    }

    //console.log('~~CPU~4~~yIdx,xIdx: ', yIdx, xIdx);
    gameBoard[yIdx][xIdx] = 'o';
    console.log(`${prefix}: The computer moves on ${yIdx+1}:${xIdx+1}.`);
};


const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const getUserInput = () => {
    const question = `${prefix}: Input your move (row:col|0-exit): `;
    // get input from user
    rl.question(question, (userMove) => {
        userMove = userMove.replaceAll(' ',''); // get rid of spaces
        userMove = userMove.toLowerCase().      // turns different separators into ':'
            replaceAll('/',':').
            replaceAll('\\',':').
            replaceAll(',',':').
            replaceAll('x',':');

            // user chose to exit
        if( userMove == '0' ) 
            return rl.close();

        //console.log( '~~uI~', userMove, typeof userMove, userMove.length, userMove.indexOf(':'), userMove[0], userMove[2]  );
        let [row, col] = [ parseInt(userMove[0]), parseInt(userMove[2]) ];
        //console.log( '~~uI~ row:col = ', row, col, typeof row, typeof col  );

        // are value valid? 2 numbers between 1 and 3
        if(isNaN(col) || isNaN(row) || col < 1 || col > 3 || row < 1 || row > 3 )
            console.log(`${prefix}: Specify where you want to put the 'x' on the board in the format row:column (ex: 1:3 for the top right space)`);
        // is the move allowed - ex. doesn't override another x/o ?
        else if( !isMoveAllowed(row,col) )
            console.log(`${prefix}: The move ${userMove} is not allowed.`);
        else {
            // apply user movement
            gameUserMove(row,col);
            // shows user's move
            displayBoard();
            // check if game is over - win/lose/draw
            if( checkGameStatus() > 0 ) 
                return rl.close();
            // computer moves
            gameComputerMove();
            // shows computer's move
            displayBoard();
            // check if game is over - win/lose/draw
            if( checkGameStatus() > 0 ) 
                return rl.close();
        }

        // asks for the next move
        getUserInput();
    });
};


// looks like this is the only way to execute something after the input is closed
rl.on('close', () => {
    // checks to see who won
    const gameResult = checkGameStatus();   // 0 / 1 / 2 / 3 = in play / won / lost / draw
    if( gameResult==1 )
        console.log(`${prefix}: Congrats! You won!`);
    else if ( gameResult==2 )
        console.log(`${prefix}: The computer won!`);
    else if ( gameResult==3 )
        console.log(`${prefix}: The game finished with a draw!`);
    else 
        console.log(`${prefix}: You quit, so the computer wins by default!`);
    // quits the process ? 
    process.exit(0);
});


/// the game starts here - kinda .. 

console.log(`
${prefix}: Welcome to TicTacToe.
${prefix}: You win when you score 'xxx' on any horizontal, vertical or diagonal line.
${prefix}: The computer wins when it scores 'ooo' on any horizontal, vertical or diagonal line.`);

// display the board
displayBoard();

// starts getting input in a recursion - which is weird, but looks like is the only way
getUserInput();

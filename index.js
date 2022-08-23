const unitLength = 20;
let loneColor = "rgb(150, 168, 186)"
let boxColor = "rgb(234,195,66)";
const strokeColor = "rgb(16,45,192)";
const bgcolor = "rgb(47, 47, 47)";
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let slider;
// let inputX = 0;
// let inputY = 0;
let lonelyNumber;
let neighborNumberO;
let neighborNumberR;
let defaultPattern = true;
let keyboardX = 0
let keyboardY = 0
let isKeyboardMode = false
let patternboard = [];
let pattern2DArray = [];
let pattern1 = `.O.
..O
OOO`

let pattern2 = `........................O...........
......................O.O...........
............OO......OO............OO
...........O...O....OO............OO
OO........O.....O...OO..............
OO........O...O.OO....O.O...........
..........O.....O.......O...........
...........O...O....................
............OO......................`

let pattern3 = `.0..0
0....
0...0
0000.`

let pattern4 = `0..
000
0.0
..0`


function setup() {
    /* Set the canvas to be under the element #canvas*/
    ///const canvas = createCanvas(windowWidth, windowHeight - 100);
    const canvas = createCanvas(1200, 600);
    canvas.parent(document.querySelector('#canvas'));


    frameRate(10);

    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
    }

    slider = createSlider(5, 24, 10);
    slider.parent(document.querySelector('#slide-bar'))
    slider.style('width', '60px');
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();  // Set the initial values of the currentBoard and nextBoard
}

function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            // currentBoard[i][j] = random() > 0.8 ? 1 : 0;
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
        }


    }
}



function draw() {
    // console.log('drawing')
    frameRate(slider.value());
    background(bgcolor);
    generate();
    updateCanvas()
}
function updateCanvas() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1) {
                fill(boxColor);
                // } else if (currentBoard[i][j] == 0) {
                //     fill(loneColor);
            } else {
                fill(bgcolor);
            }
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);

        }
    }
}

function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }
            let lonelyNumber = 2;
            let neighborNumberO = 3;
            let neighborNumberR = 3;
            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < lonelyNumber) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > neighborNumberO) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == neighborNumberR) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}






function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */

    console.log(patternboard)
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);

    let patternWidth = getPatternWidth(patternboard)
    let patternHeight = patternboard.length

    if (defaultPattern == true) {
        currentBoard[x][y] = 1;
    } else {
        for (i = 0; i < patternHeight; i++) {

            for (j = 0; j < patternWidth; j++) {

                currentBoard[(x + j + columns) % columns][(y + i + rows) % rows] = patternboard[i][j]
                nextBoard[(x + j + columns) % columns][(y + i + rows) % rows] = patternboard[i][j]
            }
        }
    }

    fill(boxColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);

}

// function mouseClicked() {
//     const x = Math.floor(mouseX / unitLength);
//     const y = Math.floor(mouseY / unitLength);
//     currentBoard[x][y] = 0;
//     ellipse(mouseX, mouseY, unitLength, unitLength)
//     fill(boxColor);
//     rect(x * unitLength, y * unitLength, unitLength, unitLength);
// }

/**
 * When mouse is pressed
 */
function mousePressed() {
    noLoop();
    mouseDragged();

}

/**
 * When mouse is released
 */
function mouseReleased() {
    loop();
}

function keyPressed(event) {


    event.preventDefault()

    let eventCode = event.code
    console.log(eventCode)
    if (eventCode === "KeyK") {
        isKeyboardMode = !isKeyboardMode

        if (isKeyboardMode) {
            frameRate(0);
            console.log('keyboard mode ON')
            if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
                keyboardX = 0
                keyboardY = 0

            } else {
                keyboardX = Math.floor(mouseX / unitLength);
                keyboardY = Math.floor(mouseY / unitLength);
            }


        } else {

            console.log('keyboard mode OFF')
            frameRate(20);
        }

    }

    if (!isKeyboardMode) {
        return
    }

    fill(bgcolor);
    stroke(strokeColor);
    rect(keyboardX * unitLength, keyboardY * unitLength, unitLength, unitLength)


    switch (event.code) {

        case "ArrowUp":
            keyboardY -= 1;
            break;
        case "ArrowDown":
            keyboardY += 1;
            break;
        case "ArrowLeft":
            keyboardX -= 1;
            break;
        case "ArrowRight":
            keyboardX += 1;
            break;
        case "Space":
            currentBoard[keyboardX][keyboardY] = 1

            break;
        default:
            console.log(`Bypass ${event.code}`);
    }
    // draw current indicator
    updateCanvas()

    fill('red')
    rect(keyboardX * unitLength, keyboardY * unitLength, unitLength, unitLength)
    console.log({ keyboardX, keyboardY })



}



// function keyReleased() {
//     if (keyCode === 38) {
//         inputY = 0;
//         inputX = 0;

//     } else if (keyCode === 39) {
//         inputY = 0;
//         inputX = 0;
//     } else if (keyCode === 40) {
//         inputY = 0;
//         inputX = 0;
//     } else if (keyCode === 37) {
//         inputY = 0;
//         inputX = 0;
//     }
// }

// window.addEventListener('keydown', function (event) {
//     keyPressed()
// })

//Button
let lonelyNumberElem = document.querySelector('#lonely')
    .addEventListener('change', function (event) {
        lonelyNumber = event.currentTarget.value
    });

let neighbourOElem = document.querySelector('#neighbourO')
    .addEventListener('change', function (event) {
        neighborNumberO = event.currentTarget.value
    });

let neighbourRElem = document.querySelector('#neighbourR')
    .addEventListener('change', function (event) {
        neighborNumberR = event.currentTarget.value
    });


document.querySelector('#reset-game')
    .addEventListener('click', function () {
        init();
    });

document.querySelector('#start-button')
    .addEventListener('click', function () {
        frameRate(val);
    });

document.querySelector('#pause-button')
    .addEventListener('click', function () {
        frameRate(0);
    });


document.querySelector('#original-mode-button')
    .addEventListener('click', function () {
        init();

    });

let patternSelect = document.querySelector('.pattern-select')
patternSelect.addEventListener('change', function (event) {
    let patternValue = event.currentTarget.value;
    if (patternValue == 1) {
        defaultPattern = false
        pattern2DArray = []
        patternboard = []
        createPattern(pattern1)

    } else if (patternValue == 2) {
        defaultPattern = false
        pattern2DArray = []
        patternboard = []
        createPattern(pattern2)
    } else if (patternValue == 3) {
        defaultPattern = false
        pattern2DArray = []
        patternboard = []
        createPattern(pattern3)
    } else if (patternValue == 4) {
        defaultPattern = false
        pattern2DArray = []
        patternboard = []
        createPattern(pattern4)
    } else (defaultPattern = true)
})

// let patternSelect = document.querySelector('.pattern-select')
// patternSelect.addEventListener('change', function (event) {
//     let pattern = event.target.value;
//     if (pattern == 1) {
//         currentBoard[11][8] = 1
//         currentBoard[12][9] = 1
//         currentBoard[10][10] = 1
//         currentBoard[11][10] = 1
//         currentBoard[12][10] = 1

//         draw();
//     }
//     else if (pattern == 2) {
//         currentBoard[10][10] = 1
//         currentBoard[11][10] = 1
//         currentBoard[12][10] = 1
//         currentBoard[13][10] = 1
//         currentBoard[10][9] = 1
//         currentBoard[10][8] = 1
//         currentBoard[11][7] = 1
//         currentBoard[14][7] = 1
//         currentBoard[14][9] = 1
//     }
//     else if (pattern == 3) {
//         currentBoard[25][2] = 1
//         currentBoard[23][3] = 1
//         currentBoard[25][3] = 1
//         currentBoard[13][4] = 1
//         currentBoard[14][4] = 1
//         currentBoard[21][4] = 1
//         currentBoard[22][4] = 1
//         currentBoard[35][4] = 1
//         currentBoard[36][4] = 1
//         currentBoard[12][5] = 1
//         currentBoard[16][5] = 1
//         currentBoard[21][5] = 1
//         currentBoard[22][5] = 1
//         currentBoard[35][5] = 1
//         currentBoard[36][5] = 1
//         currentBoard[22][6] = 1
//         currentBoard[21][6] = 1
//         currentBoard[17][6] = 1
//         currentBoard[11][6] = 1
//         currentBoard[1][7] = 1
//         currentBoard[2][7] = 1
//         currentBoard[11][7] = 1
//         currentBoard[15][7] = 1
//         currentBoard[17][7] = 1
//         currentBoard[18][7] = 1
//         currentBoard[23][7] = 1
//         currentBoard[25][7] = 1
//         currentBoard[1][6] = 1
//         currentBoard[2][6] = 1
//         currentBoard[11][8] = 1
//         currentBoard[17][8] = 1
//         currentBoard[25][8] = 1
//         currentBoard[12][9] = 1
//         currentBoard[16][9] = 1
//         currentBoard[13][10] = 1
//         currentBoard[14][10] = 1
//     } else if (pattern == 4) {
//         currentBoard[15][15] = 1
//         currentBoard[15][16] = 1
//         currentBoard[15][17] = 1
//         currentBoard[16][16] = 1
//         currentBoard[17][16] = 1
//         currentBoard[17][17] = 1
//         currentBoard[17][18] = 1

//     }
// })



// color-switch

let colorSelect = document.querySelector('.color-select')
colorSelect.addEventListener('change', function (event) {
    let color = event.target.value;
    if (color == 1) {
        boxColor = "rgb(234,195,66)"
    } else if (color == 2) {
        boxColor = "rgb(115,245,224)"
    } else if (color == 3) {
        boxColor = "rgb(245,188,224)"
    } else if (color == 4) {
        boxColor = "rgb(255,0,0)"
    }
});

// function windowResized() {
//     resizeCanvas(1200, 600);
//     //     // canvas = document.getElementById('canvas');
//     //     // if (canvas.width < window.innerWidth) {
//     //     //     canvas.width = window.innerWidth
//     //     // } if (canvas.height < window.innerHeight) {
//     //     //     canvas.height = window.innerHeight
//     //     // }
// }


function createPattern(pattern) {
    let patternRowStringArray = pattern.split("\n")

    for (i in patternRowStringArray) {
        let patternRowArray = []
        for (j of patternRowStringArray[i]) {
            if (j == ".") {
                patternRowArray.push(0)
            } else {
                patternRowArray.push(1)
            }
        }
        pattern2DArray.push(patternRowArray)

    } insertPattern(pattern2DArray)
}

function insertPattern(patternArray) {
    let patternWidth = getPatternWidth(patternArray)
    let patternHeight = patternArray.length

    console.log(patternHeight)
    for (i = 0; i < patternHeight; i++) {
        patternboard[i] = []
        for (j = 0; j < patternWidth; j++) {
            if (patternArray[i][j]) {
                patternboard[i][j] = patternArray[i][j]
            } else {
                patternboard[i][j] = 0
            }
        }
    }
    return patternboard
}

function getPatternWidth(patternArray) {
    let rowLengthArray = []
    for (row of patternArray) {
        rowLengthArray.push(row.length)
    }
    return Math.max(...rowLengthArray)
}

// insertPattern(pattern2DArray)
console.log(patternboard)

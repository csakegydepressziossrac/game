var sor = 38;
var oszlopok = 150;

var playing = false;

var grid = new Array(sor);
var nextGrid = new Array(sor);

var timer;
var reproductionTime = 100;

function initializeGrids() {
    for (var i = 0; i < sor; i++) {
        grid[i] = new Array(oszlopok);
        nextGrid[i] = new Array(oszlopok);
    }
}

function resetGrids() {
    for (var i = 0; i < sor; i++) {
        for (var j = 0; j < oszlopok; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function copyAndResetGrid() {
    for (var i = 0; i < sor; i++) {
        for (var j = 0; j < oszlopok; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function initialize() {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
}


function createTable() {
    var gridContainer = document.getElementById('gridContainer');
    if (!gridContainer) {

        console.error("asd");
    }
    var table = document.createElement("table");
    
    for (var i = 0; i < sor; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < oszlopok; j++) {//
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
    }

    function cellClickHandler() {
        var rowcol = this.id.split("_");
        var row = rowcol[0];
        var col = rowcol[1];
        
        var classes = this.getAttribute("class");
        if(classes.indexOf("live") > -1) {
            this.setAttribute("class", "dead");
            grid[row][col] = 0;
        } else {
            this.setAttribute("class", "live");
            grid[row][col] = 1;
        }
        
    }

    function updateView() {
        for (var i = 0; i < sor; i++) {
            for (var j = 0; j < oszlopok; j++) {
                var cell = document.getElementById(i + "_" + j);
                if (grid[i][j] == 0) {
                    cell.setAttribute("class", "dead");
                } else {
                    cell.setAttribute("class", "live");
                }
            }
        }
    }

function setupControlButtons() {
    var startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    
    var clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;
    
    var randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;
}

function randomButtonHandler() {
    if (playing) return;
    clearButtonHandler();
    for (var i = 0; i < sor; i++) {
        for (var j = 0; j < oszlopok; j++) {
            var isLive = Math.round(Math.random());
            if (isLive == 1) {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}


function clearButtonHandler() {
    console.log("J??t??k t??rl??se");
    
    playing = false;
    var startButton = document.getElementById('start');
    startButton.innerHTML = "Start";    
    clearTimeout(timer);
    
    var cellsList = document.getElementsByClassName("live");
    
    var cells = [];
    for (var i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }
    
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids;
}


function startButtonHandler() {
    if (playing) {
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "Continue";
        clearTimeout(timer);
    } else {
        console.log("Continue the game");
        playing = true;
        this.innerHTML = "Pause";
        play();
    }
}

function play() {
    computeNextGen();
    
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGen() {
    for (var i = 0; i < sor; i++) {
        for (var j = 0; j < oszlopok; j++) {
            applyRules(i, j);
        }
    }
    

    copyAndResetGrid();

    updateView();
}


function applyRules(row, col) {
    var numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
            if (numNeighbors == 3) {
                nextGrid[row][col] = 1;
            }
        }
    }
    
function countNeighbors(row, col) {
    var count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < oszlopok) {
        if (grid[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++;
    }
    if (col+1 < oszlopok) {
        if (grid[row][col+1] == 1) count++;
    }
    if (row+1 < sor) {
        if (grid[row+1][col] == 1) count++;
    }
    if (row+1 < sor && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++;
    }
    if (row+1 < sor && col+1 < oszlopok) {
        if (grid[row+1][col+1] == 1) count++;
    }
    return count;
}


window.onload = initialize;
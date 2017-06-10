/*
TO-DO: stop the animation when user selects a new puzzle while 
solution is being displayed.
*/

/* 
Puzzle grids are numbered and come from the file puzzles.js
The cells in a 6X6 grid are numbered as follows:
1  2  3  4  5  6
8  9  10 11 12 13
15 16 17 18 19 20
22 23 24 25 26 27
29 30 31 32 33 34
36 37 38 39 40 41 
In particular, any number n with n % 7 == 0 is on the boundary.
*/    
 
var cars;
var possibleMoves ;
 
function initPuzzle(puzzleNumber) {  
    cars = new Grid(); // Grid is an array of cars along with some game functions
    possibleMoves = [];
    var processedPuz = puzzles.puz[puzzleNumber].map(function(line) {
        line = line.split("");
        line.push("0"); //These zeros ensure that cells n with n % 7 ==0 are on the boundary.
        return line;
        });
    processedPuz = [].concat.apply([], processedPuz);
    for (var i = 0; i < processedPuz.length; i++) {
        if (processedPuz[i] !== " " && processedPuz[i] !== "0") {
            var newColor = processedPuz[i];
            var cells = [i + 1];         // adding one ensures the numbering scheme
            processedPuz[i] = " ";     
            if (processedPuz[i + 1] === newColor) {
                var j = i + 1;
                while (processedPuz[j] === newColor) {
                    cells.push(j+1);
                    processedPuz[j] = " ";
                    j++;
                }
            } else {
                var j = i + 7;
                while (processedPuz[j] === newColor) {
                    cells.push(j + 1);
                    processedPuz[j] = " ";
                    j += 7;
                }
            }
            if (newColor == "w") { // Insert the white car at the front of the list.
                cars.unshift(new Car(cells[cells.length-1], cells[0], newColor));
            } else {
            cars.push(new Car(cells[cells.length-1], cells[0], newColor));
            }
        }
    }
}

// The following Grid class contains a configuration of cars.
// It's an array augmented with a dictionary of possible moves (indexed by car), 
// a function that moves cars, and a function that returns a copy of the grid.

function Grid() {  
    this.moves = function() {
        var moveDict = {};
        var allCells = [];
        for (var i = 0; i < 42; i++) {
            if (i % 7 != 0) allCells.push(i);
        }
        for (c in this) {
            //var occ = this.map(fillCells).reduce(function(a,b) {return a.concat(b)});
            var occ = this.map(function(c) {return c.coveredCells()}).reduce(function(a,b) {return a.concat(b)});
            var frees = allCells.filter(function(cell) {return !occ.includes(cell)});
            moveDict[c] = adjacentCells(this[c]).filter(function(cell) {return frees.includes(cell)}); 
        }
        return moveDict;
    }

    this.move = function(m) { // make move m.
        car = this[m.index];
        cell = m.cell;
        if (car.direction == "horizontal") {
            if (cell < car.rear) {
                var del = car.rear - cell;
                car.front -= del;
                car.rear -= del;
            } else {
                var del = cell - car.front;
                car.front += del;
                car.rear += del;
            }
        } else {
            if (cell < car.rear) {
                var del = car.rear-cell;
                car.front -= del;
                car.rear -= del;
            } else {
                var del = cell - car.front;
                car.front += del;
                car.rear += del;
            }
        }
        return this;
    }
    this.copyGrid = function() {
        var copiedGrid = new Grid();
        for (var i = 0; i < this.length; i++) {
            copiedGrid.push(new Car(this[i].front, this[i].rear, this[i].color));
        }
        return copiedGrid;
    } 
}

Grid.prototype = Object.create(Array.prototype);

function Car(front, rear, color) {
    this.front = front;
    this.rear = rear;
    this.direction;
    this.coveredCells;
    this.covers;
    this.freeingMoves;
    
    if ((this.rear - this.front) % 7 == 0) {
        this.direction = "vertical";
        this.coveredCells = function() {
            var ccells = [];
            for (var cell = this.rear; cell <= this.front; cell += 7) { 
                ccells.push(cell)
            }
            return ccells;
        }
        
        this.covers = function(cell) {
            return this.coveredCells().includes(cell);
        }
        
        this.freeingMoves = function(blockedCell) { // input a cell blocked by the car, get moves that free the cell
            var uMoves = [];
            u = 0;
            while (this.front - u >= blockedCell) {
                u += 7;
                if (this.rear  < u) {
                    uMoves = []; 
                    break;
                }
                uMoves.push(this.rear - u);
            }
            var dMoves = [];
            d = 0;
            while (this.rear + d <= blockedCell) {
                d += 7;
                if (this.front + d > 42) {
                    dMoves = [];
                    break;
                }
                dMoves.push(this.front + d);
            }
            return [uMoves, dMoves];
        }    
    } else {
        this.direction = "horizontal";
        this.coveredCells = function() {
            var ccells =[];
            for (var cell = this.rear; cell <= this.front; cell++) {
                ccells.push(cell);
            }
            return ccells;
        }
        this.covers = function(cell) {return this.coveredCells().includes(cell)};
        this.freeingMoves = function(blockedCell) {
            var lMoves = [];
            var l = 0;
            while (this.front - l >= blockedCell) {
                l++;
                if ((this.rear - l) % 7 == 0) {
                    lMoves = [];
                    break;
                }
                lMoves.push(this.rear - l);
            }
            var rMoves = [];
            var r = 0;
            while (this.rear + r <= blockedCell) {
                r++;
                if ((this.front + r ) % 7 == 0) {
                    rMoves = [];
                    break;
                }
                rMoves.push(this.front + r);
            }
            return [lMoves, rMoves];
            }
    }
    this.color = puzzles.Colors[color];
}

function Move(index, cell) { // index of the car moved and the cell to which the 
    this.index = index;      // leading edge moves. Only single-cell moves are used
    this.cell = cell;        // in solvers.
}

function elt(name, className, carIndex) {      // Creates a DOM element for a car; 
    var elt = document.createElement(name);    // stores reference to car's index in grid.
    if (className) elt.className = className;
    if (carIndex) elt.index = carIndex;
    return elt;
}

function adjacentCells(car) {
    var adjs = [];
    if (car.direction == "horizontal") {
        return [car.rear - 1, car.front + 1];
    }
    else {
        return [car.rear - 7, car.front + 7];
    }
}
/*
function expand(grid, move) { // turn a multi-cell move into a list of single-cell moves
    var exMoves = []
    if (grid[move.index].direction == "vertical") {
        if (move.cell > grid[move.index].front) {
            for (var i = 7; grid[move.index].front + i <= move.cell; i += 7) {
                exMoves.push(grid[move.index].front + i);
            }
        }
        else {
            for (var i = -7; grid[move.index].front + i >= move.cell; i -= 7) {
                exMoves.push(grid[move.index].front + i);
            }
        }
    }
    else {
        if (move.cell > grid[move.index].front) {
            for (var i = 1; grid[move.index].front + i <= move.cell; i ++) {
                exMoves.push(grid[move.index].front + i);
            }
        }
        else {
            for (var i = -1; grid[move.index].front + i >= move.cell; i--) {
                exMoves.push(grid[move.index].front + i);
            }
        }
    }
    return exMoves;
}
*/

function mergeMoves(ms) {         // takes a sequence of moves and if a car  
    var currentCar = ms[0].index; // makes several consecutive single-cell moves 
    var currentCell;              // merge those into into one multi-cell move.
    var mergedMs = [];            // Used in animating solutions.
    for (m in ms) {
        if (ms[m].index != currentCar) {
            mergedMs.push(new Move(currentCar, currentCell));
            currentCar = ms[m].index;
            currentCell = ms[m].cell;
        }
        else {
            currentCell = ms[m].cell;
        }
    }
    mergedMs.push(new Move(currentCar, currentCell));
    return mergedMs;
}

function bfShow() {                     // Get and display the BFS solution.
    frontier = [new solvers.Path([], cars)];
    var t0 = performance.now();
    var sol = solvers.bfs([], frontier);
    var t1 = performance.now();
    console.log(sol.length, "moves");
    console.log(t1-t0);
    var hs = display.wrap.getElementsByClassName("horizontal");
    var vs = display.wrap.getElementsByClassName("vertical");
    sol = mergeMoves(sol);
    var i = 0;
        
    function animateMove(j) {
        cars.move(sol[j]);
        for (h in hs) {squareUp(hs[h])};
        for (v in vs) {squareUp(vs[v])};
    }
    
    function animationLoop() {
        animateMove(i);
        setTimeout(function() {
            i++;
            if (i < sol.length) {
                animationLoop();
            }
        }, 750);
            }
    animationLoop();
}
        
function pShow() {              // get and display the planning-based solution.
    afrontier = [new solvers.aPath([], cars, solvers.goalmoves(cars))];
    var t0 = performance.now();
    var sol = solvers.ps([], afrontier);
    var t1 = performance.now();
    console.log(sol.length, "moves");
    console.log(t1-t0);
    var hs = display.wrap.getElementsByClassName("horizontal");
    var vs = display.wrap.getElementsByClassName("vertical");
    sol = mergeMoves(sol);
    var i = 0;
    
    function animateMove(j) {
        cars.move(sol[j]);
        for (h in hs) {squareUp(hs[h])};
        for (v in vs) {squareUp(vs[v])};
    }
    
    function animationLoop() {
        animateMove(i);
        setTimeout(function() {
            i++;
            if (i < sol.length) {
                animationLoop();
            }
        }, 750);
            }
    animationLoop();
    return sol;
}        
     
function squareUp(carElt) {           // moves car elements in DOM so they match
    var car = cars[carElt.index];     //  the layout in "cars."
    var delta, inc;                   
    if (carElt.className == "horizontal") {
        delta = scale * ((car.rear % 7)-1) + 2 - parseFloat(carElt.style.left);
        inc = delta * .1;
        function animate() {
            if (Math.abs(delta) > 0.01) {
                delta -= inc;
                carElt.style.left = parseFloat(carElt.style.left) + (inc) + "px"
            } else {
                return;
            }
            requestAnimationFrame(animate);
        } //end animate
    requestAnimationFrame(animate);
    }
    else if (carElt.className == "vertical") {
        delta = scale * (Math.floor(car.rear / 7)) + 2 - parseFloat(carElt.style.top);
        inc = delta * .1;
        function animate() {
            if (Math.abs(delta) > 0.01) {
                delta -= inc;
                carElt.style.top = parseFloat(carElt.style.top) + (inc) + "px"
            } else {
                return;
            }
            requestAnimationFrame(animate);
        } //end animate
    requestAnimationFrame(animate);
    }
}

function DOMDisplay(parent) {            // The remainder consists of the displayed elements.
    this.wrap = parent.appendChild(elt("div"));
    var board = this.wrap.appendChild(this.drawBackground());
    board.appendChild(this.addDropdown());
    board.appendChild(this.addHint());
    board.appendChild(this.addBF());
    board.appendChild(this.addP());
} 
    
var scale = 60;

DOMDisplay.prototype.drawBackground = function() {
    console.log(this);
    var table = elt("table", "background");
    table.style.position = "absolute";
    table.style.top = 0 * scale + "px";
    table.style.width = 6 * scale + "px";
    
    for (var i = 0; i < 6; i++) {           // make the grey cells
        var rowElt = table.appendChild(elt("tr"));
        rowElt.style.height = scale + "px";
        for (var j = 0; j < 6; j++){
            var cell = rowElt.appendChild(elt("td", "gridsquare"));
        }
    }
        
    var carElts = [];
   
    possibleMoves = cars.moves(); // This is used set limits for sliding cars.
    
    for (var car in cars) { 
        var carElt = table.appendChild(elt("div", cars[car].direction, car));
        carElts.push(carElt);
        carElt.style.position = "absolute";
        carElt.style.background = cars[car].color;
        var len = scale * (((cars[car].front - cars[car].rear) / 7) + 1) - 4;
        if (carElt.className === "vertical") {
            carElt.style.height = len + "px";
            carElt.style.width  = "56px";
            carElt.style.top    = scale * (Math.floor(cars[car].rear / 7)) + 2 + "px";
            carElt.style.left   = scale * ((cars[car].rear % 7) - 1) + 2 + "px";
        } else {
            var len             = scale * (cars[car].front - cars[car].rear + 1) - 4;
            carElt.style.width  = len + "px";
            carElt.style.height = "56px";
            carElt.style.top    = scale * (Math.floor(cars[car].rear / 7)) + 2 + "px";
            carElt.style.left   = scale * ((cars[car].rear % 7)-1) + 2 + "px";
        }
        if (carElt.className === "horizontal") { // the next 70 lines or so add sliding functionality to horizontal cars
            var lastX;           
            
            carElt.addEventListener("mousedown", function(event) {
                if (event.which === 1) {
                  lastX = event.pageX;
                  event.target.addEventListener("mousemove", movedX);
                  event.preventDefault(); // Prevent selection
                  }
            });
            
            function buttonPressed(event) {
                if (event.buttons == null) {
                    return event.which != 0;
                } else {
                  return event.buttons != 0;
                }
            }
            
            function movedX(event) { // car-sliding function.
                var ind = carElts.indexOf(event.target);
                var leftStop, rightStop; // How far to the left and right the car can go
                
                if (possibleMoves[ind].includes(cars[ind].rear - 1)) {
                    leftStop = cars[ind].rear - 1;
                } else {
                    leftStop = cars[ind].rear;
                }
                
                if (possibleMoves[ind].includes(cars[ind].front + 1)) { 
                    rightStop = cars[ind].front + 1 ;
                } else {
                    rightStop = cars[ind].front;
                }
                
                if (!buttonPressed(event)) {
                    event.target.removeEventListener("mousemove", movedX);
                    var oldFrontEdge = cars[ind].front % 7;
                    var newFrontEdge = Math.round((parseInt(event.target.style.left) + parseInt(event.target.style.width)) / scale);
                    let delta = newFrontEdge - oldFrontEdge;
                    cars[ind].front += delta;
                    cars[ind].rear  += delta;
                    possibleMoves = cars.moves();
                    squareUp(event.target);
                
                } else {
                    let dist = event.pageX - lastX;
                    
                    if (dist >= 0) {
                        var leadingEdge = parseInt(event.target.style.left)  + parseInt(event.target.style.width);
                            
                        if (leadingEdge + 3*2.1 < (rightStop % 7) * scale) { // constant added to prevent overlaps.
                            event.target.style.left = event.target.offsetLeft + 3*Math.atan(dist) + "px"; // atan smooths large
                        }                                                                                 //   mouse motions
                    
                    } else {
                        var leadingEdge = parseInt(event.target.style.left);
                        if (leadingEdge - 3*2.1 > ((leftStop -1) % 7)*scale) {
                            event.target.style.left = event.target.offsetLeft + 3*Math.atan(dist) + "px";
                        }
                    }
                }
            }
            //end movedX
        } // end horizontal
        if (carElt.className =="vertical") { // vertical car-sliding functionality
            var lastY;           
            carElt.addEventListener("mousedown", function(event) {
                if (event.which == 1) {
                    lastY = event.pageY;
                    event.target.addEventListener("mousemove", movedY);
                    event.preventDefault(); // Prevent selection
                }
            });
        
            function buttonPressed(event) {
                if (event.buttons == null) {
                    return event.which != 0;
                } else {
                    return event.buttons != 0;
                }
            }
            
            function movedY(event) {
                var ind = carElts.indexOf(event.target);
                var upStop, downStop; // how far up and down the car can move
                if (possibleMoves[ind].includes(cars[ind].rear - 7)) {
                    upStop = cars[ind].rear - 7;
                } else {
                    upStop = cars[ind].rear;
                }   
                
                if (possibleMoves[ind].includes(cars[ind].front + 7)) { 
                    downStop = cars[ind].front + 7 ;
                } else {
                    downStop = cars[ind].front;
                }
                
                if (!buttonPressed(event)) {
                    event.target.removeEventListener("mousemove", movedY);
                    var oldFrontEdge = cars[ind].front;
                    var newRow = Math.round((parseInt(event.target.style.top) + parseInt(event.target.style.height)) / scale);  
                    var newFrontEdge = 7 * (newRow - 1) + (oldFrontEdge % 7);
                    let delta = newFrontEdge - oldFrontEdge;
                    cars[ind].front += delta;
                    cars[ind].rear  += delta;
                    possibleMoves = cars.moves();
                    squareUp(event.target);
                } else {
                    let dist = event.pageY - lastY;
                    if (dist >= 0) {
                        var leadingEdge = parseInt(event.target.style.top)  + parseInt(event.target.style.height);
                                
                        if (leadingEdge + 3*2.1 < (Math.ceil(downStop / 7)*scale)) {
                                    event.target.style.top = event.target.offsetTop + 3*Math.atan(dist) + "px";
                        }
                    } else {
                        var leadingEdge = parseInt(event.target.style.top);
                        if (leadingEdge - 3*2.1 > Math.floor(upStop / 7)*scale) {
                            event.target.style.top = event.target.offsetTop + 3*Math.atan(dist) + "px";
                        }
                    }
                }
            }
        } // end vertical
    }
return table;
}

DOMDisplay.prototype.addDropdown = function () {
    var dropdown = elt("select");
    var please = document.createElement("option");
    please.text = "Please select puzzle"
    please.value = null;
    dropdown.appendChild(please);
    for (i = 1; i < 41; i++) {
        var opt= document.createElement("option");
        opt.text = String(i);
        opt.value = i;
        dropdown.appendChild(opt);
    }
    var t = this;
    dropdown.addEventListener("change", function() {
        var number = 0;
        for (var i = 1; i < this.options.length; i++) {
            
            var opt = this.options[i];
            if (opt.selected)
                number += Number(opt.value);
        }
        console.log("Puzzle ", number);
        initPuzzle(number);
       
        while (t.wrap.hasChildNodes()) {
            t.wrap.removeChild(t.wrap.lastChild);
        }
        var board1 = t.wrap.appendChild(t.drawBackground());
        board1.appendChild(t.addDropdown());
        board1.appendChild(t.addHint());
        board1.appendChild(t.addBF());
        board1.appendChild(t.addP());
    });
    return dropdown;
}

DOMDisplay.prototype.addBF = function() {
    var bfButton = elt("button");
    var bfText = document.createTextNode("Solve with BFS");
    bfButton.appendChild(bfText);
    bfButton.addEventListener("click", show);
    return bfButton;
}

DOMDisplay.prototype.addP = function() {
    var pButton = elt("button");
    var pText = document.createTextNode("Solve with planning");
    pButton.appendChild(pText);
    pButton.addEventListener("click", show);
    return pButton;
}

DOMDisplay.prototype.addHint = function() {
    var hintButton = elt("button");
    var hintText = document.createTextNode("Get hint");
    hintButton.appendChild(hintText);
    hintButton.addEventListener("click", show);
    return hintButton;
}

var show = function(event) {  // this function is called by the buttons' event handlers
    if (event.target.textContent === "Get hint") {
        var afrontier = [new solvers.aPath([], cars, solvers.goalmoves(cars))];
        var sol = solvers.ps([], afrontier);
        sol = mergeMoves(sol);
        var hs = display.wrap.getElementsByClassName("horizontal");
        var vs = display.wrap.getElementsByClassName("vertical");
        var i = 0;
    
        function animateMove(j) {
            cars.move(sol[j]);
            for (h in hs) {squareUp(hs[h])};
            for (v in vs) {squareUp(vs[v])};
        }
        animateMove(0);
        
    
    } else if (event.target.textContent == "Solve with BFS") {
        var buttons = document.querySelectorAll("button");
        for (b in [0,1,2]) {
            buttons[b].removeEventListener("click",show);
        }
        bfShow();
        
    } else {
        var buttons = document.querySelectorAll("button");
        for (b in [0,1,2]) {
            buttons[b].removeEventListener("click",show);
        }
        pShow();
    }
}

;(function(exports) {
    
function gridRep(grid) {  // represents a grid as a string for checking whether two grids are equal
    return grid.map(function(car) {return car.front.toString()}).reduce(function(acc, val) {return acc += val})
}  

function solved(grid) { //  "is this grid a solved puzzle?"
    return grid[0].front == 20
}

// The following is the functions for the BFS-based solver.

function Path(ms, grid) { // A path consists of a list of moves & the resulting grid arrangement. 
    this.ms = ms;
    this.grid  = grid;
}

function succs(path) {              // returns a list of paths, each extending "path" by one move
    var ms = path.ms;
    var nextMs = path.grid.moves();  // list of lists of moves each car can make from path.grid
    var successors = [];           
    for (i in nextMs) {             // i is a car index
        if (nextMs[i].length > 0) { //nextMs[i][j] is the jth move the ith car can make from path.grid
            for (j in nextMs[i]){ 
                m = new Move(i, nextMs[i][j]); 
                var msCopy = []
                msCopy = ms.map(c => Object.assign({}, c));
                msCopy.push(m);
                var newGrid = path.grid.copyGrid().move(m);
                successors.push(new Path(msCopy, newGrid));
            }
        }
    }
    return successors;
}

/* 
Breadth-first search. Goes through all possible moves, which guarantees that the 
returned solution is the shortest one. Also can be slow.

gridList contains strings representing visited grids;
frontier is a list of paths left to explore
*/

function bfs(gridList, frontier) {  
    while (frontier.length > 0) {
        var currentPath = frontier.shift();
        if (solved(currentPath.grid)) {
            return currentPath.ms;
        } else if (!gridList.includes(gridRep(currentPath.grid))) {
            gridList.unshift(gridRep(currentPath.grid));
            frontier = frontier.concat(succs(currentPath)); // add successor paths to end of frontier
        }
    }
} 

/* Next is a solver "planning-based" search, as described by Richard Bird 
  in _Pearls of Functional Algorithm Design_. 
  
  The idea is to augment a path with a "plan" -- a list of moves that, if they were 
  possible, would solve the puzzle. Start by looking at the white truck. Say
  the front is in cell 17. Then getting to the exit requires the moves
  [{index:0, cell: 18}, {index:0, cell: 19}, {index:0, cell: 20}].
  That's the initial plan. If the first move is possible, make it. If not,
  then "make a new plan" that clears the blocking cars -- explore backward,
  in a depth-first manner until you reach a move that can be made from the 
  grid.

  It requires more machinery but can be much faster in some cases. Doesn't 
  guarantee a shortest solution, but tends to be fairly close.  
*/

function aPath(ms, grid, plan) { // augmented path
    this.ms    = ms;             
    this.grid  = grid;
    this.plan  = plan;
}

function goalmoves(grid) { // returns a list of the moves needed to bring the white truck to the exit
    var gMoves = [];
    for (var i=1; i < 7; i++) {
        gMoves.push(new Move(0, grid[0].front+i));
    }
    return gMoves;
}

function expand(grid, m) { // Cars move one cell at a time. This turns multi-cell moves 
    var ms = [];           // into a sequence of single-cell moves
    if (grid[m.index].direction === "horizontal") {
        if (m.cell < grid[m.index].rear) {
            for (var i = 1; grid[m.index].rear - i >= m.cell; i++) {
                ms.push(new Move(m.index, grid[m.index].rear - i));
            }
        } else {
            for (var i = 1; grid[m.index].front + i <= m.cell; i++) {
                ms.push(new Move(m.index, grid[m.index].front +i));
            }
        }
    }
    
    else if (m.cell < grid[m.index].rear) {
        for (var i = 7; grid[m.index].rear - i >= m.cell; i+=7) {
            ms.push(new Move(m.index, grid[m.index].rear - i));
        }
    } else {
        for (var i = 7; grid[m.index].front + i <=m.cell; i +=7) {
            ms.push(new Move(m.index, grid[m.index].front +i));
        }
    }
    return ms;
}

function not_in_plan(p, move) { // ensures does not repeat a move from plan p; prevents infinite loops
    for (j in p) {
        if (p[j].index == move.index && p[j].cell == move.cell) {
            return false
        }
    }
    return true
}

function blocker(grid, cell) { //returns index of car blocking a cell
    for (var i = 0; i < grid.length; i++) {
        if (grid[i].covers(cell)) {
            return i;
        }
    }
}

function premoves(grid, m) { // if move m is blocked, returns a list of "premoves" that move the blocking car
    var pres = [];
    var b = blocker(grid, m.cell);
    if (b === undefined) {
        return pres;
    } else {
        for (l in grid[b].freeingMoves(m.cell)) {
            pres.unshift(grid[b].freeingMoves(m.cell)[l].map(function(c) {return new Move(b, c)}));
        }
    }
    return pres;
}   

function mkplans(grid, ps) { // the workhorse...makes plans in depth-first manner
    ps = ps.map(c => Object.assign({}, c));
    var p = ps.shift();
    //ps = multiConcat([expand(grid, p), ps]);
    ps = [expand(grid, p), ps].reduce(function(a,b) {return a.concat(b)});
    var madeplans = [];
    var pss = [ps];
    
    while (pss.length > 0) { 
        var firstPlan = pss.pop();
        if (grid.moves()[firstPlan[0].index].includes(firstPlan[0].cell)) {
            madeplans.push(firstPlan);
        } else {
            function not_in_firstPlan(a) {
                return not_in_plan(firstPlan, a);
            }
            
            var pres = premoves(grid, firstPlan[0]);
            
            for (pre in pres) {
                if (pres[pre].length == pres[pre].filter(not_in_firstPlan).length && pres[pre].length >0) {
                    //pss.push(multiConcat([pres[pre], firstPlan]));
                    pss.push([pres[pre], firstPlan].reduce(function(a,b) {return a.concat(b)}));
                }
            }
        }
    }
    return madeplans;    
}

function asuccs(augP) {
    augpath = Object.assign({}, augP);
    
    var a = mkplans(augpath.grid, augpath.plan);
    var as = [];
    for (i in a) {
        if (a[i].length > 0) {
            var aMoves = augpath.ms.map(c => Object.assign({}, c));
            var aGrid = augpath.grid.copyGrid();
            var aPlan = augpath.plan.map(c => Object.assign({}, c));
            var m = a[i].shift();
            var augie = new aPath(aMoves, aGrid, a[i]);
            
            augie.ms.push(m);
            augie.grid.move(m);
            as.push(augie);
        }
    }
    return as;
}
    
function bsuccs(augP) {
    augpath = Object.assign({}, augP);
    var possibles = augpath.grid.moves();
    var bs = [];
    for (i in possibles) {
        if (possibles[i].length > 0) {
            for (j in possibles[i]){
                var aMoves = augpath.ms.map(c => Object.assign({}, c));
                var em = new Move(i, possibles[i][j]);
                aMoves.push(em);
                var aGrid = augpath.grid.copyGrid();
                
                aGrid.move(em);
                var aPlan = goalmoves(aGrid);
                var augie = new aPath(aMoves, aGrid, aPlan);
                bs.push(augie);
            }
        }
    }
    return bs;
}

function ps(gridList, augfrontier) {
    while (augfrontier.length > 0) {
        firstPath = augfrontier.shift();
        if (solved(firstPath.grid)) {
            return firstPath.ms;
        } else if (!gridList.includes(gridRep(firstPath.grid))) {
            gridList.unshift(gridRep(firstPath.grid));
            var a = asuccs(firstPath);
            for (i in a) {
                augfrontier.unshift(a[i]);
            }
            var b = bsuccs(firstPath);
            for (j in b) {
                augfrontier.push(b[j]);
            }
        }
    }
}

function multiConcat(lists) {
    var combiList = [];
    for (l in lists) {
        combiList = combiList.concat(lists[l]);
    }
    return combiList;
}
    
if (exports.solvers === void 0) exports.solvers = {};
exports.solvers = {
    gridRep,
    solved,
    Path,
    succs,
    bfs,
    aPath,
    goalmoves,
    expand,
    not_in_plan,
    blocker,
    premoves,
    mkplans,
    asuccs,
    bsuccs,
    ps,
    multiConcat,
};
})(this);
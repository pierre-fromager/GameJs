function Maze ( rows, cols){
    this.rows = rows;
    this.scale = 4;
    this.cols = cols;
    this.exitRow = this.rows - 1;
    this.exitCol = this.cols;
    this.generation = [];
    this.map = [];
    this.dcol = [1, 0, -1, 0];
    this.drow = [0, -1, 0, 1];
    this.svis = [];
    this.ssol = [];
    this.mazesol = [];
    if (rows && cols) {
        this.generate();
        this.setMap();   
    }
}

Maze.prototype.generate = function (){
    var x = this.rows;
    var y = this.cols;
    var n = x * y - 1;

    if (n<0) {
        console.error('illegal maze dimensions');
        return;
    }
    var horiz =[];
    for (var j= 0; j<x+1; j++) horiz[j]= [],
        verti =[];
    for (var j= 0; j<x+1; j++) verti[j]= [],
        here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)],
        path = [here],
        unvisited = [];
    for (var j = 0; j<x+2; j++) {
        unvisited[j] = [];
        for (var k= 0; k<y+1; k++) {
            unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
        }
    }
    while (0<n) {
        var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
        [here[0]-1, here[1]], [here[0],here[1]-1]];
        var neighbors = [];
        for (var j = 0; j < 4; j++) {
            if (unvisited[potential[j][0]+1][potential[j][1]+1])
                neighbors.push(potential[j]);
        }
        if (neighbors.length) {
            n = n-1;
            next= neighbors[Math.floor(Math.random()*neighbors.length)];
            unvisited[next[0]+1][next[1]+1]= false;
            if (next[0] == here[0])
                horiz[next[0]][(next[1]+here[1]-1)/2]= true;
            else 
                verti[(next[0]+here[0]-1)/2][next[1]]= true;
            path.push(here = next);
        } else 
            here = path.pop();
    }
    this.generation = {
        x: x, 
        y: y, 
        horiz: horiz, 
        verti: verti
    };
}

Maze.prototype.solution = function(map,dimension){
    var map = (map) ? map : this.map;
    var dimension = (dimension) ? dimension : (this.cols * 2) + 1;
    this.mazesol = map.split(dimension);
    this.svis = [];
    this.ssol = [];
    this.solve(1, 1);
    this.svis = [];
}

Maze.prototype.solve = function( row, col ){
    var dirCount = 4;
    var direction = 0;
    var tmpIndex = tempRow = tempCol = '';
    var isVisited = false;
    this.svis.push(row + ',' + col);
    this.ssol.push(col + ',' + row);
    if ((row == this.exitRow) && (col == this.exitCol)) return true;
    var dirOffset = Math.floor(Math.random() * dirCount);
    for (var i = 0; i < dirCount; i++)
    {
        direction = (dirOffset + i) % dirCount;
        if (this.mazesol[row][col] == 'e')
        {
            tempRow = row + this.drow[direction];
            tempCol = col + this.dcol[direction];
            tmpIndex = tempRow + ',' + tempCol;
            isVisited = this.svis.indexOf(tmpIndex) !== -1;
            if (!isVisited && this.solve(tempRow, tempCol)) return true
        }
    }
    this.ssol.pop();
    return false;
};

Maze.prototype.draw = function(cr) {
    cr = (cr) ? '\r\n' : '';
    var text= [];
    var m = this.generation;
    var scale = 4;
    for (var j= 0; j<m.x*2+1; j++) {
        var line= [];
        if (0 == j%2) {
            for (var k=0; k<m.y*scale+1; k++)
                if (0 == k%scale) 
                    line[k]= '+';
                else
                if (j>0 && m.verti[j/2-1][Math.floor(k/scale)])
                    line[k]= ' ';
                else
                    line[k]= '-';
        }
        else
            for (var k=0; k<m.y*scale+1; k++)
                if (0 == k%scale)
                    if (k>0 && m.horiz[(j-1)/2][k/scale-1])
                        line[k]= ' ';
                    else
                        line[k]= '|';
                else
                    line[k]= ' ';
        if (0 == j) line[1]= line[2]= line[3]= 'i';
        if (m.x*2-1 == j) line[scale*m.y]= 'o';
        text.push(line.join('') + cr);
    }
    var display = text.join('');
    return display;
}

Maze.prototype.setMap = function() {
    var m = this.draw(true);
    m = m.replaceArrayLit(
        [  '+---', '|   ', '    ', '+   ', '+', '|', ' ', 'iii']
        , ['ww'  , 'we'  , 'ee'  , 'we'  , 'w', 'w', 'e', 'i']
    );
    m = m.replace(/[\n\r]/g, '');
    this.map = m.splitLength(1);
}


function Life(h, w) {
    this.step = 0;
    this.rows = h;
    this.cols = w;
    this.area = this.initArea();
    this.alive = [];
    this.died = [];

}
Life.prototype.initArea = function () {
    console.log("Fill area");
    var area = [];
    for (var i = 0; i < this.rows; i++) {
        area[i] = [];
        for (var j = 0; j < this.cols; j++) {
            area[i][j] = 0;
        }
    }
    return area
};

Life.prototype.setCell = function (h, w) {
    this.area[h][w] = 1
};

Life.prototype.invertCell = function (h, w) {
    this.area[h][w] = this.area[h][w] == 0 ? 1 : 0
};

Life.prototype.oneStep = function (a) {
    var live = [],
        died = []
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
            if (this.area[i][j] == 0 && this.lookAround(i, j) == 3) {
                live.push([i, j])
            }
            if (this.area[i][j] == 1 && this.lookAround(i, j) < 2 || this.lookAround(i, j) > 3) {
                died.push([i, j])
            }
        }
    }
    live.forEach(function (el) {
        this.area[el[0]][el[1]] = 1
    }, this);
    died.forEach(function (el) {
        this.area[el[0]][el[1]] = 0
    }, this);
    this.alive = live
    this.died = died
    this.step += 1
};

Life.prototype.ranomize = function () {
    var area = []
    for (var i = 0; i < this.rows; i++) {
        area[i] = [];
        for (var j = 0; j < this.cols; j++) {
            area[i][j] = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
        }
    }
    this.area = area
    this.step = 0;
}

Life.prototype.lookAround = function (h, w) {
    var livecols = 0;
    if (this.getCell(h - 1, w - 1) == 1) livecols += 1;
    if (this.getCell(h - 1, w) == 1) livecols += 1;
    if (this.getCell(h - 1, w + 1) == 1) livecols += 1;
    if (this.getCell(h, w - 1) == 1) livecols += 1;
    if (livecols > 3 ) return livecols
    if (this.getCell(h, w + 1) == 1) livecols += 1;
    if (livecols > 3 ) return livecols
    if (this.getCell(h + 1, w - 1) == 1) livecols += 1;
    if (livecols > 3 ) return livecols
    if (this.getCell(h + 1, w) == 1) livecols += 1;
    if (livecols > 3 ) return livecols
    if (this.getCell(h + 1, w + 1) == 1) livecols += 1;

    return livecols
};

Life.prototype.getCell = function (h, w) {
    if (h >= 0 && h < this.rows && w >= 0 && w < this.cols) {
        return this.area[h][w]
    } else {
        return 0
    }
};


function RleImport (life){
    this.life = life;
}
RleImport.prototype.pars = function(str) {
    if (str.value == 'Вставьте свой код RLE шаблона') return false;
    var params = str.value.split('\n', 1)[0].split(",").map(function (x) {
        return x.split("=")[1]
    });
    var x = +params[0],
        y = +params[1];
    this.life.rows = y + 6;
    this.life.cols = x + 6;

    this.life.area = this.life.initArea();
    var lines = str.value.match(/((\d{0,3})([bo$!]))/g);
    var row = 3,
        col = 3;
    for (var i = 0; i < lines.length; i++) {
        var number = lines[i].match(/(\d{0,3})/)[0] == '' ? 1 : +lines[i].match(/(\d{0,3})/)[0],
            last_symbol = lines[i][lines[i].length - 1];
        if (last_symbol == '!') {
            t = new TableLifeView(this.life);
            t.render()
        } else if (last_symbol == 'b') {
            col += number
        } else if (last_symbol == 'o') {
            for (var j = 0; j < number; j++) {
                this.life.setCell(row, col)
                col += 1
            }
        } else if (last_symbol == '$') {
            if (number == 1) {
                row += 1
            } else {
                row += number
            }
            col = 3
        }
    }
    return 'Success'
};

function TableLifeView(life) {
    this.game = life;
    this.div = document.getElementById('lifegame')
}

TableLifeView.prototype.render = function () {
    var table = document.createElement('table'),
        step = document.querySelector('.step');
    step.innerText = this.game.step;
    this.div.innerText = '';

    for (var i = 0; i < this.game.rows; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < this.game.cols; j++) {
            var td = document.createElement('td');
            if (this.game.getCell(i, j)) {
                td.setAttribute('class', 'live')
            }
            td.setAttribute("data-h", i);
            td.setAttribute("data-w", j);
            tr.appendChild(td)
        }
        table.appendChild(tr);
    }
    this.div.appendChild(table)
    var game = this.game;
    var allTd = document.querySelectorAll('td');
    [].forEach.call(allTd, function (el) {
        el.addEventListener("click", function (event) {
            var h = event.target.getAttribute('data-h'),
                w = event.target.getAttribute('data-w');
            if (window.gameStatus == "pause") {
                game.invertCell(h, w);
                t.render(document.getElementById('lifegame'))
            }
        })
    })
};

TableLifeView.prototype._render = function () {
    var step = document.querySelector('.step'),
        table = document.querySelector('table');
    step.innerText = this.game.step;
    for(var line = 0;line < this.game.alive.length; line++){
        var h = this.game.alive[line][0],
            w = this.game.alive[line][1]
        table.rows[h].cells[w].setAttribute('class', 'live')
    }
    for(var line = 0;line < this.game.died.length; line++){
        var h = this.game.died[line][0],
            w = this.game.died[line][1]
        table.rows[h].cells[w].removeAttribute('class')
    }
};


var l = new Life(22, 19),
    r = new RleImport(l)

l.setCell(5, 8);
l.setCell(5, 9);
l.setCell(5, 10);
l.setCell(6, 9);
l.setCell(7, 9);
l.setCell(8, 8);
l.setCell(8, 9);
l.setCell(8, 10);

l.setCell(10, 8);
l.setCell(10, 9);
l.setCell(10, 10);
l.setCell(11, 8);
l.setCell(11, 9);
l.setCell(11, 10);

l.setCell(13, 8);
l.setCell(13, 9);
l.setCell(13, 10);
l.setCell(14, 9);
l.setCell(15, 9);
l.setCell(16, 8);
l.setCell(16, 9);
l.setCell(16, 10);

t = new TableLifeView(l)
t.render(document.getElementById('lifegame'))
window.gameStatus = "pause";
speed = 10
function togglePause() {
    if (window.gameStatus == 'pause') {
        window.gameStatus = setInterval(tick, speed);
    } else {
        clearInterval(window.gameStatus);
        window.gameStatus = 'pause';
    }
}

tick = function () {
    l.oneStep();
    t._render()
};
reinit = function () {
    h = document.getElementById('h').value
    w = document.getElementById('w').value
    l = new Life(h, w);
    t = new TableLifeView(l)
    t.render()
};


/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 17.06.2018
 * Time: 21:16
 *
 *
 */

var minesweeper_app = new Vue({
    el: '#minesweeper',
    data: {
        levels : [
            {
                code : 'easy',
                size : 3,
                title : "Легкий",
            },
            {
                code : 'normal',
                size : 6,
                title : "Нормальный",
            },
            {
                code : 'hard',
                size : 9,
                title : "Сложный",
            },
            {
                code : 'unreal',
                size : 15,
                title : "Очень сложный",
            }
        ],
        level : {},
        game_started : false,
        game_over : false,
        game_won : false,
        timer : 0,
        game_time_seconds : 0,
        cells : [],
        mines_count : 0,
        marked_count : 0,
        opened_count : 0,
    },
    computed : {
        game_time_formated : function () {
            var result = "";

            result += Math.round(this.game_time_seconds / 3600) + "h ";
            result += Math.round(this.game_time_seconds % 3600 / 60) + "m ";
            result += Math.round(this.game_time_seconds % 60) + "s ";

            return result;
        }
    }, mounted : function() {
        // raped start normal game while develop mode
        this.level = this.levels[ 3 ]; // unreal
        this.start_game();
    },
    methods : {
        repeat_game : function () {
            location.reload(); // TODO implement repeat game func :)
        },
        start_game : function () {
            if (!this.level.code){
                alert("Нужно выбрать уровень!");
                return;
            }

            this.game_started = true;
            this.game_over = false;
            this.init_cells();

            // start game timer
            this.timer = setInterval(function () {
                minesweeper_app.game_time_seconds++;
            }, 1000);
        },
        init_cells : function () {
            // wait while filed render
            this.$nextTick(function () {
                var cells_objects = [];
                var cells = $("#minesweeper .cell");
                var i = 0;

                for (; i < cells.length; i++){
                    let cell = new Cell(cells[ i ]);
                    $(cells[ i ]).data("cell", cell);

                    cells_objects.push(cell);
                }

                this.cells = cells_objects;
            });
        },
        add_mines : function (start_cell) {
            // TODO improve mines count generation algoritm, depend on field size
            var count_min = Math.pow(this.level.size, 2) / 5;
            var count_max = count_min * 1.5;

            var mines_count = this.randomIntFromInterval(count_min, count_max);
            var cells_objects = this.cells;
            var i = 0;

            // add mines
            let shuffled_cells = this.shuffle(cells_objects);
            for (i = 0; i < mines_count; i++){
                let cell = shuffled_cells[ i ];

                if (cell === start_cell){
                    mines_count--;
                    continue;
                }

                cell.has_mine = true;
            }

            this.mines_count = mines_count;

            for (i = 0; i < cells_objects.length; i++){
                let cell = cells_objects[ i ];

                cell.around_cells = this.getAroundCells(i);
                cell.mines_cells_around_count = this.getAroundCellWithMinesCount(i, cells_objects);
            }
        },

        getAroundCellWithMinesCount : function(cell_index, cells){
            /*
            * Algoritm
            * - imagine quadro matrix, with size = this.size ^ 2
            * - split by rows
            * - check siblings on same row - max = 2
            * - check siblings above and below rows - max = 6
            * */
            let count = 0;
            let size = this.level.size;
            let cell_row = Math.floor(cell_index / size) ;
            let cell_col = cell_index % size;

            /*
            * lets imagine mini matrix with all possible around cells
            * current cell - is E cell, with coords (X=1;Y=1)
            * A|B|C
            * D|E|I
            * F|G|H
            *
            * now lets calc around cells coords diff
            * A = x-1;y-1
            * B = x;y-1
            * C = x+1;y-1
            * D = x-1;y
            * E - current cell - skip :)
            * I = x+1;y
            * F = x-1;y+1
            * G = x;y+1
            * H = x+1;y+1
            * */
            let around_cells_diff_coords = [
                [-1, -1], // A
                [0, -1],  // B
                [1, -1],  // C
                [-1, 0],  // D
                          // E - current cell - skip :)
                [1, 0],   // I
                [-1, 1],  // F
                [0, 1],   // G
                [1, 1],   // G
            ];

            let i = 0;
            for (; i < around_cells_diff_coords.length; i++){
                let around_cell_col = cell_col + around_cells_diff_coords[ i ][ 0 ];
                let around_cell_row = cell_row + around_cells_diff_coords[ i ][ 1 ];

                // check around cell coords exists
                if (
                    around_cell_row >= 0 && around_cell_row < size
                    && around_cell_col >= 0 && around_cell_col < size
                ) {
                    let around_cell_index = around_cell_row * size + around_cell_col;
                    let around_cell = cells[ around_cell_index ];

                    if (around_cell.has_mine)
                        count++;
                }
            }

            return count;
        },

        getAroundCells : function(cell_index){
            let cells_around = [];
            let size = this.level.size;
            let cell_row = Math.floor(cell_index / size) ;
            let cell_col = cell_index % size;

            /*
            * lets imagine mini matrix with all possible around cells
            * current cell - is E cell, with coords (X=1;Y=1)
            * A|B|C
            * D|E|I
            * F|G|H
            *
            * now lets calc around cells coords diff
            * A = x-1;y-1
            * B = x;y-1
            * C = x+1;y-1
            * D = x-1;y
            * E - current cell - skip :)
            * I = x+1;y
            * F = x-1;y+1
            * G = x;y+1
            * H = x+1;y+1
            * */
            let around_cells_diff_coords = [
                [-1, -1], // A
                [0, -1],  // B
                [1, -1],  // C
                [-1, 0],  // D
                          // E - current cell - skip :)
                [1, 0],   // I
                [-1, 1],  // F
                [0, 1],   // G
                [1, 1],   // G
            ];

            let i = 0;
            for (; i < around_cells_diff_coords.length; i++){
                let around_cell_col = cell_col + around_cells_diff_coords[ i ][ 0 ];
                let around_cell_row = cell_row + around_cells_diff_coords[ i ][ 1 ];

                // check around cell coords exists
                if (
                    around_cell_row >= 0 && around_cell_row < size
                    && around_cell_col >= 0 && around_cell_col < size
                ) {
                    let around_cell_index = around_cell_row * size + around_cell_col;
                    let around_cell = this.cells[ around_cell_index ];

                    cells_around.push(around_cell);
                }
            }

            return cells_around;
        },
        open_cell : function (event) {
            if (this.game_over)
                return;

            var cell = $(event.target).data("cell");

            if (cell.is_opened || cell.is_marked)
                return;

            // then open first cell
            if (!this.mines_count){
                this.add_mines(cell);
            }

            var has_mine = cell.open();

            if (has_mine) {
                this.end_game(false);
            }

            this.opened_count++;
            this.check_game_won();
        },
        check_game_won : function (){
            let field_size = Math.pow(this.level.size, 2);

            // if all cells with mines is marked, and all other cells is opened - user has won!
            if (field_size - this.opened_count == this.marked_count && this.marked_count == this.mines_count)
                this.end_game(true);
        },
        mark_cell : function (event) {
            if (this.game_over)
                return;

            var cell = $(event.target).data("cell");

            if (cell.is_opened)
                return;

            if (!cell.is_marked) {
                cell.mark();
                this.marked_count++;
                this.check_game_won();
            }
            else {
                cell.unmark();
                this.marked_count--;
            }
        },
        end_game : function (win) {
            clearInterval(this.timer);
            this.game_over = true;
            this.game_won = win;

            if (!win) {
                for (let i = 0; i < this.cells.length; i++){
                    let cell = this.cells[ i ];
                    cell.open();
                }
            }
        },

        randomIntFromInterval : function (min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        },
        /**
         * Shuffles array in place.
         * @param {Array} a items An array containing the items.
         */
        shuffle : function shuffle(a) {
            var result = a.slice(0);

            var j, x, i;
            for (i = result.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = result[i];
                result[i] = result[j];
                result[j] = x;
            }
            return result;
        }
    },
});
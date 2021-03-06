/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 17.06.2018
 * Time: 21:16
 *
 *
 */

// if user income from shared url from fb - remove special page params
if (location.search)
    history.pushState("", "", "/");

new Vue({
    el: '#minesweeper',
    data: {
        levels : [
            {
                size : 3,
                title : "Детский",
                min_window_size : 320,
            },
            {
                size : 5,
                title : "Разминка",
                min_window_size : 320,
            },
            {
                size : 7,
                title : "Нормальный",
                min_window_size : 320,
            },
            {
                size : 10,
                title : "Сложный",
                min_window_size : 320,
            },
            {
                size : 15,
                title : "Очень сложный",
                min_window_size : 450,
            },
            {
                size : 19,
                title : "Нереальный",
                min_window_size : 560,
            }
        ],
        level : {},
        is_level_selected : false,
        game_started : false,
        game_over : false,
        game_won : false,
        timer : 0,
        game_time_seconds : 0,
        cells : [],
        mines_count : 0,
        marked_count : 0,
        opened_count : 0,

        game_screen_url : "",
        screen_saved : false,
        screening : false,
    },
    computed : {
        share_url_vk : function(){
            let comment = (this.game_won ? "Я выиграл " : "Я проиграл ") + "в игре «Сапёр» на vue.js :) Попробуй и ты!";
            let shareUrl = location.origin + "&game_over=" + (this.game_over ? "Y" : "N") + "&game_won=" + (this.game_won ? "Y" : "N");
            console.log("share_url_vk", shareUrl);

            url  = 'http://vkontakte.ru/share.php?';
            url += 'url='          + encodeURIComponent(location.origin);
            url += '&title='       + encodeURIComponent(comment) ;
            url += '&image='       + encodeURIComponent(location.origin + "/upload/" + this.game_screen_url);
            url += '&noparse=true';

            return url;
        },
        share_url_fb : function(){
            let shareUrl = location.origin + "?screen=" + this.game_screen_url + "&game_over=" + (this.game_over ? "Y" : "N") + "&game_won=" + (this.game_won ? "Y" : "N");
            console.log("share_url_fb", shareUrl);

            url  = 'http://www.facebook.com/sharer.php?s=100';
            url += '&u=' + encodeURIComponent(shareUrl);

            return url;
        },
        game_time_formated : function () {
            var result = "";

            result += Math.round(this.game_time_seconds / 3600) + ":";
            result += Math.round(this.game_time_seconds % 3600 / 60) + ":";
            result += Math.round(this.game_time_seconds % 60) + "";

            return result;
        }
    }, mounted : function() {

        // rapid start normal game by default
        let level = this.levels[ 1 ]; // normal
        this.prepare_game(level);
    },
    methods : {
        save_screen : function() {
            this.screening = true;
            let minesweeper_app_context = this;

            // fix of wrong screenshoting
            $(".animated").removeClass("animated");

            html2canvas(document.querySelector("#minesweeper")).then(canvas => {
              // document.body.appendChild(canvas)

                var imagedata = canvas.toDataURL('image/png');
                var imgdata = imagedata.replace(/^data:image\/(png|jpg);base64,/, "");

                let formData = new FormData();
                formData.append('imgdata', imgdata);

                fetch('/save_screen.php', {method: 'POST', body: formData,})
                    .then(function (data) {
                        data.json().then(function(data) {
                            minesweeper_app_context.screen_saved = true;
                            minesweeper_app_context.screening = false;
                            minesweeper_app_context.game_screen_url = data.image;
                        });

                        console.log('Request success: ', data);
                    })
                    .catch(function (error) {
                        console.log('Request failure: ', error);
                        alert("Что-то пошло не так :(");
                    });
            });
        },
        select_game_level : function () {
            this.game_started = false;
            this.game_over = false;
            this.game_won = false;
            this.mines_count = 0;
            this.marked_count = 0;
            this.opened_count = 0;

            this.is_level_selected = false;
            this.cells = [];

            this.reset_timer();

            this.screen_saved = false;
        },
        reset_game : function () {
            this.is_level_selected = true;
            this.game_started = false;
            this.game_over = false;
            this.game_won = false;
            this.mines_count = 0;
            this.marked_count = 0;
            this.opened_count = 0;

            // clear mines and close cells
            for (let i = 0; i < this.cells.length; i++){
                this.cells[ i ].reset();
            }

            this.reset_timer();

            this.screen_saved = false;
        },
        prepare_game : function (level) {
            this.level = level;
            this.is_level_selected = true;
            this.game_over = false;
            this.init_cells();
        },
        start_game : function (start_cell) {
            this.game_started = true;
            this.add_mines(start_cell);
            this.start_timer();
        },
        start_timer : function() {
            let minesweeper_app_context = this;

            this.timer = setInterval(function () {
                minesweeper_app_context.game_time_seconds++;
            }, 1000);
        },
        stop_timer : function() {
            clearInterval(this.timer);
        },
        reset_timer : function() {
            this.game_time_seconds = 0;
            clearInterval(this.timer);
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
            var mines_count = Math.max(2, Math.floor(Math.pow(this.level.size, 2) / 6));
            var cells_objects = this.cells;

            // add mines
            let shuffled_cells = this.shuffle(cells_objects);
            var i = 0;
            var j = mines_count;

            for (; i < j; i++){
                let cell = shuffled_cells[ i ];

                // skip start cell, replace it with next random cell
                if (cell === start_cell){
                    j++;
                    continue;
                }

                cell.has_mine = true;
            }

            this.mines_count = mines_count;

            for (i = 0; i < cells_objects.length; i++){
                let cell = cells_objects[ i ];

                cell.around_cells = this.get_around_cells(i);
                cell.calc_around_cell_with_mines_count();
            }
        },
        get_around_cells : function(cell_index){
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
            if (!this.game_started){
                this.start_game(cell);
            }

            let success_opened_count = cell.open(true);

            if (cell.has_mine) {
                this.end_game(false);
            } else {
                this.opened_count += success_opened_count;
                this.check_game_won();
            }
        },
        check_game_won : function (){
            let field_size = Math.pow(this.level.size, 2);

            // if all cells with mines is marked, and all other cells is opened - user has won!
            if (field_size - this.opened_count == this.marked_count && this.marked_count == this.mines_count)
                this.end_game(true);
        },
        mark_cell : function (event) {
            if (this.game_over || !this.game_started)
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
            this.stop_timer();
            this.game_over = true;
            this.game_won = win;

            if (!win) {
                let shuffled_cells = this.shuffle(this.cells);
                let minesweeper_app_context = this;
                let animation_speed = this.level.size > 10 ? 5 : 20;

                for (let i = 0; i < this.cells.length; i++){
                    let cell = shuffled_cells[ i ];

                    if (cell.is_demined() || cell.is_opened)
                        continue;

                    if (cell.is_fail_marked()) {
                        // final stat will include only demined cells count
                        minesweeper_app_context.marked_count--;

                        // show failed cells instantly to do not wait end of opening animation
                        cell.show_fail();
                        continue;
                    }

                    setTimeout(function () {
                        // if user press "restart" button untill animation end
                        if (!minesweeper_app_context.game_over)
                            return;

                        cell.open(false);
                    }, animation_speed * i);
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
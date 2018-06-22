/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 18.06.2018
 * Time: 13:13
 *
 *
 */

'use strict';

class Cell {
    constructor(el) {
        this.$el = $(el);
        this.has_mine = false;
        this.is_opened = false;
        this.is_marked = false;

        // just declare fields, fill it later
        this.mines_cells_around_count = 0;
        this.around_cells = [];
    }

    mark() {
        this.is_marked = true;
        this.$el.addClass("flag");
        this.$el.html('<i class="fa fa-flag-checkered"></i>');
    }

    unmark() {
        this.is_marked = false;
        this.$el.removeClass("flag");
        this.$el.text("");
    }

    reset() {
        this.is_opened = false;
        this.is_marked = false;
        this.has_mine = false;
        this.mines_cells_around_count = 0;
        this.$el.attr("class","cell closed");
        this.$el.text("");
    }

    show_fail() {
        this.$el.addClass("failed");
        this.$el.html('<i class="fa fa-times-circle animated  bounceIn"></i>');
    }

    open(open_around) {
        let success_opened_counter = 0;
        this.is_opened = true;
        this.$el.removeClass("closed");

        if (this.has_mine){
            this.$el.addClass("mine");
            this.$el.html('<i class="fa fa-bomb animated  zoomIn"></i>');
        } else {
            this.$el.addClass("open");
            success_opened_counter++;

            if (this.mines_cells_around_count) {
                this.$el.addClass( this.get_count_class(this.mines_cells_around_count) );
                this.$el.text(this.mines_cells_around_count);
            } else {
                this.$el.text("");
            }

            // auto open all cells around, if there is no mines
            if (open_around) {
                if (!this.mines_cells_around_count) {
                    for (let i = 0; i < this.around_cells.length; i++){
                        let cell = this.around_cells[ i ];

                        if (!(cell.is_opened || cell.is_marked))
                            success_opened_counter += cell.open(true);
                    }
                }
            }
        }


        return success_opened_counter;
    }

    get_count_class(count_mines_around){
        let map = {
            1 : "one",
            2 : "two",
            3 : "three",
            4 : "four",
            5 : "five",
            6 : "six",
            7 : "seven",
            8 : "eight",
        };

        return map[ count_mines_around ];
    }


    calc_around_cell_with_mines_count (){
        let count = 0;

        for (let i = 0; i < this.around_cells.length; i++){
            let cell = this.around_cells[ i ];

            if (cell.has_mine)
                count++;
        }

        this.mines_cells_around_count = count;
    }

    is_demined(){
        return this.has_mine && this.is_marked;
    }

    is_fail_marked(){
        return !this.has_mine && this.is_marked;
    }

}
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
            }
        ],
        level : {},
        game_started : false,
        game_time_seconds : 0
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

    },
    methods : {
        start_game : function () {
            if (!this.level.code){
                alert("Нужно выбрать уровень!");
                return;
            }

            this.game_started = true;

            // start game timer
            setInterval(function () {
                minesweeper_app.game_time_seconds++;
            }, 1000)
        }
    }
});
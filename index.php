<?php
/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 17.06.2018
 * Time: 21:07
 *
 *
 */
 
 ?>
<!DOCTYPE html>
<html>
<head>
    <title>Игра "Сапёр" на vue.js, онлайн, бесплатно, без смс</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
    <link rel="stylesheet" href="/assets/css/main.css?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/css/main.css")?>" />
</head>
<body>
    <div id="minesweeper" class="minesweeper" v-cloak v-bind:style="{ width: level.min_window_size + 'px' }">
        
        <div >
            <div class="status_bar titlle">
                <div class="item" title="">Игра "Сапер"</div>
            </div>

            <div v-if="!is_level_selected">
                <div class="status_bar">
                    <p><strong>Выберите уровень</strong></p>
                    
                    <div class="line" v-for="level in levels">
                        <a class="item green" href="#"  @click.prevent="prepare_game(level)" >{{ level.title }} ({{ level.size }} x {{ level.size }})</a>
                    </div>
                </div>
            </div>
            
            <div v-if="is_level_selected">
                <div class="status_bar" >
                    <a href="https://derm.su/48c" class="item green" target="_blank">Правила</a>
                    <div class="item sep">|</div>
                    <a class="item green" href="#" @click.prevent="select_game_level" >Уровень</a>
                    <div class="item sep">|</div>
                    <a class="item green" href="#" @click.prevent="reset_game" v-bind:class="{ orange: game_over }">Заново</a>
                </div>

                <div class="status_bar" >
                    <div class="item" title="Режим игры"><i class="fas fa-signal"></i> {{level.title}}</div>
                    <div class="item" title="Время игры"><i class="far fa-clock"></i> {{game_time_formated}}</div>
                    <div class="item" title="Отмечено мин / Всего мин"><i class="fa fa-bomb"></i> {{marked_count}} /  {{mines_count}}</div>
                </div>

                <div class="table" v-bind:class="{ game_losed: game_over && !game_won }">
                    <template  v-for="item in level.size">
                        <div class="row">
                            <div v-for="item1 in level.size" class="cell closed" @click.left="open_cell" @click.right.prevent="mark_cell"></div>
                        </div>
                    </template>
                </div>

                <div class="status_bar" v-if="game_over" >
                    <div class="item " v-if="!game_won"><strong>Игра окончена, вы проиграли!</strong> <i class="far fa-frown"></i></div>
                    <div class="item " v-if="game_won"><strong>Ура, вы победили!</strong> <i class="far fa-thumbs-up"></i></div>
                </div>
            </div>

            <div class="status_bar" >
                <a class="item orange" href="https://dermanov.ru#from=minesweeper" target="_blank">Марк Дерманов</a>
                <div class="item sep">|</div>
                <a class="item orange" href="https://github.com/dermanov-ru/vue_js_minesweeper_game" target="_blank" >Fork me on GitHub</a>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
    <script src="https://unpkg.com/vue"></script>
    <script src="/assets/js/cell.js?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/js/cell.js")?>"></script>
    <script src="/assets/js/main.js?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/js/main.js")?>"></script>
</body>
</html>

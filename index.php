<?php
/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 17.06.2018
 * Time: 21:07
 *
 *
 */
 
require_once $_SERVER["DOCUMENT_ROOT"] . "/functions.php";
 ?>
<!DOCTYPE html>
<html>
<head>
    <title>Игра «Сапёр» на vue.js</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta property="og:title" content='<?=getOgTitle()?>' />
    <meta property="og:image" content='<?=getOgImage()?>' />
    
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
    <link rel="stylesheet" href="/assets/css/template.css?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/css/template.css")?>" />
    <link rel="stylesheet" href="/assets/css/main.css?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/css/main.css")?>" />
</head>
<body>
    <div id="minesweeper" class="minesweeper" v-cloak v-bind:style="{ width: level.min_window_size + 'px' }">
        
        <div >
            <div class="minesweeper_status_bar titlle">
                <div class="minesweeper_status_bar_item" title="">Игра "Сапер"</div>
            </div>

            <div v-if="!is_level_selected">
                <div class="minesweeper_status_bar">
                    <p><strong>Выберите уровень</strong></p>
                    
                    <div class="line" v-for="level in levels">
                        <a class="minesweeper_status_bar_item green" href="#"  @click.prevent="prepare_game(level)" >{{ level.title }} ({{ level.size }} x {{ level.size }})</a>
                    </div>
                </div>
            </div>
            
            <div v-if="is_level_selected">
                <div class="minesweeper_status_bar" >
                    <a href="https://derm.su/48c" class="minesweeper_status_bar_item green" target="_blank">Правила</a>
                    <div class="minesweeper_status_bar_item minesweeper_status_bar_item_sep">|</div>
                    <a class="minesweeper_status_bar_item green" href="#" @click.prevent="select_game_level" >Уровень</a>
                    <div class="minesweeper_status_bar_item minesweeper_status_bar_item_sep">|</div>
                    <a class="minesweeper_status_bar_item green" href="#" @click.prevent="reset_game" v-bind:class="{ orange: game_over }">Заново</a>
                </div>

                <div class="minesweeper_status_bar" >
                    <div class="minesweeper_status_bar_item" title="Режим игры"><i class="fas fa-signal"></i> {{level.title}}</div>
                    <div class="minesweeper_status_bar_item" title="Время игры"><i class="far fa-clock"></i> {{game_time_formated}}</div>
                    <div class="minesweeper_status_bar_item" title="Отмечено мин / Всего мин"><i class="fa fa-bomb"></i> {{marked_count}} /  {{mines_count}}</div>
                </div>

                <div class="minesweeper_table" v-bind:class="{ game_losed: game_over && !game_won }">
                    <template  v-for="minesweeper_status_bar_item in level.size">
                        <div class="minesweeper_row">
                            <div v-for="minesweeper_status_bar_item1 in level.size" class="cell closed" @click.left="open_cell" @click.right.prevent="mark_cell"></div>
                        </div>
                    </template>
                </div>

                <div class="minesweeper_status_bar" v-if="game_over" >
                    <div class="minesweeper_status_bar_item " v-if="!game_won"><strong>Вы проиграли!</strong> <i class="far fa-frown"></i></div>
                    <div class="minesweeper_status_bar_item " v-if="game_won"><strong>Ура, вы победили!</strong> <i class="far fa-thumbs-up"></i></div>
                </div>
                
                <div class="minesweeper_status_bar" v-if="game_over">
                    <div class="minesweeper_status_bar_item " v-if="!screen_saved && !screening"><a href="#" class="green" @click.prevent="save_screen">Поделитесь скриншотом своей игры :)</a></div>
                    <div class="minesweeper_status_bar_item " v-if="screening">Подождите, делаем скрин...</a></div>
                    
                    <div class="" v-if="screen_saved">
                        Поделиться
                        <a class="minesweeper_status_bar_item" style="color: #4a76a8" :href="share_url_vk" target="_blank" ><i class="fab fa-vk" style="margin-right: 5px;"></i>Vk</a>
                        <a class="minesweeper_status_bar_item " style="color: #4267b2" :href="share_url_fb" target="_blank" ><i class="fab fa-facebook-square" style="margin-right: 5px;"></i>Fb</a>
                    </div>
                </div>
            </div>


            <div class="minesweeper_status_bar" >
                <a class="minesweeper_status_bar_item orange" href="https://dermanov.ru#from=minesweeper" target="_blank">Марк Дерманов</a>
                <div class="minesweeper_status_bar_item minesweeper_status_bar_item_sep">|</div>
                <a class="minesweeper_status_bar_item orange" href="https://github.com/dermanov-ru/vue_js_minesweeper_game" target="_blank" >Fork me on GitHub</a>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
    <script src="https://unpkg.com/vue"></script>
    <script src="/assets/js/cell.js?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/js/cell.js")?>"></script>
    <script src="/assets/js/main.js?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/js/main.js")?>"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.min.js"></script>

    <?
    if (file_exists(__DIR__ . "/counters.php"))
        require __DIR__ . "/counters.php";
    ?>
</body>
</html>

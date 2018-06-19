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
    
    <link rel="stylesheet" href="/assets/css/main.css?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/css/main.css")?>" />
</head>
<body>
    <div id="minesweeper" class="minesweeper" v-cloak>
        
        <div >
            <div class="status_bar titlle">
                <div class="item" title="">Игра "Сапер"</div>
            </div>

            <div class="status_bar" v-if="game_prepared">
                <div class="item" title=""><a href="https://derm.su/48c" class="green" target="_blank">Правила игры</a></div>
                <div class="item sep">|</div>
                <a class="item green" href="#" @click.prevent="repeat_game" >Начать с начала</a>
                <div class="item sep">|</div>
                <a class="item green" href="#" @click.prevent="reset_game" >Выбрать другой уровень</a>
            </div>
            
            <div class="status_bar" v-if="game_prepared">
                <div class="item" title="Режим игры">{{level.title}}</div>
                <div class="item sep">|</div>
                <div class="item" title="Время игры">{{game_time_formated}}</div>
                <div class="item sep">|</div>
                <div class="item" title="Отмечено мин / Всего мин">{{marked_count}} / {{mines_count}}</div>
            </div>
    
            <div class="table">
                <div v-if="!game_prepared">
                    <p>Выберите уровень</p>
                    <p>
                        <select name="" id="" v-model="level" placeholder="- Выбрать уровень -">
                            <option v-for="(level, index) in levels" v-bind:value="level" >
                                {{ level.title }}
                            </option>
                        </select>
                    </p>

                    <p>
                        <button @click="prepare_game">Начать игру</button>
                    </p>
                </div>
                
                <template v-if="game_prepared" v-for="item in level.size">
                    <div class="row">
                        <div v-for="item1 in level.size" class="cell default" @click.left="open_cell" @click.right.prevent="mark_cell"></div>
                    </div>
                </template>
            </div>

            <div class="status_bar" v-if="game_over">
                <div class="item sep" v-if="!game_won"><strong>Игра окончена, вы проиграли!</strong></div>
                <div class="item sep" v-if="game_won"><strong>Ура, вы победили!</strong></div>
            </div>

            <div class="status_bar" v-if="game_prepared">
                <a class="item orange" href="https://dermanov.ru#from=minesweeper" target="_blank">Об авторе</a>
                <div class="item sep">|</div>
                <a class="item orange" href="#todo" target="_blank" @click.prevent="" >Проект на GitHub</a>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
    <script src="https://unpkg.com/vue"></script>
    <script src="/assets/js/cell.js?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/js/cell.js")?>"></script>
    <script src="/assets/js/main.js?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/js/main.js")?>"></script>
</body>
</html>

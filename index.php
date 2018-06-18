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
    <title>Minesweeper</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <link rel="stylesheet" href="/assets/css/main.css?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/css/main.css")?>" />
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
    <script src="https://unpkg.com/vue"></script>
</head>
<body>
    <div id="minesweeper" class="minesweeper">
        
        <div v-if="!game_started">
            <p>Выберите уровень
                <select name="" id="" v-model="level" placeholder="- Выбрать уровень -">
                    <option v-for="(level, index) in levels" v-bind:value="level" >
                        {{ level.title }}
                    </option>
                </select>
            </p>
            
            <p>
                <button @click="start_game">Начать игру</button>
            </p>
        </div>
    
        <div v-if="game_started">
            <p>Режим игры: {{level.title}} </p>
            <p>Время игры: {{game_time_formated}} </p>
            <p>Всего мин: {{mines_count}} </p>
            <p>Отмечено флажком: {{marked_count}} </p>
            
            <div v-if="game_over">
                <p v-if="!game_won">Игра окончена, вы проиграли!</p>
                <p v-if="game_won">Ура, вы победили!</p>
                <button @click="repeat_game">Повторить игру</button>
            </div>
    
    
            <div class="table">
                <template v-for="item in level.size">
                    <div class="row">
                        <div v-for="item1 in level.size" class="cell default" @click.left="open_cell" @click.right.prevent="mark_cell"></div>
                    </div>
                </template>
            </div>
        </div>
    
        
    </div>

    <script src="/assets/js/cell.js?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/js/cell.js")?>"></script>
    <script src="/assets/js/main.js?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/js/main.js")?>"></script>
</body>
</html>

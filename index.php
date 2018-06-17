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
    <script src="/assets/js/main.js?v=<?=filemtime($_SERVER["DOCUMENT_ROOT"] . "/assets/js/main.js")?>"></script>
    <script src="https://unpkg.com/vue"></script>
</head>
<body>
    <div id="minesweeper" class="minesweeper">
        <div class="table">
            <div class="row">
                <div class="cell default"></div>
                <div class="cell default"></div>
                <div class="cell default"></div>
            </div>
            <div class="row">
                <div class="cell flag"></div>
                <div class="cell mine"></div>
                <div class="cell default"></div>
            </div>
            <div class="row">
                <div class="cell open"></div>
                <div class="cell open"></div>
                <div class="cell default"></div>
            </div>
        </div>
    </div>
</body>
</html>

<?php
/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 23.06.2018
 * Time: 0:18
 *
 *
 */
 
function getOgTitle(){
    if (!$_REQUEST["game_won"]) {
        return 'Игра «Сапёр» на vue.js';
    }
    
    if ($_REQUEST["game_won"] == "Y") {
        $result = 'Я выиграл в игре «Сапёр» на vue.js :) Попробуй и ты!';
    } else if ($_REQUEST["game_won"] == "N") {
        $result = 'Я проиграл в игре «Сапёр» на vue.js :) Попробуй и ты!';
    }
    
    return $result;
}

function getOgImage(){
    $screen = $_REQUEST["screen"];
    
    if (!$screen)
        return "/i/screen/default_3.png";
    
    $screenPath = "/upload/" . $screen;
    $filename = $_SERVER["DOCUMENT_ROOT"] . $screenPath;
    
    if (file_exists( $filename ))
        $result = $screenPath;
    else
        $result = "/i/screen/default_3.png";
    
    return $result;
}
<?php
/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 22.06.2018
 * Time: 20:31
 *
 *
 */

$imagedata = base64_decode( $_POST['imgdata'] );
$filename = date("Y_m_d_H_i_s") . '.png';
$file = $_SERVER['DOCUMENT_ROOT'] . '/upload/'.$filename;

file_put_contents($file, $imagedata);

$result = [
    "image" => $filename
];

echo json_encode($result);

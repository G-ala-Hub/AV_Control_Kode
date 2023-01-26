<?php

if (isset)($_POST)['submit'])) 

{

    $cf-name = $_POST['cf-name'];
    $cf-email = $_POST['cf-email'];
    $cf-subject = $_POST['cf-subject'];
    $cf-message = $_POST['cf-message']; 

    $mailTo = "geraldwala101@gmail.com";
    $headers = "From: ".$cf-email;
    $txt = "You have recived a email form".$cf-name.".\n\n".$cf-message;


    mail($mailTo, $headers, $txt, $headers);
    header("Location: index.php?mailsent");

}
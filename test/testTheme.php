<?php

$testTheme = function_exists("getTheme") && getTheme() ? getTheme() : "kgp";
printf("Theme is set to '%s' \n",$testTheme);

//define("GETTHEME","/usr/share/opi-themes/theme.php");
define("GETTHEME","../theme.php");
if (is_file(GETTHEME))	include GETTHEME;	


$testTheme = function_exists("getTheme") && getTheme() ? getTheme() : "kgp";
printf("Theme is set to '%s' \n",$testTheme);

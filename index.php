<?php
/*
 * Copyright (C) 2014 Timo Salola <timo@salola.fi>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

define('TEMP', 'temp');
define('OLD', 1800);

session_start();

if (isset($_SESSION['CREATED']) && (time() - $_SESSION['CREATED'] > 600)) {
    session_unset();
    session_destroy();
}
if (!isset($_SESSION['views'])) {
    $_SESSION['views'] = 1;
}

if (isset($_GET['tunnus']))
    $tunnus = $_GET['tunnus'];
if (isset($_GET['piste']))
    $piste = $_GET['piste'];
if (isset($_GET['tyyppi']))
    $tyyppi = $_GET['tyyppi'];
?>

<html>
    <head>
        <title><?php echo $tunnus; ?> - <?php echo $piste; ?></title>
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
        <link href="http://ressu.lpt.fi/oklukuj/Styles.css" rel="stylesheet" type="text/css" />
    </head>
    <body>

        <?php
        if (!isset($tunnus) || !isset($piste) || !isset($tyyppi) || isset($_GET['err'])) {
            if (isset($tunnus) || isset($piste) || isset($tyyppi)) {
                echo 'INVALID SYNTAX!';
            }
            ?>

            <form action="index.php" method="GET">
                <b style="color:red">Tunnus:</b> <input type="text" name="tunnus" value="<?php if (isset($tunnus)) echo $tunnus; ?>" /><br />
                <b style="color:green">Tyyppi:</b> <input type="text" name="tyyppi" value="<?php if (isset($tyyppi)) echo $tyyppi; ?>" /><br />
                <b style="color:blue">Tpiste:</b> <input type="text" name="piste" value="<?php if (isset($piste)) echo $piste; ?>" /><br />
                <input type="submit" value="Ok!" />
            </form>

            How to use? <br />
            Go to <a href="http://ressu.lpt.fi" target="_BLANK">ressu.lpt.fi</a> and open your timetable in new window/tab(CTRL+CLICK on computer or press the link for few seconds in mobile devices) <br />
            Below you find example URL. You need to copy the color coded information to corresponding fields in this page.<br />
            http://ressu.lpt.fi/oklukuj/lukuj2.aspx?pvm1=2014-3-24&pvm2=2014-3-30&tunnus=<b style="color:red">07OHJ11</b>&tyyppi=<b style="color:green">Ryhma</b>&tpiste=<b style="color:blue">07TL</b>

            <?php
        }
        else {
            $first = strtotime('last monday');
            $last = strtotime('next sunday');

            $monday = Date('Y-n-j', $first);
            $sunday = Date('Y-n-j', $last);

            $fname = $monday . '-' . $sunday . '-' . $tunnus . '-' . $piste . '-' . $tyyppi;

            if (!file_exists(TEMP . '/' . $fname) || ((time() - filemtime(TEMP . '/' . $fname)) > OLD)) {
                if ($_SESSION['views'] > 10) {
                    echo 'SPAM PROTECTION ACTIVE! Please wait...';
                    die();
                }
                $url = 'http://ressu.lpt.fi/oklukuj/lukuj2.aspx?pvm1=' . $monday . '&pvm2=' . $sunday . '&tunnus=' . $tunnus . '&tyyppi=' . $tyyppi . '&tpiste=' . $piste;

                $page = file_get_contents($url);

                $stripped = explode('</HTML>', $page);

                if (count($stripped) != 2) {
                    header('Location: get.php?err=1&tunnus=' . $tunnus . '&piste=' . $piste . '&tyyppi=' . $tyyppi);
                    die();
                }

                $search = 'lukuj2.aspx';
                $replace = 'http://ressu.lpt.fi/oklukuj/lukuj2.aspx';

                $content = str_replace($search, $replace, $stripped[1]);

                file_put_contents(TEMP . '/' . $fname, $content, LOCK_EX);

                $_SESSION['views'] ++;
            } else {
                $content = file_get_contents(TEMP . '/' . $fname);
            }

            $string = Date('H:i:s d-m-Y');
            $string = $string . ',' . $_SERVER['REMOTE_ADDR'];
            $string = $string . ',' . $_SESSION['views'];
            $string = $string . ',' . $tunnus . ',' . $tyyppi . ',' . $piste;
            file_put_contents('logs/visitors.log', $string . PHP_EOL, LOCK_EX | FILE_APPEND);

            echo $content;
        }
        ?>
    </body>
</html>
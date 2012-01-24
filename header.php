<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<link rel="apple-touch-icon" href="images/launcher-icon.png" />
		<link rel="apple-touch-icon-precomposed" href="images/launcher-icon.png" />

		<title>Triptu</title>

		<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/themes/base/jquery-ui.css" />
		<link rel="stylesheet" href="css/triptu.css" />

		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>
		<script type="application/javascript" src="js/iscroll.js"></script>
		<script type="text/javascript">
			var paths = document.location.href.split('/');
			if (paths[paths.length - 1] == 'triptu.php' && 'standalone' in navigator && !navigator.standalone && (/iphone|ipod|ipad/gi).test(navigator.platform) && (/Safari/i).test(navigator.appVersion)) {
				document.write('<link rel="stylesheet" href="css\/add2home.css">');
				document.write('<script type="application\/javascript" src="js\/add2home.js" charset="utf-8"><\/s' + 'cript>');
			}
		</script>
	</head>

	<body>
		<div id="header">
			<button id="back" type="reset" class="backButton floatLeft">BACK</button>
			<img src="images/header-logo.png" class="floatRight" />
			<h1></h1>
			<div class="clear"></div>
		</div>

		<div id="body">
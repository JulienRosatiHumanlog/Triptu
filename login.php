<?php include('header.php'); ?>

<a href="http://m.triptu.com"><img src="images/logo-large.png" class="topSpace bottomSpace loginLogo" /></a>

<div id="login">
	<form id="loginForm" class="bottomSpace" action="triptu.php" method="post">
		<p><input id="userId" type="text" class="first" name="loginId" placeholder="Email" /></p>
		<p><input id="userPwd" type="password" class="last" name="loginPwd" placeholder="Password" /></p>
		<button type="submit" class="loginButton pinkButton">LOGIN</button>
	</form>
</div>

<div id="Info" class="bottomSpace">
	<p>Not a member? <a href="#" onclick="window.location.replace('signup.php')"><u>SIGN UP</u></a> to get exclusive access to deals and perks saving you €100+ during your holiday.</p>
	<p><small><a href="mailto:contact@triptu.com?subject=Please send me a new password">Forgot password?</a></small></p>
</div>

<?php include('footer.php'); ?>
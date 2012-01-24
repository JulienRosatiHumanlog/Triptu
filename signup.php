<?php include('header.php'); ?>

<img src="images/logo-large.png" class="topSpace loginLogo" />

<div id="sign">
	<form id="signForm" class="bottomSpace" action="#" method="post">
		<p><input id="newUserFirstname" type="text" class="first" name="newUser[firstname]" placeholder="First name" /></p>
		<p><input id="newUserLastname" type="text" class="middle" name="newUser[lastname]" placeholder="Last name" /></p>
		<p><input id="newUserEmail" type="text" class="middle" name="newUser[email]" placeholder="Email" /></p>
		<p><input id="newUserPassword" type="password" class="middle" name="newUser[password]" placeholder="Password" /></p>
		<p><input id="newUserConfPassword" type="password" class="last" name="newUser[confPassword]" placeholder="Password confirmation" /></p>

		<p class="checkbox"><input id="newUserTos" name="newUser[tos]" type="checkbox" />I agree with triptu's <a href="www.triptu.com/tos">Terms of Service</a></p>
		<p class="checkbox">Note: we NEVER share your email details with third parties - we hate spam as much as you do.</p>

		<button type="reset" class="loginButton pinkButton" onclick="window.location.replace('login.php')">BACK</button>
		<button type="submit" class="loginButton pinkButton">SIGN UP</button>
	</form>
</div>
<?php include('footer.php'); ?>
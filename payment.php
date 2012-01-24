<!-- DIALOG PAYMENT -->
<div id="pagePayment" class="pagePayment dialog">
	<form id="paymentForm" action="https://www.paypal.com/cgi-bin/webscr" method="post">
		<input type="hidden" name="cmd" value="_xclick"/>
		<input type="hidden" name="business" value="alexim_1323356413_biz@btinternet.com"/>
		<input type="hidden" name="item_name" value="test"/>
		<input type="hidden" id="item_number" name="item_number" value="2"/>
		<input type="hidden" id="amount" name="amount" value="10.00"/>
		<input type="hidden" name="currency_code" value="EUR"/>
		<input type="hidden" name="no_note" value="1"/>
		<input type="hidden" name="no_shipping" value="0"/>
		<input type="hidden" id="return" name="return" value="http://www.triptu.com/mobile/triptu.php#thanks">
		<input type="hidden" name="lc" value="FR"/>
		<input type="hidden" name="notify_url" value="http://triptu.com/back/InstantPaymentNotifications/process">
		<input type="hidden" id="custom" name="custom" value="08443215" />

		<div class="paymentItem" id="paymentResort"><a href="#">
			<div class="floatPrice">
				<div class="price">€<span id="resortPrice">10</span></div>
				<button id="btnPaymentResort" class="paymentButton pinkButton">Buy</button>
			</div>
			<div class="content">
				<div class="label">All <span id="resortName">[Tignes]</span> deals:</div>
				<div class="sublabel">> Saving you €<span id="resortSave">[X]</span> during your stay</div>
			</div>
		</a></div>
		<div class="clear"></div>

		<div class="paymentItem" id="paymentCategory"><a href="#">
			<div class="floatPrice">
				<div class="price">€<span id="categoryPrice">10</span></div>
				<button id="btnPaymentCategory" class="paymentButton pinkButton">Buy</button>
			</div>
			<div class="content">
				<div class="label"><span id="categoryName">[Restaurants]</span> deals only:</div>
				<div class="sublabel">> Saving you €<span id="categorySave">[Y]</span> during your stay</div>
			</div>
		</a></div>
		<div class="clear"></div>

		<div class="paymentItem" id="paymentDeal"><a href="#">
			<div class="floatPrice">
				<div class="price">€<span id="dealPrice">10</span></div>
				<button id="btnPaymentDeal" class="paymentButton pinkButton">Buy</button>
			</div>
			<div class="content">
				<span class="label">Just this voucher:</span>
			</div>
		</a></div>
	</form>
	<div class="clear"></div>

	<form id="unlockCodePaymentForm" action="#" method="post">
		<span class="label nopadding">Or enter promo code:</span>
		<input id="unlockCodePayment" name="unlockCode" class="inputCode" title="Code" placeholder="Code" />
		<button type="submit" class="paymentButton pinkButton">OK</button>
	</form>
</div>
<!-- END DIALOG PAYMENT -->
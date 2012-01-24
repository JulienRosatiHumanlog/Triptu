(function($) {
	$.fn.placeholder = function() {
		if(typeof document.createElement("input").placeholder == 'undefined') {
			$('[placeholder]').focus(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
					input.val('');
					input.removeClass('placeholder');
				}
			}).blur(function() {
				var input = $(this);
				if (input.val() == '' || input.val() == input.attr('placeholder')) {
					input.addClass('placeholder');
					input.val(input.attr('placeholder'));
				}
			}).blur().parents('form').submit(function() {
				$(this).find('[placeholder]').each(function() {
					var input = $(this);
					if (input.val() == input.attr('placeholder')) {
						input.val('');
					}
				})
			});
		}
	};

	$.showMessage = function(message, callback) {
		var dialog = $('#dialogMessage').html(message).dialog({
			dialogClass: 'paymentAcceptedDialog messageDialog',
			minHeight: 3,
			resizable: false,
			modal: true
		}).delay(1300).fadeOut(400, function() {
			dialog.dialog('destroy');
			if(callback) {
				callback();
			}
		});
	};

	var progressDialog;
	$.displayProgress = function() {
		progressDialog = $('#dialogProgress').dialog({
			dialogClass: 'progressDialog',
			modal:true,
			resizable: false,
			width: '185px',
			overlay:{
				backgroundColor:'#000',
				opacity: 0.5
			}
		});
	};

	$.hideProgress = function() {
		if(progressDialog) {
			progressDialog.dialog('close');
		}
	};
}
)(jQuery);
if(typeof document.createElement("input").placeholder === 'undefined') {
	$.fn.placeholder();
}

jQuery.jQueryRandom = 0;
jQuery.extend(jQuery.expr[':'], {
	random: function(a, i, m, r) {
		if (i == 0) {
			jQuery.jQueryRandom = Math.floor(Math.random() * r.length);
		}
		return i == jQuery.jQueryRandom;
	}
});

var RAND_MAX = 2147483647;

// FORM
$('form').submit(function(){
	$(this).find('input[type="text"][title!=""], input[type="password"][title!=""]').each(function(){
		if ($(this).val() == $(this).attr('title')) {
			$(this).val('');
		}
	});
});

// LINK
$('a[href^="#"]').click(function(event) {
	event.preventDefault();
	jsPage.load($(this).attr('href'));
});
$('a.pageLauncher').click(function(event) {
	event.preventDefault();
	localStorage.removeItem('categoryId');
	$('div#footer .pageLauncher').removeClass('footerSelected');
	$(this).addClass('footerSelected');
});
$('form[action="#"]').submit(function(event) { event.preventDefault(); });

// UNLOCK CODE
$('#unlockCodePaymentForm').submit(function(event) {
	jsPage.unlockDeals($('#unlockCodePayment').val());
	return false;
});

// PAGE MANAGEMENT
var jsPage = {
	orientation: function() {
		return window.orientation;
	},

	resortLoaded: null,

	callAjax: function(options) {
		if (navigator.onLine) {
			jsPage.synchronizeVouchers();
		}

		$.ajax({
			url: options.url,
			dataType: 'json',
			data: options.data,
			beforeSend: function(jqXHR, settings) {
				$.displayProgress();
			},
			complete: function(jqXHR, textStatus) {
				$.hideProgress();
			},
			error: function(jqXHR, error, errorThrown) {
				if(jqXHR.status != 200) {
					options.networkError(jqXHR, error, errorThrown);
				} else {
					options.onError(jqXHR, error, errorThrown);
				}
			},
			success: options.callback
		});
	},

	checkUniqueIds: function() {
		$('[id]').each(function() {
			var ids = $('[id=' + this.id + ']');
			if((ids.length > 1) && (ids[0] == this)) {
				console.error('ID #' + this.id + ' is defined ' + ids.length + ' times');
			}
		});
	},

	init: function() {
		var slashes = document.location.href.split('/');
		var path = slashes[slashes.length - 1].split('?');
		var current_url = path[0];
		switch(current_url) {
			case '':
			case 'login.php': {
				jsPage.setViewport(0);
				$('#header').hide();
				$('#footer').hide();
				$('html').toggleClass('loginBackground');
				$('#loginForm').submit(function() {
					if($('#userId').val() == '' || $('#userPwd').val() == '') {
						$.showMessage('<h3>Login failed</h3>');
					} else {
						$.ajax({
							url: 'http://triptu.com/back/accounts/r_connect.json',
							type: 'POST',
							dataType: 'json',
							data: {
								data: {
									Account: {
										login: $('#userId').val(),
										password: $('#userPwd').val()
									}
								}
							},
							beforeSend: function(jqXHR, settings) {
								$.displayProgress();
							},
							complete: function(jqXHR, textStatus) {
								$.hideProgress();
							},
							success: function(account) {
								localStorage.setItem('account', JSON.stringify(account));
								location.replace('triptu.php');
							},
							error: function(jqXHR,error,errorThrown) {
								$.showMessage('<h3>Login failed</h3><h3>' + jqXHR.responseText + '</h3>');
							}
						});
					}
					return false;
				});

				var account = localStorage.getItem('account');
				if(account) {
					$.displayProgress();
					setTimeout(function() {
						location.replace('triptu.php');
					},
					1000);
				}
			}
			break;

			case 'signup.php': {
				jsPage.setViewport(0);
				$('#header').hide();
				$('#footer').hide();
				$('html').toggleClass('loginBackground');
				$('#signForm').submit(function() {
					if($('#newUserPassword').val() != $('#newUserConfPassword').val()) {
						$.showMessage('<h3>Your password does not match.</h3>');
					}else if(!$('#newUserTos').is(':checked')) {
						$.showMessage('<h3>You must accept triptu\'s Terms of Service.</h3>');
					} else {
						$.ajax({
							url: 'http://triptu.com/back/accounts/r_add.json',
							type: 'POST',
							dataType: 'json',
							data: {
								data: {
									Account: {
										login: $('#newUserEmail').val(),
										password: $('#newUserPassword').val()
									},
									Customer: {
										email: $('#newUserEmail').val(),
										firstname: $('#newUserFirstname').val(),
										lastname: $('#newUserLastname').val()
									}
								}
							},
							beforeSend: function(jqXHR, settings) {
								$.displayProgress();
							},
							complete: function(jqXHR, textStatus) {
								$.hideProgress();
							},
							success: function(account) {
								localStorage.setItem('account', JSON.stringify(account));
								location.replace('login.php');
							},
							error: function(jqXHR) {
								$.showMessage('<h3>Sign in failed</h3><h3>' + jqXHR.responseText + '</h3>');
							}
						});
					}
					return false;
				});
			}
			break;

			case 'triptu.php#thanksResort': {
				var resort = JSON.parse(localStorage.getItem('resort'));
				$('#dialogThanks #dialogContent').html('You now have access to all ' + resort.Resort.name + ' deals.');
				var dialog = $('#dialogThanks').dialog({
					dialogClass: 'paymentDialog',
					modal: true,
					resizable: false,
					title: 'Thank you!',
					close: function(event, ui) {
						jsPage.load('#myTriptu');
					}
				});
				$('.okButton').unbind('click').click(function() {
					dialog.dialog('close');
				});
				initScroller();
			}
			break;
			case 'triptu.php#thanksCategory': {
				var resort = JSON.parse(localStorage.getItem('resort'));
				var categoryId = JSON.parse(localStorage.getItem('categoryId'));
				$.ajax({
					url: 'http://triptu.com/back/categories/view/' + categoryId + '.json',
					type: 'POST',
					dataType: 'json',
					success: function(data) {
						$('#dialogThanks #dialogContent').html('You now have access to all ' + data.Category.name + ' deals in ' + resort.Resort.name + '.');
						var dialog = $('#dialogThanks').dialog({
							dialogClass: 'paymentDialog',
							modal: true,
							resizable: false,
							title: 'Thank you!',
							close: function(event, ui) {
								jsPage.load('#myTriptu');
							}
						});
						$('.okButton').unbind('click').click(function() {
							dialog.dialog('close');
						});
					}
				});
				initScroller();
			}
			break;
			case 'triptu.php#thanks': {
				$('#dialogThanks #dialogContent').html('Your voucher is now available. You can access it straight from the deal list or from My Triptu.');
				var dialog = $('#dialogThanks').dialog({
					dialogClass: 'paymentDialog',
					modal: true,
					resizable: false,
					title: 'Thank you!',
					close: function(event, ui) {
						jsPage.load('#myTriptu');
					}
				});
				$('.okButton').unbind('click').click(function() {
					dialog.dialog('close');
				});
			}
			break;
			case 'triptu.php': {
				initScroller();
				jsPage.loadVouchers();
				localStorage.removeItem('categoryId');
				$('#footer a').removeClass('footerSelected');
				$('#footer #goResorts').addClass('footerSelected');
				$('div.page').removeClass('pageActive').hide();
				$('div.page#pageResorts').show().addClass('pageActive');
				jsPage.loadResorts();
			}
			break;
		}
	},

	loadResorts: function() {
		jsPage.setViewport(42);
		$('#back').unbind('click').click(function(event) {
			event.preventDefault();
			localStorage.removeItem('resort');
			localStorage.removeItem('vouchers');
			localStorage.removeItem('localVouchers');
			localStorage.removeItem('account');
			localStorage.removeItem('vouchersSent');
			localStorage.removeItem('categoryId');
			localStorage.removeItem('vouchersUsed');
			location.replace('login.php');
		});

		$.ajax({
			url: 'http://triptu.com/back/resorts.json',
			dataType: 'json',
			beforeSend: function(jqXHR, settings) {
				$.displayProgress();
			},
			complete: function(jqXHR, textStatus) {
				$.hideProgress();
			},
			success: function(resorts) {
				var head = $('#resorts li:first-child');
				$('#resorts').empty().append(head);
				for(var i = 0 ; i < resorts.length; i++) {
					$('#resorts').append('' +
					'<li class="listItem centerTxt">' +
					'	<a class="bold noDeco blockLink" href="#deals?id_resort=' + resorts[i].Resort.id + '">' + resorts[i].Resort.name + '</a></li>');
				}
				$('#resorts li.listItem a').click(function(event) {
					event.preventDefault();
					jsPage.load($(this).attr('href'));
				})
			}
		});
	},

	loadDeals: function(resortId) {
		$('#header h1').html('Featured deal');
		$('.browseCategories').show();

		jsPage.callAjax({
			url: 'http://triptu.com/back/resorts/view/' + resortId + '.json',
			data: null,
			callback: function(resort) {
				localStorage.setItem('resort', JSON.stringify(resort));
				if(jsPage.resortLoaded == null || jsPage.resortLoaded != resort.Resort.id) {
					jsPage.resortLoaded = resort.Resort.id;

					if(resort.Deal.length > 0) {
						$.ajax({
							type: 'POST',
							url: 'http://triptu.com/back/deals/buydeal.json',
							data: {
								id: resort.Deal[0].id
							},
							dataType: 'json',
							beforeSend: function(jqXHR, settings) {
								$.displayProgress();
							},
							complete: function(jqXHR, textStatus) {
								$.hideProgress();
							},
							error: function(jqXHR, error, errorThrown) {
								$.showMessage('<h3>' + jqXHR.responseText + '</h3>');
							},
							success: function(data) {
								var vouchers = JSON.parse(localStorage.getItem('vouchers')) || new Array();
								/*
								 * Show popup resort payment

								var found = false, i = 0;
								while(i < vouchers.length && !found) {
									found = vouchers[i].Deal.Resort.name == resort.Resort.name;
									i++;
								}
								if(!found) {
									i = 0;
									var localVouchers = JSON.parse(localStorage.getItem('localVouchers')) || new Array();
									while(i < localVouchers.length && !found) {
										found = localVouchers[i].resort == resort.Resort.name;
										i++;
									}
									if(!found) {
										$('#pagePayment #paymentCategory').hide();
										$('#pagePayment #paymentDeal').hide();

										$('#pagePayment #resortName').html(data.Paiement[2].Resort);
										$('#pagePayment #resortPrice').html(data.Paiement[2].newPrice);
										$('#pagePayment #resortSave').html(data.Paiement[2].savePrice);

										$('#paymentResort a').unbind('click').click(function(event) {
											event.preventDefault();
											$('#pagePayment #item_number').val(data.Paiement[2].id);
											$('#pagePayment #amount').val(data.Paiement[2].newPrice);
											$('#pagePayment #return').val('http://m.triptu.com/triptu.php#thanks');
											var account = JSON.parse(localStorage.getItem('account'));
											$('#pagePayment #custom').val(account.Account.id);
											$('#pagePayment #paymentForm').submit();
										});

										$('#pagePayment').dialog({
											dialogClass: 'paymentDialog',
											modal: true,
											resizable: false,
											title: '<img src="images/logo_paypal.png" class="paypal" /><span class="paypalTitle">Get access to deals!</span>'
										});
									}
								}
								*/
								jsPage.displayDeals(resort);
							}
						});
					}
				} else {
					jsPage.displayDeals(resort);
				}
			},
			networkError: function(jqXHR,error,errorThrown) {
				jsPage.displayDeals(resort);
			},
			onError: function(jqXHR,error,errorThrown) {
			}
		});
	},

	displayDeals: function(resort) {
		$('#deals').empty();
		for(var i = 0 ; i < resort.Deal.length; i++) {
			var featuredClass = '';
			if(resort.Deal[i].featured) {
				if(resort.Deal[i].Dealdetail && resort.Deal[i].Dealdetail.length > 0) {
					$('#deals').append('<li class="featuredDeal category-' + resort.Deal[i].category_id + ' hidden">' +
					'<div><a href="#deal?id_deal=' + resort.Deal[i].id + '" class="noDeco">' +
					'<img id="featuredDealPhoto" class="bigPhoto" src="' + resort.Deal[i].photo1 + '" />' +
					'<h2 class="listItemTitle">' + resort.Deal[i].Dealdetail[0].name + '</h2>' +
					'<p class="supplier">' + resort.Deal[i].Supplier.name + '</p>' +
					'</a></div></li>');
				}
			}

			var voucher = jsPage.dealIsInMyVouchers(resort.Deal[i].id);
			var price = '';
			if(resort.Deal[i].voucherPrice == 0 || !resort.Deal[i].voucherPrice) {
				price = 'Free voucher';
			} else {
				if((voucher && !voucher.Deal.useOnce) || (voucher && voucher.Deal.useOnce && !jsPage.isVoucherUsed(voucher.Deal.id))) {
					price = 'Voucher price: <span class="strikethrough">€' + resort.Deal[i].voucherPrice + '</span> <span class="uppercase">Free</span>';
				} else {
					price = 'Voucher price: €' + resort.Deal[i].voucherPrice;
				}
			}
			if(resort.Deal[i].Dealdetail && resort.Deal[i].Dealdetail.length > 0) {
				$('#deals').append('<li class="category-' + resort.Deal[i].category_id + ' hidden listItem dealListItem">' +
				'<a href="#deal?id_deal=' + resort.Deal[i].id + '" class="noDeco">' +
				'<div class="listItemImgBorder"><img src="' + resort.Deal[i].photo1 + '" class="listItemImg" /></div>' +
				'<div class="listItemInfos">' +
				'<h2 class="listItemTitle">' + resort.Deal[i].Dealdetail[0].name + '</h2>' +
				'<p class="listItemLocation">' + resort.Deal[i].Supplier.name + '</p>' +
				'<p class="listItemDetails">' + price + '</p>' +
				'</div><div class="clear"></div></a></li>');
			}
		}
		$('#deals a').click(function(event) {
			event.preventDefault();
			jsPage.load($(this).attr('href'));
		});

		jsPage.displayCategories(resort);
		jsPage.scroller.refresh();
	},

	displayCategories: function(resort) {
		$('#categories').empty();
		for(var i = 0 ; i < resort.Category.length; i++) {
			var quota = 100 / resort.Category.length;
			var categoryId = resort.Category[i].id;
			$('#categories').append('' +
			'<li class="categoryItem category-' + categoryId + '" style="width:' + quota + '%">' +
			'<a class="categoryLink" href="#">' +
			'<img class="categoryPhoto" src="' + resort.Category[i].photo1 + '" />' +
			'<span class="categoryTitle">' + resort.Category[i].name + '</span>' +
			'</a></li>');
		}
		$('.categoryItem a').click(function(event) {
			event.preventDefault();
			$('#header h1').html('DEALS');
			$('.browseCategories').hide();

			var categoryId = $(this).parent().attr('class').split('-')[1].split(' ')[0];
			localStorage.setItem('categoryId', categoryId);

			$('#deals li').hide();
			$('#deals li:not(.featuredDeal).category-' + categoryId).show();

			$('.barCategories li').removeClass('categoryItemSelected');
			$('.barCategories li:not(.clear)').addClass('categoryItem');
			$(this).parent().addClass('categoryItemSelected');
			$('div#pageDeals div.wrapper').css('background', 'none');
		});
		$('#categories').append('<li class="clear"></li>');


		var categorySelected = localStorage.getItem('categoryId');
		if(categorySelected != undefined) {
			$('ul#categories li.category-' + categorySelected + ' a:first').click();
			$('div#pageDeals div.wrapper').css('background', 'none');
		} else {
			$('#deals li.featuredDeal:random').show();
			$('div#pageDeals div.wrapper').css('background', 'url("../images/deal-bg.png") repeat;');
		}
	},

	dealIsInMyVouchers: function(dealId) {
		var vouchers = JSON.parse(localStorage.getItem('vouchers'));
		if(vouchers != undefined) {
			for(var i = 0; i < vouchers.length; i++) {
				if(dealId == vouchers[i].Voucher.deal_id) {
					return vouchers[i];
				}
			}
		}

		var localVouchers = JSON.parse(localStorage.getItem('localVouchers'));
		if(localVouchers != undefined) {
			for(var i = 0; i < localVouchers.length; i++) {
				if(dealId == localVouchers[i].deal_id) {
					console.log('localVoucher', localVouchers[i]);
					return null;
				}
			}
		}
		return null;
	},

	loadDeal: function(dealId) {
		var resort = JSON.parse(localStorage.getItem('resort'));
		var found = false, i = 0;
		while(i < resort.Deal.length && !found) {
			found = resort.Deal[i].id == dealId;
			i++;
		}
		var deal = resort.Deal[i - 1];

		$('#btnGetVoucher').unbind('click');
		var voucher = jsPage.dealIsInMyVouchers(deal.id);
		if(voucher) {
			$('#btnGetVoucher').click(function(event) {
				if(voucher.Deal.useOnce && jsPage.isVoucherUsed(voucher.Deal.id)) {
					$.showMessage('<h3>Sorry! You\'ve already used this voucher.</h3>');
				} else {
					var href = '#voucher?id=' + voucher.Voucher.id;
					if(voucher.Deal.useOnce) {
						$('#dialogQuestion').dialog({
							dialogClass: 'paymentAcceptedDialog messageDialog',
							minHeight: 3,
							resizable: false,
							modal: true,
							buttons: {
								NO: function(){
									$(this).dialog('close');
								},
								YES: function(){
									$(this).dialog('close');
									jsPage.load(href);
								}
							}
						});
					} else {
						jsPage.load(href);
					}
				}
			});
		} else {
			$('#btnGetVoucher').click(function(event) {
				localStorage.removeItem('vouchersSent');
				if(deal.voucherPrice == 0 || !deal.voucherPrice) {
					jsPage.addVoucher(null, deal.id);

					if(deal.useOnce && jsPage.isVoucherUsed(deal.id)) {
						$.showMessage('<h3>Sorry! You\'ve already used this voucher.</h3>');
					} else {
						var href = '#voucherFromDealId?id=' + deal.id;
						if(deal.useOnce) {
							$('#dialogQuestion').dialog({
								dialogClass: 'paymentAcceptedDialog messageDialog',
								minHeight: 3,
								resizable: false,
								modal: true,
								buttons: {
									NO: function(){
										$(this).dialog('close');
									},
									YES: function(){
										$(this).dialog('close');
										jsPage.load(href);
									}
								}
							});
						} else {
							jsPage.load(href);
						}
					}
				} else {
					$.ajax({
						type: 'POST',
						url: 'http://triptu.com/back/deals/buydeal.json',
						data: {
							id: dealId
						},
						dataType: 'json',
						beforeSend: function(jqXHR, settings) {
							$.displayProgress();
						},
						complete: function(jqXHR, textStatus) {
							$.hideProgress();
						},
						error: function(jqXHR, error, errorThrown) {
							$.showMessage('<h3>' + jqXHR.responseText + '</h3>');
						},
						success: function(data) {
							$('#pagePayment #paymentCategory').show();
							$('#pagePayment #paymentDeal').show();

							$('#pagePayment #dealPrice').html(data.Paiement[0].newPrice);

							$('#pagePayment #categoryName').html(data.Paiement[1].category);
							$('#pagePayment #categoryPrice').html(data.Paiement[1].newPrice);
							$('#pagePayment #categorySave').html(data.Paiement[1].savePrice);

							$('#pagePayment #resortName').html(data.Paiement[2].Resort);
							$('#pagePayment #resortPrice').html(data.Paiement[2].newPrice);
							$('#pagePayment #resortSave').html(data.Paiement[2].savePrice);

							var account = JSON.parse(localStorage.getItem('account'));
							$('#paymentDeal a').click(function(event) {
								event.preventDefault();
								$('#pagePayment #custom').val(account.Account.id);
								$('#pagePayment #item_number').val(data.Paiement[0].id);
								$('#pagePayment #amount').val(data.Paiement[0].newPrice);
								$('#pagePayment #return').val('http://m.triptu.com/triptu.php#thanks');
								$('#pagePayment #paymentForm').submit();
							});
							$('#paymentCategory a').click(function(event) {
								event.preventDefault();
								$('#pagePayment #custom').val(account.Account.id);
								$('#pagePayment #item_number').val(data.Paiement[1].id);
								$('#pagePayment #amount').val(data.Paiement[1].newPrice);
								$('#pagePayment #return').val('http://m.triptu.com/triptu.php#thanksCategory');
								$('#pagePayment #paymentForm').submit();
							});
							$('#paymentResort a').unbind('click').click(function(event) {
								event.preventDefault();
								$('#pagePayment #custom').val(account.Account.id);
								$('#pagePayment #item_number').val(data.Paiement[2].id);
								$('#pagePayment #amount').val(data.Paiement[2].newPrice);
								$('#pagePayment #return').val('http://m.triptu.com/triptu.php#thanksResort');
								$('#pagePayment #paymentForm').submit();
							});

							$('#pagePayment').dialog({
								dialogClass: 'paymentDialog',
								modal: true,
								resizable: false,
								title: '<img src="images/logo_paypal.png" class="paypal" /><span class="paypalTitle">Get access to deals!</span>'
							});
						}
					});
				}
			});
		}

		jsPage.displayDeal(deal);
	},

	displayDeal: function(deal) {
		$('#header h1').html('DEAL DETAILS');

		$('#dealDetailImage').attr('src', deal.photo1);
		$('#dealDetailSupplierPhoto1').attr('src', deal.Supplier.photo1);
		$('#dealDetailSupplierPhoto2').attr('src', deal.Supplier.photo2);
		$('#dealDetailSupplierName').html(deal.Supplier.name);
		if(deal.Dealdetail && deal.Dealdetail.length > 0) {
			$('#dealDetailName').html(deal.Dealdetail[0].name);
			$('#dealDetailDescription').html(deal.Dealdetail[0].description);
		}

		if(deal.originalPrice && deal.originalPrice != 0) {
			$('#originalPrice').show();
			$('#originalPrice span').html('€' + deal.originalPrice);
		} else {
			$('#originalPrice').hide();
		}
		if(deal.voucherPrice && deal.voucherPrice != 0) {
			if(jsPage.dealIsInMyVouchers(deal.id) && !jsPage.isVoucherUsed(deal.id)) {
				$('#voucherPrice span').html('<span class="strikethrough">€' + deal.voucherPrice + '</span> <span class="uppercase">Free</span>');
			} else {
				$('#voucherPrice span').html('€' + deal.voucherPrice);
			}

		} else {
			$('#voucherPrice span').html('Free');
		}
		if(deal.discountPrice) {
			$('#discountPrice').show();
			$('#discountPrice span').html('€' + deal.discountPrice);
		} else {
			$('#discountPrice').hide();
		}
		if(deal.discountRate) {
			$('#discountRate').show();
			$('#discountRate span').html('%' + deal.discountRate);
		} else {
			$('#discountRate').hide();
		}

		if(deal.Supplier.address) {
			$('#dealDetailSupplierLocationAddress').show();
			$('#dealDetailSupplierLocationAddress span').html(deal.Supplier.address);
		} else {
			$('#dealDetailSupplierLocationAddress').hide();
		}
		if(deal.Supplier.phone) {
			$('#dealDetailSupplierPhone').show();
			$('#dealDetailSupplierPhone span').html('<a class="purple" href="tel:' + deal.Supplier.phone +'"><span class="purple">' + deal.Supplier.phone + '</span></a>');
		} else {
			$('#dealDetailSupplierPhone').hide();
		}
		if(deal.Supplier.email) {
			$('#dealDetailSupplierEmail').show();
			$('#dealDetailSupplierEmail span').html('<a href="mailto:' + deal.Supplier.email + '?subject=Question from Triptu member"><span class="purple">' + deal.Supplier.email + '</span></a>');
		} else {
			$('#dealDetailSupplierEmail').hide();
		}
	},

	loadVouchers: function() {
		$.ajax({
			url: 'http://triptu.com/back/vouchers.json',
			type: 'GET',
			dataType: 'json',
			beforeSend: function(jqXHR, settings) {
				$.displayProgress();
			},
			complete: function(jqXHR, textStatus) {
				$.hideProgress();
			},
			success: function(vouchers) {
				localStorage.setItem('vouchers', JSON.stringify(vouchers));
				var account = JSON.parse(localStorage.getItem('account'));
				var vouchersUsed = JSON.parse(localStorage.getItem('vouchersUsed')) || new Array();
				for(var i = 0; i < vouchers.length; i++) {
					if(vouchers[i].used) {
						vouchersUsed.push({ id: vouchers[i].id, deal_id: vouchers[i].Deal.id, account_id: account.Account.id, sent: true, used: true, securityCode: vouchers[i].securityCode, resort: vouchers[i].Deal.Resort.name });
					}
				}
				localStorage.setItem('vouchersUsed', JSON.stringify(vouchersUsed));
				jsPage.displayVouchers();
			},
			error: function(jqXHR,error,errorThrown) {
			}
		});
	},

	isVoucherUsed: function(id) {
		var i = 0;
		var vouchersUsed = JSON.parse(localStorage.getItem('vouchersUsed')) || new Array();
		while(i < vouchersUsed.length) {
			if(vouchersUsed[i].deal_id == id) {
				return vouchersUsed[i].used != undefined && vouchersUsed[i].used != 'false';
			}
			i++;
		}
		return false;
	},

	addVoucher: function(idVoucher, idDeal) {
		var account = JSON.parse(localStorage.getItem('account'));
		var resort = JSON.parse(localStorage.getItem('resort'));
		var vouchers = JSON.parse(localStorage.getItem('localVouchers')) || new Array();
		var voucher = {
			account_id: account.Account.id,
			resort: resort.Resort.name,
			securityCode: Math.round(Math.random() * RAND_MAX),
			used: true
		};
		var voucherFound = false, dealFound = false, i = 0;
		while(i < vouchers.length) {
			voucherFound = vouchers[i].id == idVoucher;
			dealFound = vouchers[i].deal_id == idDeal;
			i++;
		}
		if(idVoucher && !voucherFound) {
			voucher.id = idVoucher;
		}
		if(idDeal && !dealFound) {
			voucher.deal_id = idDeal;
		}
		if(!voucherFound || !dealFound) {
			vouchers.push(voucher);
			localStorage.setItem('localVouchers', JSON.stringify(vouchers));
			localStorage.removeItem('vouchersSent');
		}
	},

	synchronizeVouchers: function() {
		var vouchersUsed = JSON.parse(localStorage.getItem('vouchersUsed')) || new Array();
		var sent = localStorage.getItem('vouchersSent');
		if(sent == undefined) {
			var vouchersModified = new Array();
			for(var i = 0; i < vouchersUsed.length; i++) {
				if(!vouchersUsed[i].sent) {
					vouchersUsed[i].sent = true;
					vouchersModified.push(vouchersUsed[i]);
				}
			}
			localStorage.setItem('vouchersUsed', JSON.stringify(vouchersUsed));

			$.ajax({
				url: 'http://triptu.com/back/vouchers/update.json',
				type: 'POST',
				dataType: 'json',
				data: {
					data: {
						Voucher: vouchersModified
					}
				},
				beforeSend: function(jqXHR, settings) {
					$.displayProgress();
				},
				complete: function(jqXHR, textStatus) {
					$.hideProgress();
				},
				success: function(data) {
					localStorage.removeItem('localVouchers');
					localStorage.setItem('vouchersSent', true);
					jsPage.loadVouchers();
				},
				error: function(jqXHR,error,errorThrown) {
				}
			});
		}
	},

	displayVouchers: function() {
		var vouchers = JSON.parse(localStorage.getItem('vouchers')) || new Array();
		$('#vouchers').empty();
		for(var i = 0; i < vouchers.length; i++) {
			if((vouchers[i].Deal.voucherPrice && vouchers[i].Deal.voucherPrice > 0 && !jsPage.isVoucherUsed(vouchers[i].Deal.id)) || (vouchers[i].Deal.voucherPrice && vouchers[i].Deal.voucherPrice > 0 && jsPage.isVoucherUsed(vouchers[i].Deal.id) && !vouchers[i].Deal.useOnce)) {
				var useOnce = '';
				if(vouchers[i].Deal.useOnce) {
					useOnce = 'voucherUseOnce';
				}
				$('#vouchers').append('<li class="' + useOnce + ' dealListItem">' +
				'<a href="#voucher?id=' + vouchers[i].Voucher.id + '" class="noDeco">' +
				'<div class="listItemImgBorder"><img src="' + vouchers[i].Deal.photo1 + '" class="listItemImg" /></div>' +
				'<div class="listItemInfos">' +
				'<h2 class="listItemTitle">' + vouchers[i].Deal.Dealdetail[0].name + '</h2>' +
				'<p class="listItemLocation">' + vouchers[i].Deal.Supplier.name + '</p>' +
				'<p class="listItemDetails">Voucher price: <span class="strikethrough">€' + vouchers[i].Deal.voucherPrice + '</span> <span class="uppercase">Free</span></p>' +
				'</div><div class="clear"></div></a></li>');
			}
		}
		$('#vouchers li:not(.voucherUseOnce) a').click(function(event) {
			event.preventDefault();
			jsPage.load($(this).attr('href'));
		});
		$('#vouchers li.voucherUseOnce a').click(function(event) {
			event.preventDefault();
			var href = $(this).attr('href');
			$('#dialogQuestion').dialog({
				dialogClass: 'paymentAcceptedDialog messageDialog',
				minHeight: 3,
				resizable: false,
				modal: true,
				buttons: {
					NO: function(){
						$(this).dialog('close');
					},
					YES: function(){
						$(this).dialog('close');
						jsPage.load(href);
					}
				}
			});
		});
	},

	loadVoucherFromDealId: function(dealId) {
		if($('div.pageActive').attr('id') == 'pageVoucher') {
			if(jsPage.orientation() == 0) {
				$('#pageVoucher div#voucherLandscape').hide();
				$('#pageVoucher p#voucherPrerequired').show();
				$('#back').removeClass('doneButton').addClass('backButton');
				$('#back').html('BACK');
				$('#header h1').html('VOUCHER');
			} else {
				$('#pageVoucher p#voucherPrerequired').hide();
				$('#back').addClass('doneButton').removeClass('backButton');
				$('#back').html('DONE');
				$('#pageVoucher div#voucherLandscape').show();
			}

			jsPage.setViewport(0);
			var deals = JSON.parse(localStorage.getItem('resort')).Deal;
			var found = false, i = 0;
			while(i < deals.length && !found) {
				found = deals[i].id == dealId;
				i++;
			}
			var deal = deals[i - 1];

			var localVouchers = JSON.parse(localStorage.getItem('localVouchers')) || new Array();
			found = false;
			i = 0;
			while(i < localVouchers.length && !found) {
				found = localVouchers[i].deal_id == dealId;
				i++;
			}

			var voucher = localVouchers[i - 1];
			if(!jsPage.isVoucherUsed(voucher.deal_id)) {
				var account = JSON.parse(localStorage.getItem('account'));
				var vouchersUsed = JSON.parse(localStorage.getItem('vouchersUsed')) || new Array();
				voucher.sent = false;
				vouchersUsed.push(voucher);
				localStorage.setItem('vouchersUsed', JSON.stringify(vouchersUsed));
				localStorage.removeItem('vouchersSent');
			}

			$('#voucherDealDetailSupplierName').html(deal.Supplier.name);
			$('#voucherCode').html(localVouchers[i - 1].securityCode);
			$('#voucherDealDetailName').html(deal.Dealdetail[0].name);
			$('#voucherClientName').html(account.Customer.firstname + ' ' + account.Customer.lastname);
			if(deal.Dealdetail[0].condition) {
				$('#voucherDealDetailDescription').html(deal.Dealdetail[0].condition);
			} else {
				$('#voucherDealDetailDescription').html('');
			}
		}
	},

	loadVoucher: function(id) {
		if($('div.pageActive').attr('id') == 'pageVoucher') {
			if(jsPage.orientation() == 0) {
				$('#pageVoucher div#voucherLandscape').hide();
				$('#pageVoucher p#voucherPrerequired').show();
				$('#back').removeClass('doneButton').addClass('backButton');
				$('#back').html('BACK');
				$('#header h1').html('VOUCHER');
			} else {
				$('#pageVoucher p#voucherPrerequired').hide();
				$('#back').addClass('doneButton').removeClass('backButton');
				$('#back').html('DONE');
				$('#pageVoucher div#voucherLandscape').show();
			}

			jsPage.setViewport(0);
			var vouchers = JSON.parse(localStorage.getItem('vouchers'));
			var voucher = undefined;
			var i = 0;
			while((i < vouchers.length) && (voucher == undefined)) {
				if(vouchers[i].Voucher.id == id) {
					voucher = vouchers[i];
				}
				i++;
			}

			var account = JSON.parse(localStorage.getItem('account'));
			var vouchersUsed = JSON.parse(localStorage.getItem('vouchersUsed')) || new Array();
			if(!jsPage.isVoucherUsed(voucher.Deal.id)) {
				vouchersUsed.push({ id: voucher.Voucher.id, deal_id: voucher.Deal.id, sent: false, used: true, account_id: account.Account.id});
				localStorage.setItem('vouchersUsed', JSON.stringify(vouchersUsed));
				localStorage.removeItem('vouchersSent');
			}

			$('#voucherDealDetailSupplierName').html(voucher.Deal.Supplier.name);
			$('#voucherCode').html(voucher.Voucher.securityCode);
			$('#voucherDealDetailName').html(voucher.Deal.Dealdetail[0].name);
			$('#voucherClientName').html(account.Customer.firstname + ' ' + account.Customer.lastname);
			if(voucher.Deal.Dealdetail[0].condition) {
				$('#voucherDealDetailDescription').html(voucher.Deal.Dealdetail[0].condition);
			} else {
				$('#voucherDealDetailDescription').html('');
			}
		}
	},

	load: function(href) {
		var paths = href.substr(1).split('?');
		var params = undefined;
		if(paths[1] != undefined) {
			params = paths[1].split('=');
		}
		var uri = paths[0];

		$('div#footer .pageLauncher').removeClass('footerSelected');
		$('#back').removeClass('doneButton').addClass('backButton');
		$('#back').html('BACK');
		switch(uri) {
			case 'resorts': {
				$('div#footer #goResorts').addClass('footerSelected');
				$('div.page').removeClass('pageActive').hide();
				$('div.page#pageResorts').show().addClass('pageActive');
				$('#header h1').html('RESORTS');
				jsPage.loadResorts();
			}
			break;

			case 'deals': {
				$('#footer').show();
				$('#deals li').hide();
				$('#deals li.featuredDeal:random').show();
				$('div#footer #goDeals').addClass('footerSelected');
				$('div.page').removeClass('pageActive').hide();
				$('div.page#pageDeals').show().addClass('pageActive');
				jsPage.setViewport(89);
				$('.barCategories li').removeClass('categoryItemSelected');

				$('#back').unbind('click').click(function(event) {
					event.preventDefault();
					jsPage.load('#resorts');
				});

				if(params != undefined) {
					jsPage.loadDeals(params[1]);
				} else {
					var resort = JSON.parse(localStorage.getItem('resort'));
					if(resort == undefined) {
						$.showMessage('<h3>Please select a resort first!</h3>', function() {
							location.replace('triptu.php');
						});
					} else {
						jsPage.loadDeals(resort.Resort.id);
					}
				}
			}
			break;

			case 'deal': {
				$('div#footer #goDeals').addClass('footerSelected');
				$('div.page').removeClass('pageActive').hide();
				$('div.page#pageDeal').show().addClass('pageActive');
				jsPage.setViewport(42);

				$('#back').unbind('click').click(function(event) {
					event.preventDefault();
					jsPage.load('#deals');
				});

				jsPage.loadDeal(params[1]);
			}
			break;

			case 'myTriptu': {
				$('div#footer').show();
				$('div#footer #goMyTriptu').addClass('footerSelected');
				$('div.page').removeClass('pageActive').hide();
				$('div.page#pageMyTriptu').show().addClass('pageActive');
				jsPage.setViewport(42);
				$('#header h1').html('MY TRIPTU');

				jsPage.synchronizeVouchers();

				$('#back').unbind('click').click(function(event) {
					event.preventDefault();
					jsPage.load('#resorts');
				});

				$('#unlockCodeLink').click(function(event) {
					event.preventDefault();
					$('#dialogCode').dialog({
						dialogClass: 'paymentDialog',
						modal: true,
						resizable: false,
						title: 'Promo code'
					});
				});
				$('#unlockCodeForm').submit(function(event) {
					jsPage.unlockDeals($('#unlockCode').val());
					return false;
				});
			}
			break;

			case 'voucher': {
				$('#back').unbind('click').click(function(event) {
					event.preventDefault();
					jsPage.load('#deals');
				});

				$('div#footer').hide();
				$('#header h1').html('VOUCHER');
				$('div.page').removeClass('pageActive').hide();
				$('div.page#pageVoucher').show().addClass('pageActive');

				var id = params[1];
				window.addEventListener(orientationEvent, function() {
					jsPage.loadVoucher(id);
				},
				false);
				jsPage.loadVoucher(id);
			}
			break;

			case 'voucherFromDealId': {
				$('#back').unbind('click').click(function(event) {
					event.preventDefault();
					jsPage.load('#deals');
				});

				$('div#footer').hide();
				$('#header h1').html('VOUCHER');
				$('div.page').removeClass('pageActive').hide();
				$('div.page#pageVoucher').show().addClass('pageActive');

				var id = params[1];
				window.addEventListener(orientationEvent, function() {
					jsPage.loadVoucherFromDealId(id);
				},
				false);
				jsPage.loadVoucherFromDealId(id);
			}
			break;
		}
	},

	unlockDeals: function(code) {
		$.ajax({
			url: 'http://triptu.com/back/vouchers/r_check.json',
			type: 'POST',
			dataType: 'json',
			data: {
				data: {
					Code: {
						code: code
					}
				}
			},
			beforeSend: function(jqXHR, settings) {
				$.displayProgress();
			},
			complete: function(jqXHR, textStatus) {
				$.hideProgress();
			},
			success: function(vouchers) {
				if(vouchers instanceof Object) {
					var dialog = $('#dialogThanksCode').dialog({
						dialogClass: 'paymentDialog',
						modal: true,
						resizable: false,
						title: 'Thank you!',
						close: function(event, ui) {
						}
					});
					$('.okButton').unbind('click').click(function() {
						dialog.dialog('close');
						$('#pagePayment').dialog('close');
					});
					jsPage.loadVouchers();
				} else {
					$.showMessage('<h3>Code failure</h3>');
				}
			},
			error: function(jqXHR, error, errorThrown) {
				$.showMessage('<h3>Code failure</h3>');
			}
		});
	},

	scroller: undefined,
	lastDelta: 0,
	setViewport: function(delta) {
		jsPage.lastDelta = (delta == undefined) ? 0 : delta;
		$('.pageActive .wrapper').css('bottom', jsPage.lastDelta + 'px');
		if(jsPage.scroller) {
			jsPage.scroller.destroy();
		}
		if($('.pageActive .wrapper').length > 0) {
			jsPage.scroller = new iScroll($('.pageActive .wrapper')[0], { vScrollbar: false });
		}
	}
};
jsPage.init();
jsPage.checkUniqueIds();

function initScroller() {
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
}

var supportsOrientationChange = "onorientationchange" in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
window.addEventListener(orientationEvent, function() {
	if(jsPage.scroller != undefined) {
		jsPage.scroller.refresh();
	}
},
false);
try { document.addEventListener('DOMContentLoaded', setTimeout(function () { jsPage.setViewport(); }, 200), false); } catch(error) {}
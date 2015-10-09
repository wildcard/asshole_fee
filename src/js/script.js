function update_status() {
  var template_row = '<div class="row">';
  template_row += '<div class="col-md-8"><p class="reg">$lp$</p></div>';
  //template_row+='<div class="col-md-4">$points$</div>';
  template_row += '<div class="col-md-2"><div class="stopsign"><span class="stopword">$points$ </span> </div></div>';
  template_row += '<div class="col-md-2"><a href="/checkout/$lp$"><img src="https://www.paypal.com/en_US/i/btn/btn_xpressCheckout.gif" class="checkout"></a></div>'
  template_row += '</div>\n';

  jQuery.getJSON('/list', function(data) {
    var status_box = jQuery('#status');

    status_box.empty();

		jQuery.each(data, function(key, value) {
      status_box.append(template_row.replace('$lp$', key).replace('$points$', value));
    })
  });
}
//main
jQuery(document).ready(function() {
	$('.modal-trigger').leanModal({
		complete: function() {

			var lt =  $('#payment-lpr').val();
			var triggered = window.channel.trigger('update-jerks', { jerkId: lt });
			//alert('Closed');
		}
	});
  //update_status();
	setToken();
});

function setToken(argument) {

  jQuery.getJSON('/client_token', function(data) {

    braintree.setup(data, "dropin", {
      container: "payment-form",
			onPaymentMethodReceived: function(nonce, type, detalis){


				$.ajax({
		      url: '/list',
		      dataType: 'json',
		      cache: false,
		      success: function(data) {
						var triggered = window.channel.trigger('update-jerks', data);
		      },
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }
		    });

			}
    });
  });



}

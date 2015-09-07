function update_status()
{
	var template_row='<div class="row">';
	template_row+='<div class="col-md-8"><p class="reg">$lp$</p></div>';
	//template_row+='<div class="col-md-4">$points$</div>';
	template_row+='<div class="col-md-2"><div class="stopsign"><span class="stopword">$points$ </span> </div></div>';
	template_row+='<div class="col-md-2"><a href="/checkout/$lp$"><img src="https://www.paypal.com/en_US/i/btn/btn_xpressCheckout.gif" class="checkout"></a></div>'
	template_row+='</div>\n';
	
	jQuery.getJSON('/list',function (data) {
		var status_box=jQuery('#status');
		status_box.empty();
		jQuery.each(data,function (key,value) {			
			status_box.append( template_row.replace('$lp$',key).replace('$points$',value));
		})
	});
	setTimeout(update_status, 3000);
}
//main
jQuery(document).ready(function() {
	update_status();
});
function update_status()
{
	jQuery.getJSON('/list',function (data) {
		jQuery('#status').empty();
		jQuery.each(data,function (key,value) {
			jQuery( "#status" ).append( '<div class="row"><div class="col-md-8"><p class="reg">'+key+'</p></div><div class="col-md-4">'+value+'</div></div>' );
		})
	});
	setTimeout(update_status, 3000);
}
//main
jQuery(document).ready(function() {
	update_status();
});
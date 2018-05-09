jQuery(document).ready(function($) {
	$('.delete').click(function(event) {
		swal({
		  title: "Estás Seguro de borrarlo?",
		  icon: "warning",
		  buttons: true,
		  dangerMode: true,
		})
		.then((willDelete) => {
		  if (willDelete) {
		  	var parent = $(this).closest('tr');
		  	var id = parent.data('id'); 
		  	$.ajax({
		  		url: '/delete',
		  		type: 'POST',
		  		data: {id: id},
		  	})
		  	.done(function() {
		  		swal("Borrado!", {
			      icon: "success",
			    });

			    parent.hide();
		  	})
		  	.fail(function() {
		  		console.log("error");
		  	})
		  	
		    
		  }
		});
	});
});
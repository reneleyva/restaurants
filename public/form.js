var validate = function() {
		var re_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var re_site = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
		var lat_reg = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
		var lng_reg = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;
		let name = $('#name').val();
		let site = $('#site').val();
		let email = $('#email').val();
		let street = $('#street').val();
		let city = $('#city').val();
		let state = $('#state').val();
		let lat = $('#lat').val();
		let long = $('#long').val();
		let rating = parseInt($('#rating').val());


		if (!re_email.test(email)) {
			swal('Email no válido!', '', 'error');
			return false; 
		} else if (!re_site.test(site.split("//:")[0])) {
			swal('Sitio no válido', 'Debe ser de la forma http://sitio.com', 'error');
			return false; 
		} else if (rating > 4 || rating < 0) {
			swal('Rating no válido', 'Rating debe de ser de 0-4', 'error');
			return false; 
		} else if (!lat_reg.test(lat)) {
			swal('Latitud no válida', '', 'error');
			return false; 
		} else if (!lng_reg.test(long)) {
			swal('Longitud no válida', '', 'error');
			return false; 
		}

		return true;
};
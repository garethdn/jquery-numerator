(function(){

	$(document).on('click', '#numerate', parseForm);

	function parseForm(e) {
		e.preventDefault();
		var options = {};

		$.each($('#numerator-settings input'), function(i, val){
			options[$(val).attr('name')] = $(val).val();
		});

		$.each($('#numerator-settings select'), function(i, val){
			options[$(val).attr('name')] = $(val).val();
		});

		console.log(options);
		$('#demo-display p').numerator(options);
	}

})();

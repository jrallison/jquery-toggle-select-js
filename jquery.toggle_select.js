// begin closure
(function($) {
  var opts;
	var selects;
	var changed;
	var options_width;
 
  jQuery.fn.toggle_select = function(options) {
    // Extend out default options with those provided
    opts = jQuery.extend({}, jQuery.fn.toggle_select.defaults, options);
    selects = this;
		options_width = parseInt(opts.width - opts.switch_width);
    
    // Iterate over each matched element
    selects.each(function( ) {
      $this = jQuery(this);

			// Make sure the select has at least two options
			if ($this.children('option').length < 2)
				return;
      
      // Replace select with toggle
			$this.wrap("<span class='toggle_switch'></span>");
			
			var toggle = $this.parent();
			var first_option = $this.children('option:first');
			var second_option = first_option.next('option');
			
      toggle.append("<span class='toggle_on_side'></span>");
			toggle.append("<span class='switch'>");
			toggle.find('.switch').append("<span class='toggle_on' value='" + first_option.attr('value') + "'>" + first_option.text() + "</span>");
			toggle.find('.switch').append("<span class='toggle_button'></span>");
			toggle.find('.switch').append("<span class='toggle_off' value='" + second_option.attr('value') + "'>" + second_option.text() + "</span></span>");
			toggle.append("<span class='toggle_off_side'></span>");
			
			// Set CSS attributes based on options
			setup_css(toggle);
			
			if (opts.on)
				switch_on(toggle);
    });

		// Setup events
		j$(".toggle_switch .toggle_button").click(function() {
      // Don't toggle on the same mouseup as a user drag
      if(!changed)
        toggle_switch(j$(this).parents(".toggle_switch"));
    });
    j$(".toggle_switch .toggle_button").mousedown(function() {
      // Reset changed on every mousedown
      changed = false;
    })
    
		// Make center switch draggable
    j$(".toggle_switch .switch").draggable({ axis:'x', handle: j$(this).find('.toggle_button'), 
      start: function(e, ui) {
        // Called only when the mouse has started dragging, disable toggles
        changed = true;
      },
      drag: function(e, ui) {
        // Don't allow drag beyond certain boundaries
        if (ui['position'].left < -options_width)
          ui['position'].left = -options_width;
        else if (ui['position'].left > 0)
          ui['position'].left = 0;
        
        return ui['position'];
      },
      stop: function(e, ui) {
        // If the button is in the middle, move to one position or the other
        if (ui['position'].left > -options_width / 2)
          switch_on(j$(this).parent());
        else
          switch_off(j$(this).parent());
      }
    });
  };

	// Set default options for the toggle
  jQuery.fn.toggle_select.defaults = {
    width        : 80,      // Width of entire toggle
		height       : 27,      // Height of entire toggle
		switch_width : 39,      // Width of the switch between the two options
		inner_margin : -3,      // The margin between each option and the switch in the middle
    on           : false,   // Whether the toggle is initially set to on
    speed        : 100      // Speed of the toggle animation
  };
  
  // Private functions
	function toggle_switch(toggle_switch) {
    if (is_off(toggle_switch))
      switch_on(toggle_switch);
    else
      switch_off(toggle_switch);
  }
  function switch_off(toggle_switch) {
    toggle_switch.children(".switch").animate({left: -options_width}, opts.speed);
    toggle_switch.children("select.toggle").val(toggle_switch.find(".switch .toggle_off").attr('value'));
  }
  function switch_on(toggle_switch) {
    toggle_switch.children(".switch").animate({left: '0px'}, opts.speed);
    toggle_switch.children("select.toggle").val(toggle_switch.find(".switch .toggle_on").attr('value'));
  }
  function is_on(toggle_switch) {
    return toggle_switch.children(".switch").css('left') == '0px';
  }
  function is_off(toggle_switch) {
    return toggle_switch.children(".switch").css('left') == -options_width + 'px';
  }

	function setup_css(toggle) {
		toggle.css('width', opts.width + 'px');
		toggle.css('height', opts.height + 'px');
		
		toggle.children('.switch').css('width', (opts.width * 2) + 'px');
		toggle.children('.switch').css('left', -options_width + 'px');
		
		toggle.find('.toggle_off_side').css('left', (opts.width - 4) + 'px');
		
		toggle.find('.switch span').css('width', (options_width - opts.inner_margin) + 'px');
		toggle.find('.switch span').css('line-height', opts.height + 'px');
		toggle.find('.switch .toggle_on').css('margin-right', opts.inner_margin + 'px');
		toggle.find('.switch .toggle_off').css('margin-left', opts.inner_margin + 'px');
		toggle.find('.switch .toggle_button').css('width', opts.switch_width + 'px');
	}
 
// end closure
}) ( jQuery );
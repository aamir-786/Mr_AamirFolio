	var faq_view = 0;
	
	$(function(){
	
		init_wysiwyg();
	
		init_charts();
	
		init_calendar();
	
		init_tables();
	
		init_panels() 
		
		init_faq();
		
		init_notices();
		
		init_gallery();
		
		init_codeView();
		
		init_sliders();
		
		if ($("select, input:checkbox, input:radio, input:file").size()){
			$("select, input:checkbox, input:radio, input:file").uniform(); 
		}
		
		if ($('#validation-form-sample').size()){
			jQuery("#validation-form-sample").validationEngine();
		}
		/*
		*/
		
	});
	
	
	$(window).load(function(){
	
		init_progress();
	
	});

	
	
	
		

	
	
	function init_charts() {
	
		if ($('.graph').size() == 0){
			return false;
		}
	
		
		Morris.Line({
		  element: 'raphael-graph-years',
		  data: [
			{y: '2012', a: 100},
			{y: '2011', a: 75},
			{y: '2010', a: 50},
			{y: '2009', a: 75},
			{y: '2008', a: 50},
			{y: '2007', a: 75},
			{y: '2006', a: 100},
			{y: '2005', a: 34},
			{y: '2004', a: 24},
			{y: '2003', a: 62},
			{y: '2002', a: 22}
		  ],
		  xkey: 'y',
		  ykeys: ['a'],
		  labels: ['Series A'],
		  lineColors: ['#f86638']
		});
	
	
		if (typeof($.plot) != 'function'){ 
			//log('*** Error - Flot javascript required files not loaded');
			
			return false;
		} 
	
	
		var data = [];
		var series = Math.floor(Math.random()*4)+3;

		for( var i = 0; i<series; i++){
			data[i] = { label: "Series"+(i+1), data: Math.floor(Math.random()*100)+1 }
		}
	
		
		if ($("#flot-pie-square").size()){
			$.plot($("#flot-pie-square"), data, {

				series: {
					pie: { 
						show: true,
						radius: 0.85,
						label: {
							show: true,
							radius: 2/3,
							formatter: function(label, series){
								return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'+label+'<br/>'+Math.round(series.percent)+'%</div>';
							},
							threshold: 0.1
						}
					}
				},

				legend: {
					show: false
				}
			});
		}


		if ($("#flot-donut").size()){
			$.plot($("#flot-donut"), data, {
				series: {
					pie: { 
						innerRadius: 0.3,
						show: true
					}
				},
				legend: {
					show:false
				}
			});
		}
		
		if ($("#flot-pie-normal").size()){
			$.plot($("#flot-pie-normal"), data, {
				series: {
					pie: { 
						show: true
					}
				},
				legend: {
					show:false
				},

				grid: {
					hoverable: true,
					clickable: true
				}
			});
		}
		//$("#flot-pie-normal").bind("plothover", pieHover);
		//$("#flot-pie-normal").bind("plotclick", pieClick);
	
	}
	
	
	function init_sliders(){
	
		if ($( "#slider").size()){
			$( "#slider").slider({
				range: "min",
				value: 37,
				min: 1,
				max: 700
				});
		}
		
		if ($( "#slider-range").size()){
			$( "#slider-range" ).slider({
				range: true,
				min: 0,
				max: 500,
				values: [ 75, 300 ],
				slide: function( event, ui ) {
					$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
				}
			});
		
			$( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
				" - $" + $( "#slider-range" ).slider( "values", 1 ) );
		}
	}
	
	
	
	function init_progress(){
		
		$('.progress-bar-large').each(function(){
			var percent = $('a', this).attr('rel');
			animate_progress(this, percent);
		});
		
	}
	
	function animate_progress(selector,  percent ){
		//$('.progress-bar-large div a').animate(
		$('a',selector).animate(
			{ width: percent+"%" }, 
			{
				step: function(now, fx) {
					var percent = Math.ceil(now)+"%";
					
					$(this).closest('.progress-bar-large').find('span').html(percent);
				},
				duration: 3000 
			});
	}
	
	function init_gallery(){
		$(".gallery .del").click(function(){
			
			$(this).closest('li').fadeOut('fast');
			
			//$(this).fadeOut('fast');
			
			return false;
		});
		
	}
	
	
	function init_faq(){
		var faq_stiky_index = false;
		
		if (faq_stiky_index){
			$('.columns-index').addClass('auto');
			}
		
		//$('.columns-index>ul').containedStickyScroll({ duration: 300 });
		
		$('.columns-index>ul>li>a').click(function(event){
			/*
			
			var stContentID = $(this).attr('rel');

			if ( faq_view==0 ){
				if ($('.columns-content>div.selected').size()){
					$('.columns-content>div.selected').slideUp('fast').removeClass('selected');
				}
				
				$('.columns-content #'+stContentID).slideDown('fast').addClass('selected');
			}
			*/
		});
		
		$('.columns-index ul ul a').click(function(){
		
			var goTo = $(this).attr('rel');
			
			if (goTo != "undefined"){
				//scrollTo('$')
				$(window).scrollTo( $('#'+goTo), 800 );
			}
			
		});
		
		$('.columns-index>ul>li').click(function(){
			
			if ($(this).hasClass('selected')) { return false; }
			
			$('.columns-index>ul>li').removeClass('selected active');
			$(this).addClass('selected active'); 
			
			if ( faq_view==1 ){ return false; }
			
			if($('.columns-index ul ul:visible').size()){
				$('.columns-index ul ul:visible').slideUp();
			}
			
			if ($('ul', this).size()){
				$('ul', this).slideDown();
			}
			
			return false;
		});
		
		$('.columns-index ul ul li').click(function(event){
			$('.columns-index>ul>li.active').removeClass('active selected');
			
			var pt_ul = $(this).closest('ul');			
			var pt_li = $(pt_ul).closest('li');
			$(pt_li).addClass('active selected');
		});
		
		/*
		$('.view-column').click(function(){
			faq_view = 1;
			
			$('.columns-index ul ul').each(function(){
				$(this).slideDown().animate({'margin-bottom':'15px'});		
			});
			
			$('.columns-content > div').slideDown();
		});
		*/
		
		/*
		$('.view-dropdown').click(function(){
			faq_view = 0;
			
			$('.columns-index li ul').each(function(){
				if (!$(this).parent().hasClass('selected')){
					$(this).animate({'margin-bottom':'0'}).slideUp();
				}
			});
			
			var activeContentID = $('.columns-index>ul>li.selected>a').attr('rel');
			
			$('.columns-content>div').each(function(){
				if ($(this).attr('id')==activeContentID){
				
				}else{
					$(this).slideUp();
				}
			});
		});
		*/
				

		
	}
	
	function init_notices(){

		$('.popup-info , .popup-warning , .popup-accept , .popup-error').click(function(){
			$(this).slideUp('fast');
		})
		
	}
	
	function init_wysiwyg() {
		
		$('textarea.wysiwyg-editor').each(function(){
			
			var editor_id = $(this).attr('id');
			new nicEditor({iconsPath : '_layout/scripts/nicEdit/nicEditorIcons.gif'}).panelInstance(editor_id); 
			
		});
		
	}
	
	function init_tables() {

		if ($('table.sortable').size()){
			$("table.sortable").tablesorter(); 
		}
		
		if ($('table.resizable').size()){
			
		}	
	}
	
	
	function init_panels() {
		
		$('.panel .collapse').click(function(){
			if ($(this).closest('.panel').hasClass('collapsed')){
				var restoreHeight = $(this).attr('id');
				
				$(this).closest('.panel').animate({height:restoreHeight+'px'}, function() {   
					$(this).removeClass('collapsed');
				});
				
			}else{
				var currentHeight = $(this).closest('.panel').height();
				
				$(this).attr('id', currentHeight);
				$(this).closest('.panel').addClass('collapsed').animate({height:'45px'}, function(){		});
			}
		}); 
		
		$('.panel .tabs li').click(function(){
			var parent = $(this).closest('.panel');
			var content = $('a', this).attr('rel');
			
			$('.tabs .active', parent).removeClass('active');
			$(this).addClass('active');
			
			$('.tabs-content > .active', parent).slideUp('fast', function(){
				$(this).removeClass('active');
				
				$('#'+content).slideDown('fast', function(){
					$(this).addClass('active');
				});
			});
			
			return false;
		});
		
	}
	
	function init_calendar(){
			if ($('#calendar').size() == 0){
				return false;
			}
			
			var date = new Date();
			var d = date.getDate();
			var m = date.getMonth();
			var y = date.getFullYear();
			
			$('#calendar').fullCalendar({
				header: {
					left: 'title',
					center: 'month,basicWeek,basicDay',
					right: 'prev next'
				},
				editable: true,
				events: [
					{
						title: 'All Day Event',
						start: new Date(y, m, 1)
					},
					{
						title: 'Long Event',
						start: new Date(y, m, d-5),
						end: new Date(y, m, d-2)
					},
					{
						id: 999,
						title: 'Repeating Event',
						start: new Date(y, m, d-3, 16, 0),
						allDay: false
					},
					{
						id: 999,
						title: 'Repeating Event',
						start: new Date(y, m, d+4, 16, 0),
						allDay: false
					},
					{
						title: 'Meeting',
						start: new Date(y, m, d, 10, 30),
						allDay: false
					},
					{
						title: 'Lunch',
						start: new Date(y, m, d, 12, 0),
						end: new Date(y, m, d, 14, 0),
						allDay: false
					},
					{
						title: 'Birthday Party',
						start: new Date(y, m, d+1, 19, 0),
						end: new Date(y, m, d+1, 22, 30),
						allDay: false
					},
					{
						title: 'Click for Google',
						start: new Date(y, m, 28),
						end: new Date(y, m, 29),
						url: 'http://google.com/'
					}
				]
			});
	}
	
	function init_codeView(){
		if ($('.code').size()){
			$(".code.css").snippet("css",{style:"acid",transparent:true,showNum:true});
			$(".code.php").snippet("php",{style:"acid",transparent:true,showNum:true});
			$(".code.js").snippet("javascript",{style:"acid",transparent:true,showNum:true});
			$(".code.html").snippet("html",{style:"acid",transparent:true,showNum:true});
			$(".code.sql").snippet("sql",{style:"acid",transparent:true,showNum:true});
		}
	}
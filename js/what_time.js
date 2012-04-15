
    //Global variables
    var offset = -4;  //Defaults to tampa, fl

    // Create two variable with the names of the months and days in an array
    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]; 
    var dayNames= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

    var newDate = new Date();
    var citybDate = calcTime(offset);  // Default to tampa fl for now
   
$(document).ready(function() {
      
    //Update time in City A (left side) to current city of PC
    $("#lft_cap").html(geoplugin_city() + ", " + geoplugin_region() + ", " + geoplugin_countryCode());
            
    //console.log("Time in City B: " + citybDate );
    citybDate.setDate(citybDate.getDate());
    
    // Extract the current date from Date object
    newDate.setDate(newDate.getDate());
    
    // Output the day, date, month year
    $('#Date').html(dayNames[citybDate.getDay()] + " " + citybDate.getDate() + ' ' + monthNames[citybDate.getMonth()] + ' ' + citybDate.getFullYear());
    
    // Output the day, in string
    $('#Date1').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());
    
    // Update all times every 1 sec
    setInterval( function(){
        update_time_periodically();

    }, 1000);

}); // end document.ready func


    // Generic function to update times periodically
    function update_time_periodically(){
        
        var citya_date = new Date();
        //Get Current Time 
        var ta_secs = citya_date.getSeconds();
        //console.log("City A Secs: " + ta_secs );
        $("#sec").html(padNumber(ta_secs));

        var ta_mins = citya_date.getMinutes();
        $("#min").html(padNumber(ta_mins));

        var ta_hrs = citya_date.getHours();
        ta_hrs = make_hrs_human_readable(ta_hrs);
        $("#hours").html( padNumber(ta_hrs));

        // City B (target city you want to see time in)
        var cityb_date = calcTime(offset);
        var tb_secs = cityb_date.getSeconds();
        $("#sec1").html( padNumber(tb_secs));

        var tb_min = cityb_date.getMinutes();
        $("#min1").html( padNumber(tb_min));

        var tb_hrs = cityb_date.getHours();
        tb_hrs = make_hrs_human_readable(tb_hrs);
        $("#hours1").html( padNumber(tb_hrs));
        
    }

    // Helper functions for showing digital clock 
    //Pad a number with 0 if it's less than 10
    function padNumber(n){
        return (n < 10 ? "0" : "") +n;
    }

    //Subtract from 12 for hours over 12 ex: 2300 hours=11pm
    function make_hrs_human_readable(h){
        if( h > 12 ){
            h = parseInt(h) - parseInt(12);
        }
        return h;
    }

    /**
     * Given a time offset UTC, return date obj
     */
    function calcTime(offset){

        d = new Date();      
        // http://www.techrepublic.com/article/convert-the-local-time-to-another-time-zone-with-this-javascript/6016329
        //convert to msec & add local timezone offset
        utc = d.getTime() + (d.getTimezoneOffset() * 60000 );
        //new date for diff city
        nd = new Date(utc + (3600000*offset));
        
        return nd;
    } 


    /*****************************************************************
     ** Function take name of city acitybDate updates page to show selected
     ** city's time
     ****************************************************************/
    function update_time_for_city_b( location ){
        //console.log("FicitybDate time in " + location );        

        // Dynamically modify city time
        var api_key = "23da36ffb9090329120604";  //API which returns time offset given city name
        var t_url = "http://www.worldweatheronline.com/feed/tz.ashx?key=23da36ffb9090329120604&q="+ location + "&format=json";
        console.log("URL: " + t_url );
        $.ajax({ 
            type: "GET", 
            url: t_url, 
            dataType: "jsonp", 
            success: function( json){
                console.log(json);
                
                processAndUpdateScreen(json);
            }//success
        });//ajax
                
    }// ecitybDate func update_time_for_city_b


    function processAndUpdateScreen(json){
        offset = json.data.time_zone[0].utcOffset;
        citybDate = calcTime(offset);
        console.log("Time for target city b: "+ citybDate );

        //Get value of what user entered and update screen
        $("#rt_cap").html( $("#f_elem_city").val() );

       //Clear input bar indicating ready-ness for next input 
       $("#f_elem_city").val("");
        


    }

    jQuery(function () 
           {
	       jQuery("#f_elem_city").autocomplete({
		   source: function (request, response) {
		       jQuery.getJSON(
			   "http://gd.geobytes.com/AutoCompleteCity?callback=?&q="+request.term,
			   function (data) {
			       response(data);
			   }
		       );
		   },
		   minLength: 3,
		   select: function (event, ui) {
		       var selectedObj = ui.item;
		       jQuery("#f_elem_city").val(selectedObj.value);
                       console.log("Selected city: " + selectedObj.value);
                       update_time_for_city_b(selectedObj.value);
		       return false;
		   },
		   open: function () {
		       jQuery(this).removeClass("ui-corner-all").addClass("ui-corner-top");
		   },
		   close: function () {
		       jQuery(this).removeClass("ui-corner-top").addClass("ui-corner-all");
		   }
	       });
	       jQuery("#f_elem_city").autocomplete("option", "delay", 100);
	   });// jquery func

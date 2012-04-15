(function() {
  var calcTime, city_autocomplete_url, dayNames, make_hrs_human_readable, monthNames, offset, padNumber, processAndUpdateScreen, update_target_city_name, update_time_for_city_b, update_time_periodically;

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  offset = -4;

  update_time_periodically = function() {
    var citya_date, cityb_date, ta_hrs, ta_mins, ta_secs, tb_hrs, tb_min, tb_secs;
    citya_date = new Date();
    ta_secs = citya_date.getSeconds();
    $("#sec").html(padNumber(ta_secs));
    ta_mins = citya_date.getMinutes();
    $("#min").html(padNumber(ta_mins));
    ta_hrs = citya_date.getHours();
    ta_hrs = make_hrs_human_readable(ta_hrs);
    $("#hours").html(padNumber(ta_hrs));
    cityb_date = calcTime(offset);
    tb_secs = cityb_date.getSeconds();
    $("#sec1").html(padNumber(tb_secs));
    tb_min = cityb_date.getMinutes();
    $("#min1").html(padNumber(tb_min));
    tb_hrs = cityb_date.getHours();
    tb_hrs = make_hrs_human_readable(tb_hrs);
    return $("#hours1").html(padNumber(tb_hrs));
  };

  padNumber = function(n) {
    return (n < 10 ? "0" : "") + n;
  };

  make_hrs_human_readable = function(h) {
    if (h > 12) h = parseInt(h) - parseInt(12);
    return h;
  };

  calcTime = function(offset) {
    var d, nd, utc;
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000 * offset));
    return nd;
  };

  update_time_for_city_b = function(location) {
    var api_key, t_url;
    api_key = "23da36ffb9090329120604";
    t_url = "http://www.worldweatheronline.com/feed/tz.ashx?key=23da36ffb9090329120604&q=" + location + "&format=json";
    console.log("URL: " + t_url);
    return $.ajax({
      type: "GET",
      url: t_url,
      dataType: "jsonp",
      success: function(json) {
        console.log(json);
        return processAndUpdateScreen(json);
      }
    });
  };

  processAndUpdateScreen = function(json) {
    var target_city_time;
    offset = json.data.time_zone[0].utcOffset;
    target_city_time = calcTime(offset);
    console.log("target city: " + target_city_time);
    update_target_city_name($("#f_elem_city").val());
    return $("#f_elem_city").val("");
  };

  city_autocomplete_url = "http://gd.geobytes.com/AutoCompleteCity?callback=?";

  jQuery(function() {
    jQuery("#f_elem_city").autocomplete({
      source: function(request, response) {
        return jQuery.getJSON(city_autocomplete_url + "&q=" + request.term, function(data) {
          return response(data);
        });
      },
      minLength: 3,
      select: function(event, ui) {
        var selectedObj;
        selectedObj = ui.item;
        jQuery("#f_elem_city").val(selectedObj.value);
        console.log("Selected city: " + selectedObj.value);
        update_time_for_city_b(selectedObj.value);
        return false;
      },
      open: function() {
        return jQuery(this).removeClass("ui-corner-all").addClass("ui-corner-top");
      },
      close: function() {
        return jQuery(this).removeClass("ui-corner-top").addClass("ui-corner-all");
      }
    });
    return jQuery("#f_elem_city").autocomplete("option", "delay", 100);
  });

  update_target_city_name = function(target_city_name) {
    $("#rt_cap").html(target_city_name);
    return $("#target_city").html(target_city_name);
  };

  $(document).ready(function() {
    var citybDate, time_now;
    time_now = new Date();
    citybDate = calcTime(offset);
    $("#lft_cap").html(geoplugin_city() + ", " + geoplugin_region() + ", " + geoplugin_countryCode());
    $("#Date").html(dayNames[citybDate.getDay()] + " " + citybDate.getDate() + " " + monthNames[citybDate.getMonth()] + " " + citybDate.getFullYear());
    $("#Date1").html(dayNames[time_now.getDay()] + " " + time_now.getDate() + " " + monthNames[time_now.getMonth()] + " " + time_now.getFullYear());
    update_target_city_name("Tampa, FL, United States");
    return setInterval((function() {
      return update_time_periodically();
    }), 1000);
  });

}).call(this);

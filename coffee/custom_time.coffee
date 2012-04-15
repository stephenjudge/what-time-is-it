# Global variables
monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
offset = -4 # Default to tampa, fl

update_time_periodically = ->
  citya_date = new Date() # Always defaults to current time, current city
  ta_secs = citya_date.getSeconds()
  #console.log "Secs: " + ta_secs
  $("#sec").html padNumber(ta_secs)
  ta_mins = citya_date.getMinutes()
  $("#min").html padNumber(ta_mins)
  ta_hrs = citya_date.getHours()
  ta_hrs = make_hrs_human_readable(ta_hrs)
  $("#hours").html padNumber(ta_hrs)

  cityb_date = calcTime(offset)      # Get it fresh as possible
  tb_secs = cityb_date.getSeconds()
  #console.log "Target city secs: " + tb_secs
  $("#sec1").html padNumber(tb_secs)
  tb_min = cityb_date.getMinutes()
  $("#min1").html padNumber(tb_min)
  tb_hrs = cityb_date.getHours()
  tb_hrs = make_hrs_human_readable(tb_hrs)
  $("#hours1").html padNumber(tb_hrs)
padNumber = (n) ->
  (if n < 10 then "0" else "") + n
make_hrs_human_readable = (h) ->
  h = parseInt(h) - parseInt(12)  if h > 12
  h
calcTime = (offset) ->
  d = new Date()
  utc = d.getTime() + (d.getTimezoneOffset() * 60000)
  nd = new Date(utc + (3600000 * offset))
  nd

update_time_for_city_b = (location) ->
  api_key = "23da36ffb9090329120604"
  t_url = "http://www.worldweatheronline.com/feed/tz.ashx?key=23da36ffb9090329120604&q=" + location + "&format=json"
  console.log "URL: " + t_url
  $.ajax
    type: "GET"
    url: t_url
    dataType: "jsonp"
    success: (json) ->
      console.log json
      processAndUpdateScreen json

# Update right side of screen with correct time of city input
processAndUpdateScreen = (json) ->
  offset = json.data.time_zone[0].utcOffset
  target_city_time = calcTime(offset)
  console.log "target city: " + target_city_time
  # Format Cityb Date into nice way
  $("#rt_cap").html $("#f_elem_city").val()
  $("#f_elem_city").val ""                        #Reset target city input box


# JSON URL
city_autocomplete_url = "http://gd.geobytes.com/AutoCompleteCity?callback=?"
jQuery ->
  jQuery("#f_elem_city").autocomplete
    source: (request, response) ->
      jQuery.getJSON city_autocomplete_url+"&q=" + request.term, (data) ->
        response data

    minLength: 3
    select: (event, ui) ->
      selectedObj = ui.item
      jQuery("#f_elem_city").val selectedObj.value
      console.log "Selected city: " + selectedObj.value
      update_time_for_city_b selectedObj.value
      false

    open: ->
      jQuery(this).removeClass("ui-corner-all").addClass "ui-corner-top"

    close: ->
      jQuery(this).removeClass("ui-corner-top").addClass "ui-corner-all"

  jQuery("#f_elem_city").autocomplete "option", "delay", 100

# When page loads...
$(document).ready ->

  time_now = new Date()
  target_city_time = calcTime(offset)

  citybDate = target_city_time
  citybDate.setDate citybDate.getDate()
  target_city_time = citybDate

  # Update name of current city on left side
  $("#lft_cap").html geoplugin_city() + ", " + geoplugin_region() + ", " + geoplugin_countryCode()

  # Update what day it is in target city
  $("#Date").html dayNames[citybDate.getDay()] + " " + citybDate.getDate() + " " + monthNames[citybDate.getMonth()] + " " + citybDate.getFullYear()

  # Update time in current city
  $("#Date1").html dayNames[time_now.getDay()] + " " + time_now.getDate() + " " + monthNames[time_now.getMonth()] + " " + time_now.getFullYear()

  $("#target_city").html $("#rt_cap").html()
  setInterval (->
    update_time_periodically()
  ), 1000

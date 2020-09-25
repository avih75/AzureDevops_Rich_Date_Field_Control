Rich Date Control...

# view short date
first this control give you the option to show a short date string.

# deffine limitation for the values
the other ventage is it give you the option to limit the date that can be pick
by give him two more date fields that contain the max or min date.
and with the max day or min days you can fine tune the date

for example :
you can put two date fields in your form, one represent the open date
and the second will have a limit of 7 days max (or min) from the open date.

# Nothis if the date passed
you can have a red sign if the date passed


configuration :

Date : (work item field) that will contain the date (short date)
Control Name : (text) The label of the field
Past limitation : (true/false) optional, if you want to set future date limitation (default reference is today date)
back Value : (work item field) optional, if you want to set the future limitation reference to other date field
back limit days : (number even negativ) optional, you can set a number of day to gap from the reference future date
future limitation : (true/false) optional, if you want to set Past date limitation (default reference is today date)
forword date ref : (work item field) optional, if you want to set the past limitation reference to other date field
forword limit days : (number even negativ) optional, you can set a number of day to gap from the reference past date
state to follow : (string) optional, you can set the state of this time represent, so it will show signal when the time passed and the state still

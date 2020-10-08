# Rich Date Control

## Features
### Date display
Displaying date only, without time  
![Layout Customization](img/B1.png)

### Relative Selection Range
![Layout Customization](img/C1.png)  
The selection can be ranged between two range-dates.  
Each range-date can be relative to a range-anchor-date (+- days)
The range-anchor-date can be either now, another date control in the work item.

For example: 
* Two weeks window (Relative Range between Now-7 and Now+7)
* Dynamic range between CreatedDate to DueDate (custom)

### Target State Date Visualization
![Layout Customization](img/B2.png)  
The control color visualize work item state target
For example:
- Color red when date passed and state Is Not one of "New" (On StartDate)
- Color red when date passed and state Is one of "New","Fixed", "Resolved" (On DueDate)

## Configuration
### General
* Date Field                    : (work item field) that will contain the date (short date) 

### Relative Selection Range
* Range Start Anchor            : (work item field) optional, if you want to set the start of range reference to other date field. Default, now.
* Range Start Anchor stretch    : (number postive/negative) optional, you can set a number of day to stretch / relax from the Range Start Anchor. Default, 0.
* Range End Anchor              : (work item field) optional, if you want to set the start of range reference to other date field. Default, now.
* Range End Anchor stretch      : (number postive/negative) optional, you can set a number of day to stretch / relax from the Range End Anchor. Default, 0.

### Target Status Date Visualization
* Status Target                 : (string, one of the System.Status) optional. Target this status and color accordingly.
* Status Condition              : (Is/IsNot one of) optional, track if in the System.Status Is / Is Not one of given values. 
* Status Condition Values       : (Is/IsNot one of) optional, track if in the System.Status Is / Is Not one of given values. 


## Installation:

![Layout Customization](img/A1.png)

![Layout Customization](img/A2.png)

![Layout Customization](img/A3.png)

# Function Machine

## Elevator Pitch
The Function Machine demonstrates to the student how plotting a graph works through animating numbers to and from a machine that accepts inputs and outputs.

## Overview
The Function Machine contains a table, a function machine, a graph, and graph options for the user to interact with a see.  The user inputs x values in the table and clicks "Go!" or hits the enter key for the animation to start running.  The Function Machine will clean and validate the x inputs according to the graph settings that have been setup by the professor.  Once the inputs have been cleaned and validated, then the x values will animate to the function machine to be outputed into a y value.  Once outputed, the y value will then animate to the y column in the table.  Afterwards, the x and y values will then animate to the Function Machine status.  The graph will then plot the x and y values.

## Features
1. X and Y values animate across the screen.
2. User can change the speed of the animation and show the graph line.
3. X inputs are validated and cleaned by the application with the Function Machine settings file.
4. The Function Machine status shows how to solve an equation.
5. Function Machine settings are editable by the professor and accessed through the URL.
6. Plot animate the x and y values on a graph.
7. The graph will remember any previously plotted points, and it will remember if a point has been changed.

## Getting Started

The function machine settings file is titled `funcMachineSettings.json` and is located in the [public folder](https://github.com/byuicampuscd/function-machine/tree/master/public) with the `index.html` file.  The `funcMachineSettings.json` file follows JavaScript Object Notation for data.  The first dimension of data is the name of the group equations.  In the current file, there is just the "general" settings.  The "general" settings then contain a title, instructions for the student, and a list of the equations with their corresponding settings.  

- The corresponding settings for the equations are: name, equation, latex, hideEquation, rounding, and view.  
- The name is the name of the equation.  
    - For example, the name could be "Linear" or "Cubic".  
- The equation is the representation of the name chosen.  
- The latex option is the equation option, but in a compatible format for the Function Machine application.  
    - The Latex equation must exist for the application to solve the equations for you.  
- The hideEquation option, makes the equation hidden to the student so that it does not show up in the status bar.
- The rounding option rounds all x and y values to the number given.
- The view is another JavaScript Object set to set the bounds of the graph window.

To make changes to the `funcMachineSettings.json` file, please follow the JavaScript Object Notation format for the application to remain stable.  You can double check and validate your JavaScript Object Notation [here](http://jsonlint.com/).

In order to load the professor configuration file, type in a query string into the url.  For example if I want to load the `general` settings from the funcMachineSettings.json file, I would type `?file=funcMachineSettings&load=general` to the end of the url.

### Hints...

for modifying the `funcMachineSettings.json` file.

1. Make sure there are no trailing commas on the last item of each dimensional list.  There should only be commas to delimit each item.
2. There can be many "general" settings in the settings file.  Just make sure the URL query resembles it.  For example, if I add another set of settings to the file not under the "general" but under the "mat110" settings, then I would change the URL query to `?file=funcMachineSettings&load=mat110`.
3. The instructions option follow HTML and unicode text format.  So you can add in line breaks `<br>` in the text as well.
4. In the "equations" option, it is an array.  So you can have as many equations as you want in the "equations" option.

## Demo
View the [Function Machine demo here](http://byuitechops.github.io/function-machine/public/?file=funcMachineSettings&load=general)!

## Support
If any bug or error occurs with this application, please submit a Github issue.  To submit an issue, go to the top of this screen and click on the "Issues" tab.  Once the page changes, click on the green "New Issue" button to type up the new issue.  Once you have finished typing up your issue, click the green "Submit new issue" button.

Submitting issues this way will notify the BYU-Idaho Technical Development Operations team.

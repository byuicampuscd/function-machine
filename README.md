# Function Machine

## Student Use
The student will see a table, graph, function machine, and several configuration options upon starting Function Machine.  With the machine, the student can see how plotting an equation works through the table and through the graph.

To use the application, the student inputs into the "x" column how many numbers they would like to plot on the graph.  There will be available up to 15 input boxes.  Once the desired amount of "x" numbers is reached, then the student can either hit "enter" on the keyboard or "Go!" on screen.  This will cause the function machine to caculate the "y" value with the given equation.  After the "y" value is given, the function machine will then plot the "x" and "y" coordinates on the graph.

## Professor Use
A professor will be able to set several options.  The graph limits setting, animate checkbox, and show graph checkbox will all be avaiable to modify for the professor.  With the graph limits setting, open the funcMachineSettings.js file for an example.  From there, the professor writes what type of graph that needs to be shown, the equations desired, and the limits on the graph.  In the application, check the animate or show graph checkboxes to allow further customization.

In order to load the professor configuration file, type in a query string into the url.  For example if I want to load the funcMachineSettings.json file, I would type the following to the end of the url.  

`
?file=funcMachineSettings
`

### Feature
The numbers will animate around the screen to their corresponding places to demonstrate how plotting an equation works.

### Browser Support
As of July 2016, Function Machine works best in Google Chrome.  It also works in Internet Explorer, Microsoft Edge, and Mozilla Firefox; however, there is one bug that needs to fixed in Firefox browser.
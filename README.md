# Function Machine

## Student Use
The student will see a table, graph, function machine, and several configuration options upon starting Function Machine.  With the machine, the student can see how plotting an equation works through the table and through the graph.

To use the application, the student inputs into the "x" column how many numbers they would like to plot on the graph.  There will be available up to 15 input boxes.  Once the desired amount of "x" numbers is reached, then the student can either hit "enter" on the keyboard or "Go!" on screen.  This will cause the function machine to caculate the "y" value with the given equation.  After the "y" value is given, the function machine will then plot the "x" and "y" coordinates on the graph.

## Professor Use
A professor will be able to set several options.  The graph limits, rounding, name, and equation will all be avaiable to modify for the professor.  With the graph limits setting, open the funcMachineSettings.js file for an example.  From there, the professor writes what type of graph that needs to be shown, the equations desired, and the limits on the graph.  In the application, check the animate or show graph checkboxes to allow further customization.

In order to load the professor configuration file, type in a query string into the url.  For example if I want to load the funcMachineSettings.json file, I would type `?file=funcMachineSettings` to the end of the url.  

### Feature
The numbers will animate around the screen to their corresponding places to demonstrate how plotting an equation works.

### Browser Support
As of July 2016, Function Machine works best in Google Chrome.  It also works in Internet Explorer, Microsoft Edge, and Mozilla Firefox; however, there is one bug that needs to fixed in Firefox browser.

### For the Developer

Function Machine was developed using ES6 compiled through Gulpjs.  The Gulpjs configuration has all the JS and CSS files being compiled into a "dist" folder.  If any changes are needed for this application, the following instructions will show you how to set up the development environment.

1. Gulp npm module is required to develop this application.  Run `npm install -g gulp` in the command line.
2. Clone the repository using the `git clone https://github.com/byuicampuscd/function-machine.git` command.
3. In the main directory of the application while in the command line, run `npm install` to install all the npm dependencies.
4. Once installed all the dependencies, in the main directory run `gulp watch` command to run the live reload server.  The `gulp watch` task is configured to only compile the scripts and css folder when changes are made.  
5. To see the changes being made live to the application, open a browser to the `http://localhost:3000` website.

Once the development has been setup, only make the changes in the "scripts" or "css" folder.  Once the changes are made, running Gulpjs will compile them newly into the "dist" folder.
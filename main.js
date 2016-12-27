require.config({
  paths: {
    jquery: 'libs/jquery-3.1.1.min',
    knockout: 'libs/knockout-3.4.1',
    bootstrap: 'libs/bootstrap.min'
  }
});

require([
  // Load our app module and pass it to our definition function
  'app',

], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});
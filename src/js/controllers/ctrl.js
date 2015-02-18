app.controller('myCtrl', function() {
 $scope.hello = 'hello world';
 var name = 'moje imie'; //czemu kurwa?
 var request = gapi.client(name);
});
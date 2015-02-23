app.service('channel', ['$rootScope', function($rootScope) {
    var channel = {
        basic: {
            title: 'Stranger',
            authorized: false
        }
    };

    return channel;
}]);
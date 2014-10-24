angular.module('starter.directives', [])
.directive('universe', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/element.html',
        scope:{ elem:'='},
        controller: function($scope, Preferences, PusherServ, auth){
            Preferences.get_followed_universe($scope.elem.id)
            .then(function(followed){
                $scope.elem.followed = followed;
            });
            $scope.setFollowed =function(){
                Preferences.set_followed_universe($scope.elem.id, $scope.elem.followed);
                PusherServ.publish('test_channel','my_event', {
                    'name':auth.profile.nickname, action: 'subscribed to '+ $scope.elem.name}
                )
            };
        }
    };
})
.directive('categorie', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/element.html',
        scope:{ elem:'='},
        controller: function($scope, Preferences, PusherServ, auth){
            Preferences.get_followed_categorie($scope.elem.id)
            .then(function(followed){
                $scope.elem.followed = followed;
            });
            $scope.setFollowed =function(){
                Preferences.set_followed_categorie($scope.elem.id, $scope.elem.followed);
                PusherServ.publish('test_channel','my_event', JSON.stringify({
                    'name':auth.profile.nickname, action: 'subscribed to '+ $scope.elem.name})
                )
            };
        }
    };
})
.directive('sp-event', function(){
    return {
        restrict: 'E',
        templateUrl: 'templates/event.html',
        scope:{ eventMsg:'='},
        controller: function($scope){
            $scope.name = $scope.eventMsg.name;
            $scope.action = $scope.eventMsg.action;
        }
    };
});

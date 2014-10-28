angular.module('starter.directives', [])
.directive('psUniverse', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/element.html',
        scope:{ elem:'='},
        controller: function($scope, Preferences, PusherServ, auth){
            Preferences.get_universe($scope.elem.id)
            .then(function(item){
                $scope.elem.followed = item && item.followed;
            });
            $scope.setFollowed =function(){
                Preferences.store_universe($scope.elem.id, $scope.elem);
                PusherServ.publish('test_channel','my_event', {
                    'name':auth.profile.nickname, action: 'subscribed to '+ $scope.elem.name}
                )
            };
        }
    };
})
.directive('psCategorie', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/element.html',
        scope:{ elem:'='},
        controller: function($scope, Preferences, PusherServ, auth){
            Preferences.get_categorie($scope.elem.id)
            .then(function(item){
                $scope.elem.followed = item && item.followed;
            });
            $scope.setFollowed =function(){
                Preferences.store_categorie($scope.elem.id, $scope.elem);
                PusherServ.publish('test_channel','my_event', JSON.stringify({
                    'name':auth.profile.nickname, action: 'subscribed to '+ $scope.elem.name})
                )
            };
        }
    };
})
.directive('psEvent', function(){
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

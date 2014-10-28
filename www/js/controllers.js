angular.module('starter.controllers', [])
.controller('LoginCtrl', function ($scope, auth, store, $location) {
   $scope.login = "";
})

.controller('PreferencesCtrl', function($scope, QueFaire, store, auth, $location) {

    $scope.myMode = 'Categories';
    $scope.modes = ['Universes', 'Categories'];
    $scope.universes = [];
    $scope.categories = [];
    QueFaire.get_universe().then(function(data){
        $scope.universes = data;
    });
    QueFaire.get_categories().then(function(data){
        $scope.categories = data;
    });
    $scope.logout = function() {
      auth.signout();
      store.remove('profile');
      store.remove('token');
      $location.path('/login');
  };
})

.controller('DashCtrl', function($scope, PusherServ, store, auth, $location, Preferences) {
    $scope.messages = [];
    Preferences.get_events().then(function(data){
        if(data)
            $scope.messages = $scope.messages.concat(data);
    })
    PusherServ.subscribeTo('test_channel','my_event')
    .then(function(data){},function(error){},function(data){
        if(data){
            $scope.messages.push(data);
            Preferences.add_event(data);
        }
    });

    $scope.logout = function() {
      auth.signout();
      store.remove('profile');
      store.remove('token');
      $location.path('/login');
  };
})

.controller('FriendsCtrl', function($scope, Friends, store, auth, $location) {
  $scope.friends = Friends.all();

  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $location.path('/login');
};
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends, store, auth, $location) {
  $scope.friend = Friends.get($stateParams.friendId);

  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $location.path('/login');
};
})

.controller('SearchCtrl', function($scope, QueFaire, Preferences, $q, store, auth, $location){
    $scope.activities = [];
    $q.all([Preferences.get_all_followed_universes(),
    Preferences.get_all_followed_categories()])
    .then(function(res){
        var universes = [],
            categories = [];
        for(var i = 0; i < res[0].length;++i){
            universes.push(res[0][i].id);
        }
        for(var i = 0; i < res[1].length;++i){
            categories.push(res[1][i].id);
        }
        QueFaire.get_activities(universes,categories, undefined, undefined, undefined, 0, 25)
        .then(function(act){
            $scope.activities=act;
        });
    });

    $scope.logout = function() {
      auth.signout();
      store.remove('profile');
      store.remove('token');
      $location.path('/login');
  };

})


.controller('AccountCtrl', function($scope,  store, auth, $location) {

    $scope.logout = function() {
      auth.signout();
      store.remove('profile');
      store.remove('token');
      $location.path('/login');
  };
});

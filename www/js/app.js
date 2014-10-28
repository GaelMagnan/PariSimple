// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',  'auth0', 'angular-storage', 'angular-jwt', 'starter.controllers',
                            'starter.services', 'starter.directives'])

.run(function($ionicPlatform, auth, $rootScope, store) {
  // This hooks al auth events to check everything as soon as the app starts
  auth.hookEvents();
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        auth.authenticate(store.get('profile'), token);
      }
    }
  });
})
.config(function($stateProvider, $urlRouterProvider, authProvider, $httpProvider, jwtInterceptorProvider) {


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
      resolve: {login: function ( auth, store, $location) {
              auth.signin({
                authParams: {
                  scope: 'openid offline_access',
                  device: 'Mobile device'
                }
              }, function(profile, token, accessToken, state, refreshToken) {
                // Success callback
                store.set('profile', profile);
                store.set('token', token);
                store.set('refreshToken', refreshToken);
                $location.path('/dash');
              }, function() {
                // Error callback
              });
          }
      }
    })
    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html",
      data: {
      // This tells Auth0 that this state requires the user to be logged in.
      // If the user isn't logged in and he tries to access this state
      // he'll be redirected to the login page
          requiresLogin: true
        }
    })

    // Each tab has its own nav history stack:

    .state('tab.preferences', {
      url: '/preferences',
      views: {
        'tab-preferences': {
          templateUrl: 'templates/tab-preferences.html',
          controller: 'PreferencesCtrl'
        }
      },
      requiresLogin: true
    })

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
  })
  .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'SearchCtrl'
        }
      }
    })
    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

    authProvider.init({
      domain: 'gaelmagnan.auth0.com',
      clientID: 'Yo36YSUdMnqXFsGAye6PzDwDGdTXneAX',
      loginState: 'login'
    });

});

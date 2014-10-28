var services = angular.module('starter.services', ['LocalForageModule']);

/**
 * A simple example service that returns some data.
 */
services.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff', likes:[] },
    { id: 1, name: 'G.I. Joe', likes:[] },
    { id: 2, name: 'Miss Frizzle', likes:[] },
    { id: 3, name: 'Ash Ketchum', likes:[] }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});


services.service('PusherServ',function($q){
    this.pusher = new Pusher('5b7649eb2108532d4156');
    this.channels = {};
    this.subscribeTo = function(myChannel, myEvent){
        var d = $q.defer();
        if(!this.channels[myChannel])
            this.channels[myChannel] = this.pusher.subscribe(myChannel);
        var channel = this.channels[myChannel];
        channel.bind(myEvent, function(data) {
            d.notify(data);
        });
        return d.promise;
    };
    this.publish = function(myChannel, myEvent, data){
        var d = $q.defer();
        if(!this.channels[myChannel])
            this.channels[myChannel] = this.pusher.subscribe(myChannel);
        var channel = this.channels[myChannel];
        channel.trigger(myEvent,data);
        d.resolve();
        return d.promise;
    }
});

services.service('Preferences', function($http,$q, $localForage){

    this.get_events = function(){
        return $localForage.getItem("events");
    };

    this.add_event = function(myEvent){
        return $localForage.getItem("events").then(function(data){
            if(data) data.push(myEvent);
            return $localForage.setItem("events", data);
        });
    }

    this.get_categorie = function(id){
        return $localForage.getItem("categories." + id);
    };
    this.get_universe = function(id){
        return $localForage.getItem("universes." + id);
    };
    this.store_universe =function(id, univ){
        return $localForage.setItem("universes." + id, univ);
    };
    this.store_categorie =function(id, cat){
        return $localForage.setItem("categories." + id, cat);
    };
    this.get_all_followed_universes = function(){
        return this.search(function(key, value){
            return key.substring(0,"universes".length) == "universes";
        });
    };
    this.get_all_followed_categories = function(){
        return this.search(function(key, value){
            return key.substring(0,"categories".length) == "categories";
        });
    };
    //until localforage is updated
    this.search = function search(filter) {
        // throw error on undefined key
        if(angular.isUndefined(filter)) {
            throw new Error("You must define a filter");
        }
        if(!angular.isFunction(filter)) {
            throw new Error("filter must be a function");
        }
        var deferred = $q.defer(),
            args = arguments;

        $localForage.keys().then(function success(keyList) {
            var promises = [],
                datas = [],
                ret = [];
            angular.forEach(keyList, function(key){
                var d = $q.defer()
                $localForage.getItem(key)
                .then(function success(item) {
                    datas.push({'key': key, 'value': item});
                    d.resolve();
                },function failure(err){
                    console.log(data);
                });
                promises.push(d.promise);
            });
            $q.all(promises).then(function(){
                angular.forEach(datas, function(data){
                    var key = data['key'],
                        value = data['value'];
                    if(filter(key, value))
                        ret.push(value);
                });
                deferred.resolve(ret);
            },function(err){
                console.log(data);
            });
        }, function error(data) {
            console.log(data);
            deferred.reject(data);
        });
        return deferred.promise;
    };
});

services.service('QueFaire', function($http,$q){
    this.baseUrl = "https://api.paris.fr/api/data/"
    this.token = '?token=f2657b1e39134e13a37ffca54a69540bb67f6a0a9b6a1eb0576875306a7a6901'
    this.get_universe = function(){
        var d = $q.defer();
        $http.get(this.baseUrl + '1.0/QueFaire/get_univers/' + this.token ,
        {cache: true})
        .success(function(data, status, headers, config){
            if( data.status == 'success')
                d.resolve(data.data);
            else{
                console.log(data.status);
                d.reject("Error durring call:"+data.status);
            }

        }).error(function(data, status, headers, config){
            console.log(status);
            d.reject("Error durring call:"+headers());
        });
        return d.promise;
    };
    this.get_categories = function(){
        var d = $q.defer();
        $http.get(this.baseUrl + '1.2/QueFaire/get_categories/' + this.token,
        {cache: true})
        .success(function(data, status, headers, config){
            if( data.status == 'success')
                d.resolve(data.data);
            else{
                console.log(data.status);
                d.reject("Error durring call:"+data.status);
            }

        }).error(function(data, status, headers, config){
            console.log(status);
            d.reject("Error durring call:"+headers());
        });
        return d.promise;
    };

    this.get_activities = function(categories, univers, created, start, end, offset, limit){
        var d = $q.defer();
        searchParams = "&cid=" + (categories ? categories.join() : "");
        searchParams += "&tag=" + (univers ? univers.join() : "");
        searchParams += "&created=" + (created ? created : "");
        searchParams += "&start=" + (start ? start : "");
        searchParams += "&end=" + (end ? end : "");
        searchParams += "&offset=" + (offset ? offset : "");
        searchParams += "&limit=" + (limit ? limit : "");
        $http.get(this.baseUrl + '1.4/QueFaire/get_activities/' + this.token + searchParams,
        {cache: true})
        .success(function(data, status, headers, config){
            if( data.status == 'success')
                d.resolve(data.data);
            else{
                console.log(data.status);
                d.reject("Error durring call:"+data.status);
            }

        }).error(function(data, status, headers, config){
            console.log(status);
            d.reject("Error durring call:"+headers());
        });
        return d.promise;
    };
});

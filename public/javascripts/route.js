"use strict";
var app = angular.module("myApp", ["ngRoute", 'ngCookies', 'ngSessionStorage']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/products', {
            templateUrl: 'products.html',
            controller: 'proCtrl'
        }).
        when('/cart', {
            templateUrl: 'cart.html',
            controller: 'proCtrl'
        }).
        when('/signup', {
            templateUrl: 'signup.html',
            controller: 'signupCtrl',
            resolve: {
                auth: function(signinService, $location) {
                    signinService.getSignStatus().success(function(res) {
                        console.log(res);
                        if (res.sign === true) {
                            console.log("u", res);
                            $location.path('/products');
                        }
                    })
                }
            }
        }).
        when('/signin', {
            templateUrl: 'signin.html',
            controller: 'signinCtrl',
            // resolve: {
            //     auth: function(signinService, $location) {
            //         signinService.getSignStatus().success(function(res) {
            //             console.log(res);
            //             if (res.sign === true) {
            //                 console.log("u", res);
            //                 if (res.direction && res.direction !== '/signin') {
            //                     $location.path('/res.direction');
            //                 }
            //                 $location.path('/profile');
            //             }
            //         })
            //     }
            // }
        }).
        when('/profile', {
            templateUrl: 'profile.html',
            controller: 'profileCtrl',
            resolve: {
                auth: function(signinService, $location) {
                    signinService.getSignStatus().success(function(res) {
                        console.log(res);
                        if (res.sign !== true) {
                            console.log("u", res);
                            $location.path('/signin');
                        }
                    })
                }
            }
        }).when('/logout', {
            templateUrl: 'logout.html',
            controller: 'logoutCtrl',
            resolve: {
                auth: function(signinService, $location) {
                    signinService.getSignStatus().success(function(res) {
                        console.log(res);
                        if (res.sign === true) {
                            console.log("u", res);
                            $location.path('/products');
                        }
                    })
                }
            }
        }).when('/checkout', {
            templateUrl: 'checkout.html',
            controller: 'checkoutCtrl',
            resolve: {
                auth: function(signinService, $location) {
                    signinService.getSignStatus().success(function(res) {
                        console.log(res);
                        if (res.sign !== true) {
                            console.log("u", res);
                            $location.path('/signin');
                        }
                    })
                }
            }
        }).when('/orders', {
            templateUrl: 'orders.html',
            controller: 'orderCtrl',
            resolve: {
                auth: function(signinService, $location) {
                    signinService.getSignStatus().success(function(res) {
                        console.log(res);
                        if (res.sign !== true) {
                            console.log("u", res);
                            $location.path('/signin');
                        }
                    })
                }
            }
        }).
        otherwise({
            redirectTo: '/products'
        });
    }
]);
//prevent Cross-site request forgery attack setting
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'XSRF-TOKEN';
    $httpProvider.defaults.xsrfHeaderName = 'XSRF-TOKEN';
}]);

//timeout redirect to login
app.config(['$httpProvider', function($httpProvider, $location) {
    $httpProvider.interceptors.push(['$q', function($q) {
        return {
            'responseError': function(rejection) {
                if (rejection.status === 440) {
                    $location.path('/signin');
                }
                return $q.reject(rejection);
            }
        };
    }]);
}]);
"use strict";
app.factory('productService', ['$http', function($http) {
    return {
        getAllProducts: function() {
            return $http.get('/products');
        },
        getSession: function() {
            return $http.get('/products/get-shopping-cart');
        },
        addToCart: function(id) {
            return $http.post('/products/add-to-cart/' + id);
        },
        getCartFromMongoStore: function(id) {
            return $http.get('/products/getSession/' + id);
        },
        getOrders: function() {
            return $http.get('/users/orders');
        }
    }
}]);

app.factory('signupService', ['$http', function($http) {
    return {
        signUp: function(email, password) {
            var body = {
                email: email,
                password: password
            }
            return $http.post('/users/signup', body);
        },
        getCrsfToken: function() {
            return $http.get('users/signup');
        }
    }
}]);

app.factory('signinService', ['$http', function($http) {
    return {
        signIn: function(email, password) {
            var body = {
                email: email,
                password: password
            }
            return $http.post('/users/signin', body);
        },
        getProfile: function() {
            return $http.get('/users/profile');
        },
        getSignStatus: function() {
            return $http.get('/users/signstatus');
        },
        logOut: function() {
            return $http.get('/users/logout')
        }
    }
}]);

app.factory('checkoutService', ['$http', function($http) {
    return {
        saveOrder: function(name, address) {
            var body = {
                name: name,
                address: address
            }
            return $http.post('/products/checkout', body);
        }
    }
}]);
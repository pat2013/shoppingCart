"use strict";
app.controller("proCtrl", ["$scope", "productService", "signinService", "$q", '$sessionStorage', function($scope, productService, signinService, $q, $sessionStorage) {
    console.log("product page");
    $scope.products = [];
    $scope.signIn = false;
    // $scope.totalQty = $sessionStorage.getObject("cart") !== null ? $sessionStorage.getObject("cart").totalQty : 0;
    // $scope.cart = $sessionStorage.getObject("cart") !== null ? $sessionStorage.getObject("cart") : {};
    $scope.totalQty = 0;
    $scope.cart = {};
    $q.all([
        signinService.getSignStatus(),
        productService.getAllProducts(),
        productService.getSession() // <--- Try something less than 0
    ]).then(function(value) {
        // Success callback where value is an array containing the success values
        console.log('from server', value[0].data);
        console.log('from server', value[1].data);
        //get cart from session
        // console.log(value[2].data);
        $scope.cart = value[2].data;
        if (value[0].data) {
            $scope.signIn = value[0].data.sign;
            // $sessionStorage.put("isLoggin", value[0].data.sign);
            // console.log('from sessionStage', $sessionStorage.get("isLoggin"));
        }
        if (value[1].data) {
            $scope.products = value[1].data;
            // $sessionStorage.putObject("products", value[1].data);
            // console.log('from sessionStage', $sessionStorage.getObject("products"));
        }
        if (value[2].data !== {}) {
            $scope.totalQty = value[2].data.totalQty;
            $sessionStorage.putObject("cart", value[2].data);
        }
    }, function(reason) {
        // Error callback where reason is the value of the first rejected promise

    });
    // signinService.getSignStatus().success(function(res) {
    //     console.log("products", res);
    //     if (res.sign) $scope.signIn = res.sign;
    // }).error(function(err) {
    //     console.log("proerr", err);
    // });
    // productService.getAllProducts().success(function(res) {
    //     console.log(res);
    //     $scope.products = res;
    // });
    // productService.getSession().success(function(res) {
    //     console.log(res);
    //     if (res !== {})
    //         $scope.totalQty = res.totalQty;
    // });
    $scope.addToCart = function(id) {
        productService.addToCart(id).success(function(res) {
            console.log('from server', res);
            if (res) {
                $sessionStorage.putObject("cart", res.cart);
                console.log('from sessionStroge', $sessionStorage.getObject("cart"));
                $sessionStorage.put("session_id", res.session_id);
                console.log('from sessionStroge', $sessionStorage.get("session_id"));
                $scope.totalQty = res.cart.totalQty;
            }

        });
    }

}])

app.controller("signupCtrl", ["$scope", "signupService", "$location", '$cookies', function($scope, signupService, $location, $cookies) {
    $scope.email = "";
    $scope.password = "";
    $scope.error = "";
    $scope.cookies = $cookies.get('XSRF-TOKEN');
    console.log('XSRF-TOKEN', $scope.cookies);
    console.log("user signup");
    $scope.submit = function() {
        console.log($scope.email, $scope.password);
        signupService.signUp($scope.email, $scope.password).success(function(res) {
            console.log("signup", res); // 
            if (res.message === "email already in use") $scope.error = res.message;
            else $location.path('/signin');
        }).error(function(err) {
            console.log("err", err);
        });
    };
}])

app.controller("signinCtrl", ["$scope", "signinService", "$location", function($scope, signinService, $location) {
    $scope.email = "";
    $scope.password = "";
    $scope.signIn = false;
    $scope.error = "";
    console.log("user signin");
    $scope.submit = function() {
        console.log($scope.email, $scope.password);
        signinService.signIn($scope.email, $scope.password).success(function(res) {
            console.log("signin", res);
            if (res.sign) $scope.signIn = res.sign;
            else $scope.signIn = res;
            if ($scope.signIn === true) $location.path('/profile');
        }).error(function(err) {
            console.log("err", err);
            if (err === "Unauthorized")
                $scope.error = "email and password no match";
        });
    };
}]);

app.controller("profileCtrl", ["$scope", "signinService", function($scope, signinService) {
    console.log("profile page");
    $scope.profile = {};
    $scope.hide = true;
    $scope.signIn = false;
    signinService.getSignStatus().then(function(data) {
        console.log("profile", data);
        return data;
    }).then(function(data) {
        if (data.data.sign) $scope.signIn = data.data.sign;
        if ($scope.signIn === true)
            signinService.getProfile().success(function(res) {
                console.log(res);
                $scope.profile = res;
            })

    });
}])

app.controller('logoutCtrl', ["$scope", "signinService", "$location", '$cookies', '$sessionStorage', function($scope, signinService, $location, $cookies, $sessionStorage) {
    console.log("logout");
    $scope.message = "";
    signinService.logOut().success(function(res) {
        console.log(res);
        if (res) {
            $scope.message = res.message;
            if ($scope.message === "logout successful") {
                //$cookies.remove(connect.sid);
                $sessionStorage.remove('cart');
                $location.path('/products');
            }
        }

    })
}])

app.controller('checkoutCtrl', ["$scope", "productService", 'checkoutService', "$location", '$cookies', '$sessionStorage', function($scope, productService, checkoutService, $location, $cookies, $sessionStorage) {
    $scope.totalPrice = 0;
    $scope.name = "";
    $scope.address = "";
    var promise = productService.getSession();
    promise.then(function(data) {
        console.log(data);
        $scope.totalPrice = data.data.totalPrice;
    })
    $scope.checkOut = function() {
        console.log("checkout now");
        console.log($scope.name, $scope.address);
        checkoutService.saveOrder($scope.name, $scope.address).success(function(res) {
            console.log(res);
            $sessionStorage.remove('cart');
            $location.path('/products');
        })
    }
}])

app.controller('orderCtrl', ["$scope", "productService", "signinService", function($scope, productService, signinService) {
    $scope.orders = [];
    $scope.signIn = false;
    var promise1 = signinService.getSignStatus();
    promise1.then(function(data) {
        console.log(data.data);
        $scope.signIn = data.data.sign;
    })
    var promise = productService.getOrders();
    promise.then(function(orders) {
        console.log(orders);
        $scope.orders = orders;
    })
}])
var Prod = require('../models/product');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin@ds127801.mlab.com:27801/mongoose-thumbnail-example');
var p = [
    new Prod({
        image: "http://mcfamily.vn/wp-content/uploads/2016/08/hungergame.jpg",
        dis: "great game",
        title: "hanger game",
        price: 12
    }), new Prod({
        image: "http://cdn.addictinggames.com/newGames/game-links/must-a-mine-dupe-links/must-a-mine-dupe-links.png?c=39",
        dis: "better game",
        title: "ad game",
        price: 10
    }),
    new Prod({
        image: "http://globe-views.com/dcim/dreams/game/game-01.jpg",
        dis: "better1 game",
        title: "ad game",
        price: 30
    }),
    new Prod({
        image: "https://o.aolcdn.com/images/dims?resize=600%2C400%2Cforce&image_uri=https%3A%2F%2Fs.aolcdn.com%2Fhss%2Fstorage%2Fgames%2F77a988c263df7d2e5ff9119da50eae3c&client=cbc79c14efcebee57402&signature=6ff891faa3db5fbdaf50562e9a509dda1ac66593",
        dis: "better2 game",
        title: "ad game",
        price: 15
    }),
    new Prod({
        image: "https://media.playstation.com/is/image/SCEA/call-of-duty-infinite-warfare-listing-thumb-01-ps4-us-08jun16?$GameTile_Large$",
        dis: "better3 game",
        title: "ad2 game",
        price: 20
    }),
    new Prod({
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe3WU19XaNm0-wXjkqJtx6yzpZhxbM53fyYCrAWMzUMMOrT6D2",
        dis: "better3 game",
        title: "ad1 game",
        price: 25
    })
];

var done = 0;
for (var i of p) {
    i.save(function(err, result) {
        done++;
        if (done === p.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
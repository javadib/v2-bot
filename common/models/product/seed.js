"use strict";

module.exports = function(Product) {
  var seedData = {
    data: [
    ]
  };

  Product.seed = function () {
    seedData.data.forEach(item => {
      Product.create(item).then(p => `Product ${p.Name} created`, err => console.log(err))
    })
  };

};
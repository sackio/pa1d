/*
 * pa1d
 * https://github.com/sackio/pa1d
 *
 * Copyright (c) 2014 Ben Sack
 * Licensed under the MIT license.
 */

'use strict';


var Belt = require('jsbelt')
  , _ = require('underscore')
;

module.exports = function(O){

  var M = {};
  M.settings = Belt.extend({
    'provider': 'braintree'
  }, O);

  M._provider = new require('./providers/' + M.settings.provider + '.js')(O);

  //RESTful methods around a provider's API
  _.each(['create', 'get', 'find', 'update', 'delete'], function(m){

    //CUSTOMER
    M[m + '_customer'] = M._provider[m + '_customer'];

    //PAYMENT METHOD
    M[m + '_payment_method'] = M._provider[m + '_payment_method'];

    //SALE
    M[m + '_sale'] = M._provider[m + '_sale'];

    //PAYMENT
    M[m + '_payment'] = M._provider[m + '_payment'];

    //SUBSCRIPTION
    M[m + '_subscription'] = M._provider[m + '_subscription'];

    return;
  });

  return M;

};



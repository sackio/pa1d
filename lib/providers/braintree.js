/*
  Braintree API - http://apidocs.mailchimp.com/api/2
*/

var Belt = require('jsbelt')
  , Async = require('async')
  , Braintree = require('braintree')
  , _ = require('underscore')
  ;

(function(){
  var Braintree = function(O){
    var B = {};

    //SETTINGS

    B.settings = Belt.extend({

    }, O, O.braintree);

    B._gateway = Braintree.connect(B.settings);

    B._api_objects = {
      'customers': ['firstName', 'lastName', 'company', 'email', 'phone'
                  , 'website', 'fax', 'addresses', 'creditCards', 'paypalAccounts'
                  , 'customFields', 'createdAt', 'updatedAt', 'paymentMethodNonce']
    , 'addresses': ['company', 'countryCodeAlpha2', 'countryCodeAlpha3'
                   , 'countryCodeNumeric', 'countryName', 'customerId'
                   , 'extendedAddress', 'firstName', 'lastName', 'locality'
                   , 'postalCode', 'region', 'streetAddress', 'createdAt', 'updatedAt']
    , 'creditCards': ['token', 'bin', 'cardType', 'cardholderName', 'customerId'
                     , 'expirationMonth', 'expirationYear', 'expirationDate'
                     , 'last4', 'maskedNumber', 'uniqueNumberIdentifier'
                     , 'countryOfIssuance', 'issuingBank', 'imageUrl', 'default'
                     , 'prepaid', 'payroll', 'commercial', 'durbinRegulated'
                     , 'healthcare', 'debit', 'countryOfIssuance', 'issuingBank'
                     , 'createdAt', 'updatedAt', 'subscriptions', 'billingAddress', 'paymentMethodNonce']
    , 'paypalAccounts': ['token', 'email', 'imageUrl', 'default', 'subscriptions', 'paymentMethodNonce']
    , 'transactions': ['id', 'customerDetails', 'creditCardDetails', 'amount'
                      , 'channel', 'createdAt', 'currencyIsoCode', 'customFields'
                      , 'cvvResponseCode', 'gatewayRejectionReason', 'merchantAccountId'
                      , 'orderId', 'billingDetails', 'disbursementDetails', 'escrowStatus'
                      , 'shippingDetails', 'processorAuthorizationCode'
                      , 'processorResponseCode', 'refundIds', 'refundedTransactionId'
                      , 'status', 'statusHistory', 'serviceFeeAmount'
                      , 'subscriptionId', 'subscriptionDetails', 'addOns'
                      , 'discounts', 'type', 'updatedAt', 'vaultBillingAddress'
                      , 'vaultCreditCard', 'vaultCustomer', 'vaultShippingAddress'
                      , 'avsErrorResponseCode', 'avsPostalCodeResponseCode'
                      , 'avsStreetAddressResponseCode', 'paymentMethodNonce', 'dispute']
    , 'subscriptions': ['id', 'balance', 'billingDayOfMonth', 'billingPeriodEndDate'
                       , 'billingPeriodStartDate', 'failureCount', 'firstBillingDate'
                       , 'merchantAccountId', 'nextBillingDate', 'numberOfBillingCycles'
                       , 'nextBillingPeriodAmount', 'paidThroughDate', 'paymentMethodToken'
                       , 'planId', 'price', 'status', 'trialDuration', 'trialDurationUnit'
                       , 'trialPeriod', 'neverExpires', 'addOns', 'discounts', 'transactions', 'paymentMethodNonce']
    };

    //UTILITIES
    var obj_pick = function(name, obj){
      if (_.isArray(obj)){
        return _.map(obj, function(o){ return _.pick(o. B._api_objects.name); });
      } else if (!obj){
        return obj;
      } else {
        return _.pick(obj, B._api_objects.name);
      }
    };

    var cw = function(pStr, cb){
      return function(err, res){
        if (err) return cb(err);
        if (!Belt._get(res, 'success')) return cb(new Error(Belt._get(res, 'message') || 'An unknown error occur'));

        return cb(null, Belt._get(res, pStr));
      };
    };

    //return function with searching criteria
    var searchCrit = function(obj, name){
      if (!obj) return Belt.noop;

      var s = _.pick(obj, B._api_objects[name]);

      return function(search){
        _.each(s, function(v, k){
          if (_.isObject(v)) return search[k].call(search)[v.op](v.val, v.val2);

          return search[k].call(search).is(v);
        });
      };
    };

    //CUSTOMERS

    /*
      Create customer
    */
    B['create_customer'] = function(options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      var req = _.pick(a.o, B._api_objects.customers);
      req.addresses = obj_pick('addresses', req.addresses);
      req.creditCards = obj_pick('creditCards', req.creditCards);
      req.paypalAccounts = obj_pick('paypalAccounts', req.paypalAccounts);

      return B._gateway.customer.create(req, B.cw('customer', a.cb));
    };

    /*
      Get customer
    */
    B['get_customer'] = function(identifier, options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      return B._gateway.customer.find(identifier, B.cw('customer', a.cb));
    };

    /*
      Find customer
    */
    B['find_customer'] = function(options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      return B._gateway.customer.search(searchCrit(a.o, 'customers')
                                     , B.cw('customer', a.cb));
    };

    /*
      Update customer
    */
    B['update_customer'] = function(identifier, options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      var req = _.pick(a.o, B._api_objects.customers);
      req.addresses = obj_pick('addresses', req.addresses);
      req.creditCards = obj_pick('creditCards', req.creditCards);
      req.paypalAccounts = obj_pick('paypalAccounts', req.paypalAccounts);

      return B._gateway.customer.update(identifier, req, B.cw('customer', a.cb));
    };

    /*
      Delete customer
    */
    B['delete_customer'] = function(identifier, options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      return B._gateway.customer.delete(identifier, B.cw('customer', a.cb));
    };

    //PAYMENT METHODS

    /*
      Create payment method
    */
    B['create_payment_method'] = function(options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      var req = _.pick(a.o, B._api_objects.creditCards);
      req.billingAddress = obj_pick('addresses', req.billingAddress);
      req.subscriptions = obj_pick('subscriptions', req.subscriptions);

      return B._gateway.paymentMethod.create(req, B.cw('paymentMethod', a.cb));
    };

    /*
      Get payment method
    */
    B['get_payment_method'] = function(identifier, options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      return B._gateway.paymentMethod.find(identifier, B.cw('paymentMethod', a.cb));
    };

    /*
      Find payment method
    */
    B['find_payment_method'] = function(options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      return B._gateway.paymentMethod.search(searchCrit(a.o, 'creditCards')
                                     , B.cw('paymentMethod', a.cb));
    };

    /*
      Update payment method
    */
    B['update_payment_method'] = function(identifier, options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      var req = _.pick(a.o, B._api_objects.creditCards);
      req.billingAddress = obj_pick('addresses', req.billingAddress);
      req.subscriptions = obj_pick('subscriptions', req.subscriptions);

      return B._gateway.paymentMethod.update(identifier, req, B.cw('paymentMethod', a.cb));
    };

    /*
      Delete payment method
    */
    B['delete_payment_method'] = function(identifier, options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      return B._gateway.paymentMethod.delete(identifier, B.cw('paymentMethod', a.cb));
    };

    //SALES METHODS

    /*
      Create sale
    */
    B['create_sale'] = function(options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      var req = _.pick(a.o, B._api_objects.transactions);

      return B._gateway.transaction.sale(req, B.cw('transaction', a.cb));
    };

    /*
      Get sale
    */
    B['get_sale'] = function(identifier, options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      return B._gateway.transaction.find(identifier, B.cw('transaction', a.cb));
    };

    /*
      Find sale
    */
    B['find_sale'] = function(options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      return B._gateway.transaction.search(searchCrit(a.o, 'transactions')
                                     , B.cw('transaction', a.cb));
    };

    /*
      Update sale - N/A
    */
    
    /*
      Delete sale  - refund or void - options.amount will result in partial refund
    */
    B['delete_sale'] = function(identifier, options, callback){
      var a = Belt.argulint(arguments)
        , globals = {};

      a.o = _.defaults(a.o, {

      });

      return Async.waterfall([
        function(cb){
          if (a.o.skip_void) return cb();

          return B._gateway.transaction.void(identifier
          , B.cw('transaction', Belt.cs(cb, globals, 'err', 0)));
        }
      , function(cb){
          if (!a.o.skip_void && !globals.err) return cb();
          if (a.o.skip_refund) return cb(new Error('Sale could not be voided or refunded'));

          if (a.o.amount) return B._gateway.transaction.refund(identifier
          , a.o.amount, B.cw('transaction', cb));
        }
      ], a.cb);
    };

    //SUBSCRIPTIONS

    /*
      Create subscription
    */
    B['create_subscription'] = function(options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      var req = _.pick(a.o, B._api_objects.subscriptions);

      return B._gateway.subscription.create(req, B.cw('subscription', a.cb));
    };

    /*
      Get subscription
    */
    B['get_subscription'] = function(identifier, options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      return B._gateway.subscription.find(identifier, B.cw('subscription', a.cb));
    };

    /*
      Find subscription
    */
    B['find_subscription'] = function(options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      return B._gateway.subscription.search(searchCrit(a.o, 'subscriptions')
                                     , B.cw('subscription', a.cb));
    };

    /*
      Update subscription
    */
    B['update_subscription'] = function(identifier, options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      var req = _.pick(a.o, B._api_objects.subscriptions);

      return B._gateway.subscription.update(identifier, req, B.cw('subscription', a.cb));
    };

    /*
      Delete subscription
    */
    B['delete_subscription'] = function(identifier, options, callback){
      var a = Belt.argulint(arguments);

      a.o = _.defaults(a.o, {

      });

      return B._gateway.subscription.cancel(identifier, B.cw('subscription', a.cb));
    };

    return B;
  };

  return module.exports = Braintree;

}).call(this);


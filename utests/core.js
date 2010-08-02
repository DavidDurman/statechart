(function(exports, undefined){
"use strict";

/**
 * Copies all the properties to the first argument from the following arguments.
 * All the properties will be overwritten by the properties from the following
 * arguments. Inherited properties are ignored.
 * @private
 */
var Mixin = exports.Mixin = function() {
    var target = arguments[0];
    for (var i = 1, l = arguments.length; i < l; i++){
        var extension = arguments[i];
        for (var key in extension){
            if (!extension.hasOwnProperty(key)){
		continue;
	    }
            var copy = extension[key];
            if (copy === target[key]){
		continue;
	    }
            // copying super with the name base if it does'nt has one already
            if (typeof copy == "function" && typeof target[key] == "function" && !copy.base){
		copy.base = target[key];
	    }
            target[key] = copy;
        }
    }
    return target;
};

/**
 * Copies all properties to the first argument from the following
 * arguments only in case if they don't exists in the first argument.
 * All the function propererties in the first argument will get
 * additional property base pointing to the extenders same named
 * property function's call method.
 * @example
 * // usage of base
 * Bar.extend({
 * // function should have name
 * foo: function foo(digit) {
 * return foo.base(this, parseInt(digit))
 * }
 * });
 * @private
 */
var Supplement = exports.Supplement = function() {
    var target = arguments[0];
    for (var i = 1, l = arguments.length; i < l; i++){
        var extension = arguments[i];
        for (var key in extension) {
            var copy = extension[key];
            if (copy === target[key]){
		continue;
	    }
            // copying super with the name base if it does'nt has one already
            if (typeof copy == "function" && typeof target[key] == "function" && !target[key].base){
		target[key].base = copy;
	    }
            // target doesn't has propery that is owned by extension copying it
            if (!target.hasOwnProperty(key) && extension.hasOwnProperty(key)){
		target[key] = copy;
	    }
        }
    }
    return target;
};

var ProtoObject = exports.ProtoObject = function(){};
ProtoObject.prototype = {
    construct: function(properties){}
};

ProtoObject.create = function(properties){
    var instance = new this(properties);
    if (instance.init) instance.init(properties);
    return instance;
};

ProtoObject.extend = function(prototype){
    var C = prototype.constructor = function(properties){
	this.construct(properties);
    };
    C.base = this;
    var proto = C.prototype = new this();
    Mixin(proto, prototype);
    Supplement(C, this);
    return C;
};

})(typeof exports !== "undefined" ? exports : core = {});

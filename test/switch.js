/**
 * Run: node switch.js  (in node)
 *      run.html?unit=switch (in browser)
 */

(function(exports, undefined){
    'use strict'

    try {
         core = require('./core');
         Statechart = require('../lib/statechart');
    } catch (e) {}

    var LightSwitch = core.Mixin({
        initialState: "Out",
        states: {
            "Out": {
                "on":  { target: "On"   },
                "out": { target: "Out"  }
            },
            "On": {
                "on":  { target: "On"  },
                "out": { target: "Out" }
            }
        }
    }, Statechart.Statechart);


    LightSwitch.run();

    LightSwitch.dispatch("out");
    LightSwitch.dispatch("on");
    LightSwitch.dispatch("on");
    LightSwitch.dispatch("out");


})(typeof exports !== "undefined" ? exports : test = {});


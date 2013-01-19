try {
    
    _ = require('underscore');
    Statechart = require('../lib/statechart');
    expect = require('expect.js');
    
} catch (e) {}


var LightSwitch = _.extend({
    
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
    
}, Statechart);


// Run the machine in debug mode and collect all messages describing state transitions.
var switchStatesOrder = [];

LightSwitch.run({ debug: function(msg) {

    switchStatesOrder.push(msg);
    
} });

LightSwitch.dispatch("out");
LightSwitch.dispatch("on");
LightSwitch.dispatch("on");
LightSwitch.dispatch("out");

describe('LightSwitch test machine', function() {

    it('should transit states in the defined order', function() {

        expect(switchStatesOrder).to.eql([

            '[Out] enter',
            '[Out] init',
            '[Out] exit',
            '[Out] enter',
            '[Out] init',
            '[Out] exit',
            '[On] enter',
            '[On] init',
            '[On] exit',
            '[On] enter',
            '[On] init',
            '[On] exit',
            '[Out] enter',
            '[Out] init'
            
        ]);
    });
    
});

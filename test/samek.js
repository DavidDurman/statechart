try {
    
    _ = require('underscore');
    Statechart = require('../lib/statechart');
    expect = require('expect.js');
    
} catch (e) {}


var machine = _.extend({
    
    // slots
    myFoo: false,
    
    // machine
    initialState: "S0",
    
    states: {
        S0: {
            init: "S1",
            "E": { target: "S211" },
            states: {
                S1: {
                    init: "S11",
                    "A": { target: "S1"   },
                    "B": { target: "S11"  },
                    "C": { target: "S2"   },
                    "D": { target: "S0"   },
                    "F": { target: "S211" },
                    states: {
                        S11: {
                            "G": { target: "S211" },
                            "H": {
                                guard: function() { return this.myFoo; },
                                action: function() { this.myFoo = false; }
                            }
                        }
                    }
                },
                S2: {
                    init: "S21",
                    "C": { target: "S1"  },
                    "F": { target: "S11" },
                    states: {
                        S21: {
                            init: "S211",
                            "B": { target: "S211" },
                            "H": {
                                guard: function() { return !this.myFoo; },
                                action: function() { this.myFoo = true; },
                                target: "S21"
                            },
                            states: {
                                S211: {
                                    "D": { target: "S21" },
                                    "G": { target: "S0"  }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
}, Statechart);


// Run the machine in debug mode and collect all messages describing state transitions.
var samekStatesOrder = [];

machine.run({ debug: function(msg) {

    samekStatesOrder.push(msg);
    
} });

machine.dispatch("G");
machine.dispatch("G");
machine.dispatch("E");
machine.dispatch("G");
machine.dispatch("E");
machine.dispatch("G");
machine.dispatch("F");
machine.dispatch("D");
machine.dispatch("C");


describe('Samek test machine', function() {

    it('should transit states in the defined order', function() {

        expect(samekStatesOrder).to.eql([

            '[S0] enter',
            '[S0] init',
            '[S1] enter',
            '[S1] init',
            '[S11] enter',
            '[S11] init',
	    // G
            '[S11] exit',
            '[S1] exit',
            '[S2] enter',
            '[S21] enter',
            '[S211] enter',
            '[S211] init',

	    // G
            '[S211] exit',
            '[S21] exit',
            '[S2] exit',
            '[S0] init',
            '[S1] enter',
            '[S1] init',
            '[S11] enter',
            '[S11] init',

	    // E
            '[S11] exit',
            '[S1] exit',
            '[S2] enter',
            '[S21] enter',
            '[S211] enter',
            '[S211] init',
	    // G
            '[S211] exit',
            '[S21] exit',
            '[S2] exit',
            '[S0] init',
            '[S1] enter',
            '[S1] init',
            '[S11] enter',
            '[S11] init',

	    // E
            '[S11] exit',
            '[S1] exit',
            '[S2] enter',
            '[S21] enter',
            '[S211] enter',
            '[S211] init',
	    // G
            '[S211] exit',
            '[S21] exit',
            '[S2] exit',
            '[S0] init',
            '[S1] enter',
            '[S1] init',
            '[S11] enter',
            '[S11] init',
	    // F
            '[S11] exit',
            '[S1] exit',
            '[S2] enter',
            '[S21] enter',
            '[S211] enter',
            '[S211] init',
	    // D
            '[S211] exit',
            '[S21] init',
            '[S211] enter',
            '[S211] init',
	    // C
            '[S211] exit',
            '[S21] exit',
            '[S2] exit',
            '[S1] enter',
            '[S1] init',
            '[S11] enter',
            '[S11] init'

            
        ]);
        
    });
    
});

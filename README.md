Statechart implementation in JavaScript.
========================================

[![Build Status](https://travis-ci.org/DavidDurman/statechart.png?branch=master)](http://travis-ci.org/DavidDurman/statechart)

Features
--------

 * Hierarchical states
 * Can be mixined with an arbitrary object
 * JSON-like description of the machine
 * Fast
 * Lightweight (4.6KB minified using jsmin)
 * JavaScript engine independent (browsers, nodejs, narwhal, ...)

Related work
------------

This hierarchical state machine implementation has been inspired
by the QP active object framework, see http://www.state-machine.com/.

Defining a basic state machine
-------------------------------

State machine is defined as an object with `initialState` and `states` properties. The former defines
the first state we want our machine to enter. The latter is an object with states, events and actions:

[![Light switch statechart](http://figurepool.com/figure/view/7774b3b7f5ceba1d47fac95f540f82ec.png)](http://figurepool.com/figure/view/Light_switch_statechart-7774b3b7f5ceba1d47fac95f540f82ec.html)

    var lightSwitch = _.extend({
        
        initialState: "Out",
        states: {
            'Out': {
                'on':  { target: 'On'   },
                'out': { target: 'Out'  }
            },
            'On': {
                'on':  { target: 'On'  },
                'out': { target: 'Out' }
            }
        }
        
    }, Statechart);

    
    // Initialize the state machine and make the initial transition (to the `Out` state).
    lightSwitch.run();

    // Dispatch the `on` event to the machine which causes it to transit to the `On` state.
    lightSwitch.dispatch('on');


Reserved events
---------------

The state machine dispatched three reserved events: `init`, `entry` and `exit`. These are special
events that you might react on when an initial transition to a state takes place, when a state is entered or exited.

Assume we use the same machine as defined in the above example and run it like this:

    lightSwtich.run();
    lightSwitch.dispatch('out');
    lightSwitch.dispatch('on');

The resulting order of transitions would then be:

* [Out] entry
* [Out] init
* ... now the `out` event was dispatched
* [Out] exit
* [Out] entry
* [Out] init
* ... now the `on` event was dispatched
* [Out] exit
* [On] entry
* [On] init


Custom events
-------------

Custom events are named events that we dispatch to the machine (like the `on` and `out` events in the above example).
As a reaction on these events, we might want to either transit to another state, execute an action while doing that or
guard the transition if there is a certain condition that must be met in order for the transition to take place.

    'MyState': {
        'myEvent': {
            guard: function() { return this.mySlot === true; },
            action: function() { console.log('Hooray, transition takes place.'),
            target: 'AnotherState'
        }
    },
    'AnotherState': {
    }


Hierarchical states
-------------------

States can be nested to an arbitrary level. State nesting leads to **behavioral inheritance** [Samek+ 00, 02].
This allows new states to be specified **by difference** rather then created from scratch each time.

[![Hierarchical states](http://figurepool.com/figure/view/7774b3b7f5ceba1d47fac95f540f86e1.png)](http://figurepool.com/figure/view/Hierarchical_states-7774b3b7f5ceba1d47fac95f540f86e1.html)

State nesting can simply be done by nesting objects.

    'MyState': {
        'init': 'MyChildState',
        'eventA': { ... },
        'MyChildState': {
            'entry': function() { console.log('MyChildState being entered.'); },
            'eventB': { ... }
        }
    }


See https://github.com/DavidDurman/statechart/blob/master/test/samek.js for a complete example of a non-trivial
state machine.


Copyright and license
---------------------

Copyright (c) 2010 David Durman

Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at 
http://opensource.org/licenses/MIT.

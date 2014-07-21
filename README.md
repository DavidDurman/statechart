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

States can have the following attributes:
* `states` (object) an associative array of states to whom this state is the parent state or "superstate".
* any other attributes of the object are assumed to be events with the object key being the event's name. Events are detailed below.

[![Light switch statechart](http://oi61.tinypic.com/24m6qo9.jpg)](http://oi61.tinypic.com/24m6qo9.jpg)

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

An event is a stimulus upon which you might want to react. An event can have the following attributes:

* optional `target` (string, state name) which indicates this event should trigger a transition to another state.
* optional `action` (function or array of events) which indicates which action should be taken when this event is triggered and its guard has returned true.
* optional `guard` (function, takes the second argument to `fsm.dispatch()`, return true or false) which provides the condition that determines whether the state machine should transition to the `target` state.

The state machine dispatches three reserved events: `init`, `entry` and `exit`. These are special
events that you might react on when an initial transition to a state takes place, when a state is entered or exited.
They default to empty for every state and run on every transition whether defined in that particular state or not.

Assume we use the same machine as defined in the above example and run it like this:

    lightSwtich.run();
    lightSwitch.dispatch('out');
    lightSwitch.dispatch('on');

The resulting order of transitions would then be:

* [Out] entry
* [Out] init

State machine is in the `Out` state and is stable, waiting for input. Something external to the state machine, like your computer program, dispatches the `out` event.

* [Out] exit
* [Out] entry
* [Out] init

State machine is in the `On` state. The `on` event is dispatched

* [Out] exit
* [On] entry
* [On] init

### init

The `init` event can be set in only one way.

* &lt;string> stateName - execution of the `init` event will cause immediate transition to this state.

If you would like to transition immediately upon initializing a state, set it's `init` attribute to the name of the
state to which the state machine should transition.  Note: setting the `init` attribute to the name of an event
that you would like to dispatch is NOT valid and will cause errors to be thrown.

    myState: {
        init: "someOtherState"
    }

### entry

The `entry` event can be set in the following ways:

* &lt;object> eventObject - with `guard` and/or `action` only. It's not possible to transition on `entry`.
* &lt;Array &lt;object>> eventArray - array of event objects, again, without `target`.
* &lt;Function> action - function to be run directly as an action.

### exit

The `exit` event can be set in the following ways:

* &lt;object> eventObject - with `target`, `guard`, and/or `action`.
* &lt;Array &lt;object>> eventArray - array of event objects.
* &lt;Function> action - function to be run directly as an action.

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

Custom events can be defined in the following ways:

* &lt;object> eventObject - with `target`, `guard`, and/or `action`.
* &lt;Array &lt;object>> eventArray - array of event objects.
* &lt;Function> action - function to be run directly as an action.

Event Actions
-------------

If the event is specified as an array of events, each event's `guard` will be used to determine if that event should be triggered.  All events in the array whose `guard` returns true will be triggered.

Transitioning from any state to itself will cause the `exit`, `init`, and `enter` events to be triggered again.

If an event is triggered from a state to which it does not belong, it will not be handled. It will be ignored.


Hierarchical states
-------------------

States can be nested to an arbitrary level. State nesting leads to **behavioral inheritance** [Samek+ 00, 02].
This allows new states to be specified **by difference** rather then created from scratch each time.

[![Hierarchical states](http://oi58.tinypic.com/2mi0nz9.jpg)](http://oi58.tinypic.com/2mi0nz9.jpg)

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


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/DavidDurman/statechart/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


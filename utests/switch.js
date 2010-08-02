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

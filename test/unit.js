try {
    _ = require('underscore');
    Statechart = require('../lib/statechart');
    expect = require('expect.js');
} catch (e) {}

function Spy() {
    function spy() {
        this.called = true;
    }
    spy.called = false;
    return spy;
}

describe("a state", function() {
    var fsm;
    var params;

    beforeEach(function () {
        params = {
            initialState: "A",
            states: {
                A: {
                    entry: Spy(),
                    exit: Spy(),
                    goA: { target: "A" },
                    goB: { target: "B" },
                    goC: { target: "C" }
                },
                C: {
                    goA: { target: "A" },
                }
            }
        };

        fsm = _.extend(params, Statechart);
        fsm.run();
    });

    describe("when it exists", function() {
        it("can be reached", function () {
            expect(fsm.currentState().name).to.equal('A');
        });

        it("runs the 'entry' event", function () {
            expect(fsm.states.A.entry.called).to.be.true;
        });

        describe("when transitioning to another state", function () {
            var exitSpy1, entrySpy1;

            beforeEach(function () {
                exitSpy1 = Spy();
                entrySpy1 = Spy();
                params.states.A.exit = exitSpy1;
                params.states.C.entry = exitSpy1;
                fsm.dispatch('goC');
            });

            it("moves to the right state", function () {
                expect(fsm.currentState().name).to.equal('C');
            });

            it("it fires the last state's exit event", function () {
                expect(exitSpy1.called).to.be.true;
            });

            it("it fires the current state's entry event", function () {
                expect(entrySpy1.called).to.be.true;
            });

            describe("when transitioning back", function () {
                var exitSpy2, entrySpy2;

                beforeEach(function () {
                    exitSpy2 = Spy();
                    entrySpy2 = Spy();
                    params.states.C.exit = exitSpy2;
                    params.states.A.entry = exitSpy2;
                    fsm.dispatch('goA');
                });

                it("moves to the right state", function () {
                    expect(fsm.currentState().name).to.equal('A');
                });

                it("it fires the last state's exit event", function () {
                    expect(exitSpy2.called).to.be.true;
                });

                it("it fires the current state's entry event", function () {
                    expect(entrySpy2.called).to.be.true;
                });

                describe("when transitioning to the other state again", function () {
                    var exitSpy3, entrySpy3;

                    beforeEach(function () {
                        exitSpy3 = Spy();
                        entrySpy3 = Spy();
                        params.states.A.exit = exitSpy3;
                        params.states.C.entry = exitSpy3;
                        fsm.dispatch('goC');
                    });

                    it("moves to the right state", function () {
                        expect(fsm.currentState().name).to.equal('C');
                    });

                    it("it fires the last state's exit event", function () {
                        expect(exitSpy3.called).to.be.true;
                    });

                    it("it fires the current state's entry event", function () {
                        expect(entrySpy3.called).to.be.true;
                    });

                    describe("when transitioning back", function () {
                        var exitSpy4, entrySpy4;

                        beforeEach(function () {
                            exitSpy4 = Spy();
                            entrySpy4 = Spy();
                            params.states.C.exit = exitSpy4;
                            params.states.A.entry = exitSpy4;
                            fsm.dispatch('goA');
                        });

                        it("moves to the right state", function () {
                            expect(fsm.currentState().name).to.equal('A');
                        });

                        it("it fires the last state's exit event", function () {
                            expect(exitSpy4.called).to.be.true;
                        });

                        it("it fires the current state's entry event", function () {
                            expect(entrySpy4.called).to.be.true;
                        });
                    });
                });
            });
        });
    });

    describe("when it does not exist", function() {
        var error, err;

        beforeEach(function () {
            try {
                fsm.dispatch('goB');
            } catch (err) {
                error = err;
            }
        });

        it("throws an error", function () {
            expect(error).not.to.be(undefined);
        });

        it("does not exit the previous state", function () {
            expect(fsm.states.A.exit.called).to.be.false;
        });
    });

    describe("when built-in event `init` when dispatched manually", function () {
        beforeEach(function () {
            fsm.dispatch('init');
        });

        it("reinitiates the state", function () {
            expect(fsm.states.A.exit.called).to.be.true;
            expect(fsm.states.A.entry.called).to.be.true;
            expect(fsm.currentState().name).to.equal('A');
        });
    });

    describe("when built-in event `entry` when dispatched manually", function () {
        beforeEach(function () {
            fsm.dispatch('entry');
        });

        it("reinitiates the state", function () {
            expect(fsm.states.A.exit.called).to.be.true;
            expect(fsm.states.A.entry.called).to.be.true;
            expect(fsm.currentState().name).to.equal('A');
        });
    });

    describe("when built-in event `exit` when dispatched manually", function () {
        beforeEach(function () {
            fsm.dispatch('exit');
        });

        it("reinitiates the state", function () {
            expect(fsm.states.A.exit.called).to.be.true;
            expect(fsm.states.A.entry.called).to.be.true;
            expect(fsm.currentState().name).to.equal('A');
        });
    });
});

describe("an fsm with nested states", function() {
    var fsm;
    var params;

    beforeEach(function () {
        params = {
            initialState: "A",
            states: {
                A: {
                    entry: Spy(),
                    exit: Spy(),
                    goA: { target: "A" },
                    goB: { target: "B" },
                    goC: { target: "C" },
                    goD: { target: "D" },
                    goE: { target: "E" },
                    states: {
                        D: {
                            entry: Spy(),
                            exit: Spy(),
                            goE2: { target: "E" },
                            goF: { target: "F" },
                            states: {
                                F: {
                                    entry: Spy(),
                                    exit: Spy(),
                                    goE3: { target: "E" }
                                }
                            }
                        },
                        E: {
                            entry: Spy(),
                            exit: Spy(),
                            goD2: { target: "D" }
                        }
                    }
                },
                C: {
                    goA: { target: "A" },
                }
            }
        };

        fsm = _.extend(params, Statechart);
        fsm.run();
    });

    describe("moving to a nested state from it's parent", function () {
        beforeEach(function () {
            fsm.dispatch("goD");
        });

        it("moves to the right state", function () {
            expect(fsm.currentState().name).to.equal("D");
        });

        it("does not fire the non-nested state's exit event", function () {
            expect(fsm.states.A.exit.called).not.to.be.true;
        });
    });

    describe("moving to a nested state from it's nested sibling", function () {
        beforeEach(function () {
            fsm.dispatch("goD");
            fsm.dispatch("goE2");
        });

        it("moves to the right state", function () {
            expect(fsm.currentState().name).to.equal("E");
        });

        it("does not fire the non-nested state's exit event", function () {
            expect(fsm.states.A.exit.called).not.to.be.true;
        });

        it("fires the first nested state's entry event", function () {
            expect(fsm.states.A.states.D.entry.called).to.be.true;
        });

        it("fires the first nested state's exit event", function () {
            expect(fsm.states.A.states.D.exit.called).to.be.true;
        });

        it("fires the second nested state's entry event", function () {
            expect(fsm.states.A.states.E.entry.called).to.be.true;
        });
    });

    describe("moving to a nested state from it's nested sibling's child", function () {
        beforeEach(function () {
            fsm.dispatch("goD");
            fsm.dispatch("goF");
            fsm.dispatch("goE3");
        });

        it("moves to the right state", function () {
            expect(fsm.currentState().name).to.equal("E");
        });

        it("does not fire the non-nested state's exit event", function () {
            expect(fsm.states.A.exit.called).not.to.be.true;
        });

        it("fires the first nested state's entry event", function () {
            expect(fsm.states.A.states.D.entry.called).to.be.true;
        });

        it("fires the first nested state's child's entry event", function () {
            expect(fsm.states.A.states.D.states.F.entry.called).to.be.true;
        });

        it("fires the first nested state's child's exit event", function () {
            expect(fsm.states.A.states.D.states.F.exit.called).to.be.true;
        });

        it("fires the first nested state's exit event", function () {
            expect(fsm.states.A.states.D.exit.called).to.be.true;
        });

        it("fires the second nested state's entry event", function () {
            expect(fsm.states.A.states.E.entry.called).to.be.true;
        });
    });
});

describe("the reserved event", function () {
    var fsm;
    var params = {
        initialState: "A",
        states: {
        }
    };

    describe("`init`", function () {
        describe("when defined as the string name of a state", function () {
            beforeEach(function () {
                params.states.A = {
                    init: 'B',
                    states: {
                        B: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                fsm.run();
            });

            it("transitions to that state", function () {
                expect(fsm.currentState().name).to.equal('B');
            });
        });

        describe("when defined as a proper event object", function () {
            var error, err;

            beforeEach(function () {
                params.states.A = {
                    init: {
                        target: 'B'
                    },
                    states: {
                        B: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                try {
                    fsm.run();
                } catch (err) {
                    error = err;
                }
            });

            it("throws an error", function () {
                expect(error).not.to.be(undefined);
            });

            it("does not transition away from the previous state", function () {
                expect(fsm.currentState().name).to.equal('A');
            });
        });

        describe("when defined as an array of events", function () {
            var error, err;

            beforeEach(function () {
                params.states.A = {
                    exit: Spy(),
                    init: [{
                        target: 'B',
                        guard: function () { return true; }
                    }, {
                        target: 'C',
                        guard: function () { return false; }
                    }],
                    states: {
                        B: {},
                        C: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                try {
                    fsm.run();
                } catch (err) {
                    error = err;
                }
            });

            it("throws an error", function () {
                expect(error).not.to.be(undefined);
            });

            it("does not transition away from the previous state", function () {
                expect(fsm.currentState().name).to.equal('A');
                expect(fsm.states.A.exit.called).to.be.false;
            });
        });

        describe("when defined as a function", function () {
            var error, err;

            beforeEach(function () {
                params.states.A = {
                    exit: Spy(),
                    init: function () {
                        // some action
                    },
                    states: {
                        B: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                try {
                    fsm.run();
                } catch (err) {
                    error = err;
                }
            });

            it("throws an error", function () {
                expect(error).not.to.be(undefined);
            });

            it("does not transition away from the previous state", function () {
                expect(fsm.currentState().name).to.equal('A');
                expect(fsm.states.A.exit.called).to.be.false;
            });
        });
    });


    describe("`entry`", function () {
        describe("when defined as the string name of a state", function () {
            beforeEach(function () {
                params.states.A = {
                    entry: 'B',
                    exit: Spy(),
                    states: {
                        B: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                fsm.run();
            });

            it("does not transition", function () {
                expect(fsm.currentState().name).to.equal('A');
                expect(fsm.states.A.exit.called).to.be.false;
            });
        });

        describe("when defined as a proper event object with a target", function () {
            var error, err;

            beforeEach(function () {
                params.states.A = {
                    entry: {
                        target: 'B'
                    },
                    states: {
                        B: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                try {
                    fsm.run();
                } catch (err) {
                    error = err;
                }
            });

            it("throws an error", function () {
                expect(error).not.to.be(undefined);
            });

            it("does not transition away from the previous state", function () {
                expect(fsm.currentState().name).to.equal('A');
            });
        });

        describe("when defined as a proper event object with no target", function () {
            var error, err;

            beforeEach(function () {
                params.states.A = {
                    entry: {
                        action: Spy()
                    },
                    states: {
                        B: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                try {
                    fsm.run();
                } catch (err) {
                    error = err;
                }
            });

            it("does not throw an error", function () {
                expect(error).to.be(undefined);
            });

            it("runs the action", function () {
                expect(fsm.states.A.entry.action.called).to.be.true;
            });
        });

        describe("when defined as an array of events without targets", function () {
            var error, err;

            beforeEach(function () {
                params.states.A = {
                    exit: Spy(),
                    entry: [{
                        guard: function () { return true; },
                        action: Spy()
                    }, {
                        guard: function () { return false; }
                    }],
                    states: {
                        B: {},
                        C: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                try {
                    fsm.run();
                } catch (err) {
                    error = err;
                }
            });

            it("does not throw an error", function () {
                expect(error).to.be(undefined);
            });

            it("does not transition away from the previous state", function () {
                expect(fsm.currentState().name).to.equal('A');
            });

            it("runs the action", function () {
                expect(fsm.states.A.entry[0].action.called).to.be.false;
            });
        });

        describe("when defined as a function", function () {
            var error, err;

            beforeEach(function () {
                params.states.A = {
                    exit: Spy(),
                    entry: Spy(),
                    states: {
                        B: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                try {
                    fsm.run();
                } catch (err) {
                    error = err;
                }
            });

            it("does not throw an error", function () {
                expect(error).to.be(undefined);
            });

            it("runs the action", function () {
                expect(fsm.states.A.exit.called).to.be.true;
            });

            it("does not transition away from the previous state", function () {
                expect(fsm.currentState().name).to.equal('A');
            });
        });
    });

    describe("`exit`", function () {
        describe("when defined as the string name of a state", function () {
            beforeEach(function () {
                params.states.A = {
                    exit: 'B',
                    goC: {
                        target: 'C'
                    },
                    states: {
                        B: {},
                        C: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                fsm.run();
                expect(fsm.currentState().name).to.equal('A');
                fsm.dispatch('goC');
            });

            it("does not transition to that state", function () {
                expect(fsm.currentState().name).not.to.equal('B');
            });
        });

        describe("when defined as a proper event object with a target", function () {
            var error, err;

            beforeEach(function () {
                params.states.A = {
                    exit: {
                        target: 'B'
                    },
                    states: {
                        B: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                try {
                    fsm.run();
                } catch (err) {
                    error = err;
                }
            });

            it("does not throw an error", function () {
                expect(error).to.be(undefined);
            });

            it("does not transition away from the previous state", function () {
                expect(fsm.currentState().name).to.equal('A');
            });
        });

        describe("when defined as a proper event object with no target", function () {
            var error, err;

            beforeEach(function () {
                params.states.A = {
                    exit: {
                        action: Spy()
                    },
                    states: {
                        B: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                try {
                    fsm.run();
                } catch (err) {
                    error = err;
                }
            });

            it("does not throw an error", function () {
                expect(error).to.be(undefined);
            });

            it("runs the action", function () {
                expect(fsm.states.A.exit.action.called).to.be.true;
            });
        });

        describe("when defined as an array of events", function () {
            var error, err;

            beforeEach(function () {
                params.states.A = {
                    exit: [{
                        target: 'B',
                        guard: function () { return true; },
                        action: Spy()
                    }, {
                        target: 'C',
                        guard: function () { return false; },
                        action: Spy()
                    }],
                    states: {
                        B: {},
                        C: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                try {
                    fsm.run();
                } catch (err) {
                    error = err;
                }
            });

            it("does not throw an error", function () {
                expect(error).to.be(undefined);
            });

            it("does not transition away from the previous state", function () {
                expect(fsm.currentState().name).to.equal('A');
            });

            it("calls the action of the event whose guard passes", function () {
                expect(fsm.states.A.exit[0].action.called).to.be.true;
            });

            it("does not call the action of the event whose guard fails", function () {
                expect(fsm.states.A.exit[1].action.called).to.be.false;
            });
        });

        describe("when defined as a function", function () {
            var error, err;

            beforeEach(function () {
                params.states.A = {
                    exit: Spy(),
                    states: {
                        B: {}
                    }
                };
                fsm = _.extend(params, Statechart);
                try {
                    fsm.run();
                } catch (err) {
                    error = err;
                }
            });

            it("does not throw an error", function () {
                expect(error).to.be(undefined);
            });

            it("does not transition away from the previous state", function () {
                expect(fsm.currentState().name).to.equal('A');
            });

            it("calls the action", function () {
                expect(fsm.states.A.exit.called).to.be.false;
            });
        });
    });
});

describe("a custom event `move`", function () {
    var fsm;
    var params = {
        initialState: "A",
        states: {
        }
    };

    describe("when defined as the string name of a state", function () {
        beforeEach(function () {
            params.states.A = {
                move: 'B',
                goC: {
                    target: 'C'
                },
                states: {
                    B: {},
                    C: {}
                }
            };
            fsm = _.extend(params, Statechart);
            fsm.run();
            expect(fsm.currentState().name).to.equal('A');
            fsm.dispatch('move');
        });

        it("does not transition to that state", function () {
            expect(fsm.currentState().name).not.to.equal('B');
        });
    });

    describe("when defined as a proper event object with a target", function () {
        var error, err;

        beforeEach(function () {
            params.states.A = {
                exit: Spy(),
                move: {
                    target: 'B',
                    action: Spy()
                },
                states: {
                    B: {}
                }
            };
            fsm = _.extend(params, Statechart);
            try {
                fsm.run();
                fsm.dispatch('move');
            } catch (err) {
                error = err;
            }
        });

        it("does not throw an error", function () {
            expect(error).to.be(undefined);
        });

        it("transitions away from the previous state", function () {
            expect(fsm.currentState().name).to.equal('B');
        });

        it("runs the action", function () {
            expect(fsm.states.A.move.action.called).to.be.true;
        });

        it("does not run the exit action of a parent state of a nested state", function () {
            expect(fsm.states.A.exit.called).to.be.false;
        });
    });

    describe("when defined as a proper event object with no target", function () {
        var error, err;

        beforeEach(function () {
            params.states.A = {
                move: {
                    action: Spy()
                },
                states: {
                    B: {}
                }
            };
            fsm = _.extend(params, Statechart);
            try {
                fsm.run();
                fsm.dispatch('move');
            } catch (err) {
                error = err;
            }
        });

        it("does not throw an error", function () {
            expect(error).to.be(undefined);
        });

        it("does not transition away from the previous state", function () {
            expect(fsm.currentState().name).to.equal('A');
        });

        it("runs the action", function () {
            expect(fsm.states.A.move.action.called).to.be.true;
        });
    });

    describe("when defined as an array of events", function () {
        var error, err;

        beforeEach(function () {
            params.states.A = {
                move: [{
                    target: 'B',
                    guard: function () { return true; },
                    action: Spy()
                }, {
                    target: 'C',
                    guard: function () { return false; }
                }],
                states: {
                    B: {},
                    C: {}
                }
            };
            fsm = _.extend(params, Statechart);
            try {
                fsm.run();
                fsm.dispatch('move');
            } catch (err) {
                error = err;
            }
        });

        it("does not throw an error", function () {
            expect(error).to.be(undefined);
        });

        it("transitions away to the state whose guard passes", function () {
            expect(fsm.currentState().name).to.equal('B');
        });

        it("calls the action of the event whose guard passes", function () {
            expect(fsm.states.A.move[0].action.called).to.be.true;
        });
    });

    describe("when defined as a function", function () {
        var error, err;

        beforeEach(function () {
            params.states.A = {
                move: Spy(),
                states: {
                    B: {}
                }
            };
            fsm = _.extend(params, Statechart);
            try {
               fsm.run();
               fsm.dispatch('move');
            } catch (err) {
                error = err;
            }
        });

        it("does not throw an error", function () {
            expect(error).to.be(undefined);
        });

        it("does not transition away from the previous state", function () {
            expect(fsm.currentState().name).to.equal('A');
        });

        it("calls the action", function () {
            expect(fsm.states.A.move.called).to.be.false;
        });
    });
});

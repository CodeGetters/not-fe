import EventBus from "../src/EventBus";

describe("EventBus", () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it("should register and emit events correctly", () => {
    const mockFn = jest.fn();
    eventBus.on("testEvent", mockFn);

    eventBus.emit("testEvent", "arg1", "arg2");

    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("should not call the handler if the event is not registered", () => {
    const mockFn = jest.fn();
    eventBus.emit("testEvent", "arg1", "arg2");

    expect(mockFn).not.toHaveBeenCalled();
  });

  it("should register multiple handlers for the same event", () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    eventBus.on("testEvent", mockFn1);
    eventBus.on("testEvent", mockFn2);

    eventBus.emit("testEvent", "arg1", "arg2");

    expect(mockFn1).toHaveBeenCalledWith("arg1", "arg2");
    expect(mockFn2).toHaveBeenCalledWith("arg1", "arg2");
  });
});

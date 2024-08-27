class EventBus {
  events: Map<string, Function[]>;
  constructor() {
    this.events = this.events || new Map();
  }
  // 注册事件
  on(type: string, fn: Function) {
    const handles = this.events.get(type) ? this.events.get(type) : [];
    this.events.set(type, [...handles, fn]);
  }
  // 触发事件
  emit(type: string, ...args: any[]) {
    const handles = this.events.get(type);
    if (handles) {
      handles.forEach((handle) => {
        handle.apply(this, args);
      });
    }
  }
}

export default EventBus;

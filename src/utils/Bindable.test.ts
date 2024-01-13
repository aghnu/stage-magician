import { Bindable } from "./Bindable.ts";

describe("A bindable number is created", () => {
  const defaultNumber = 100;
  let bindableNumber = new Bindable(defaultNumber);

  afterEach(() => {
    bindableNumber = new Bindable(defaultNumber);
  });

  test("The bindable number's getter returns the init value", () => {
    expect(bindableNumber.get()).toBe(defaultNumber);
  });

  test("The bindable number's setter sets the new value", () => {
    expect(bindableNumber.get()).toBe(defaultNumber);

    // new value is set successfully
    bindableNumber.set(200);
    expect(bindableNumber.get()).toBe(200);
  });
});

describe("A bindable binds to a callback", () => {
  const defaultNumber = 100;
  let bindableNumber = new Bindable(defaultNumber);

  afterEach(() => {
    bindableNumber = new Bindable(defaultNumber);
  });

  test("The bindable's bind callback is called at binding", () => {
    let number = 0;
    bindableNumber.bind((val) => (number = val));
    expect(number).toBe(defaultNumber);
  });

  test("The bindable's bind callback is called when set new value", () => {
    let count = 0;
    bindableNumber.bind(() => count++);
    expect(bindableNumber.get()).toBe(defaultNumber);
    expect(count).toBe(1);

    bindableNumber.set(defaultNumber + 1);
    expect(count).toBe(2);
  });

  test("The bindable's bind callback is not called when set a value that is equal to current value", () => {
    let count = 0;
    bindableNumber.bind(() => count++);
    expect(bindableNumber.get()).toBe(defaultNumber);
    expect(count).toBe(1);

    bindableNumber.set(defaultNumber);
    expect(count).toBe(1);

    bindableNumber.set(defaultNumber + 1);
    expect(count).toBe(2);

    bindableNumber.set(defaultNumber);
    expect(count).toBe(3);
  });
});

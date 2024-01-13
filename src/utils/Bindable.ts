type BindingFunc<T> = (val: T) => void;

export class Bindable<T> {
  private val: T;
  private bindingFuncs: Array<BindingFunc<T>>;

  constructor(val: T) {
    this.val = val;
    this.bindingFuncs = [];
  }

  public bind(bindingFunc: BindingFunc<T>): () => void {
    if (!this.bindingFuncs.includes(bindingFunc))
      this.bindingFuncs.push(bindingFunc);

    bindingFunc(this.val);
    return () => {
      this.unbind(bindingFunc);
    };
  }

  public unbind(bindingFunc: BindingFunc<T>) {
    if (!this.bindingFuncs.includes(bindingFunc)) return;
    this.bindingFuncs = this.bindingFuncs.filter(
      (func) => func !== bindingFunc,
    );
  }

  public get() {
    return this.val;
  }

  public set(val: T) {
    if (this.val === val || JSON.stringify(val) === JSON.stringify(this.val))
      return;

    this.val = val;
    this.bindingFuncs.forEach((func) => {
      void new Promise(() => {
        func(this.val);
      });
    });
  }
}

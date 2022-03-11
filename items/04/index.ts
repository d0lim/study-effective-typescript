class C {
  foo: string;
  constructor(foo: string) {
    this.foo = foo;
  }
}
const c = new C("this is foo");
const d: C = {
  foo: "this is not an instance of class C but assignable to d, thanks to duck-typing",
};

console.log(c);
console.log(d);

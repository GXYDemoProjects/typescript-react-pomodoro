function createPerson(name, age, job) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function () {
    console.log('this:', this);
    console.log('this.name', this.name);
  }
  return o;
}

var p1 = createPerson('Bob', 21, 'cooker');
p1.sayName();

var p2=new Object();
console.log(p2.__proto__.isPrototypeOf(Object)); 
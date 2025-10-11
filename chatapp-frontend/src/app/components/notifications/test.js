const compose = (...functions) => (arg) =>
    functions.reduceRight((acc, fn) => fn(acc), arg);

  const increaseBy5 = (num) => num + 5;
  const tripleValue = (num) => num * 3;
  const reduceBy10 = (num) => num - 10;

  const applyOperations = compose(reduceBy10, tripleValue, increaseBy5);
  const finalResult = applyOperations(7);

  console.log("The final result after applying the operations is:", finalResult);

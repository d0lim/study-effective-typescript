/**
 * 타입 오류가 있어도 컴파일은 수행된다.
 * 타입이 잘못되었다고 하더라도, 타입 체킹과 컴파일은 별개의 과정이기 때문에 그대로 컴파일된다.
 * 따라서 컴파일이 되지 않길 바란다면 tsconfig.json에 noEmitOnError를 설정해야 한다.
 */

/**
 * Typescript의 타입은 런타임에 사라지기 때문에, 런타임에 타입 체킹은 불가능하다.
 * 그래서 실제로 nest에서는 타입 체킹이 필요한 것들에 대해서 대부분 class로 구현하고 있는 것을 볼 수 있다.
 * 타입 정보를 유지하고 싶다면 몇 가지 방법을 사용할 수 있는데,
 * 1. 특정 타입만 가지고 있는 속성으로 확인하기
 * 2. 태그 기법 사용하기
 * 3. 타입을 클래스로 만들기 -> 난 이게 제일 맘에 듦
 *
 * 간단히 책의 예제를 살짝 바꾸어서 써보도록 하겠다.
 * 난 요새 자동차 예제가 참 맘에 든다.
 */

/**
 * 1. 특정 타입만 가지고 있는 속성으로 확인하기
 */
interface Avante {
  price: number;
  driver: string;
  isActive: boolean;
  gas: number;
}

interface AvanteHybrid extends Avante {
  battery: number;
}

type Car = Avante | AvanteHybrid;

function getAvailableDistance(car: Car) {
  // 하이브리드에만 battery가 달려있다고 가정.
  // 물론 모든 차에는 배터리가 달려 있다.
  if ("battery" in car) {
    return car.battery * 1 + car.gas * 5;
  } else {
    return car.gas * 5;
  }
}

const avante: Avante = {
  price: 2500,
  driver: "a",
  isActive: true,
  gas: 55,
};

const avanteHybrid: AvanteHybrid = {
  price: 3000,
  driver: "b",
  isActive: true,
  gas: 55,
  battery: 30,
};

console.log("Avante:", getAvailableDistance(avante));
console.log("Avante Hybrid:", getAvailableDistance(avanteHybrid));

/**
 * 2. 태그 기법 사용하기
 */

interface AvanteTag {
  kind: "Avante";
  price: number;
  driver: string;
  isActive: boolean;
  gas: number;
}

interface AvanteHybridTag {
  kind: "AvanteHybrid";
  price: number;
  driver: string;
  isActive: boolean;
  gas: number;
  battery: number;
}

type CarTag = AvanteTag | AvanteHybridTag;

function getAvailableDistanceTag(car: CarTag) {
  // 위와는 다르게, kind 라는 속성에 접근해서 정보를 확인하는 것을 볼 수 있다.
  if (car.kind === "AvanteHybrid") {
    return car.battery * 1 + car.gas * 5;
  } else {
    // 그리고 여기서 car.b 까지 치면 위와는 다르게 battery가 자동 완성으로 뜨지 않는다.
    // 정적 분석이 상당하다.
    return car.gas * 5;
  }
}

const avanteTag: AvanteTag = {
  // 사용할 수 있는 값의 종류는 정해진 것 뿐이지만, 그래도 넣어줘야 함.
  kind: "Avante",
  price: 2500,
  driver: "c",
  isActive: true,
  gas: 55,
};

const avanteHybridTag: AvanteHybridTag = {
  kind: "AvanteHybrid",
  price: 2500,
  driver: "d",
  isActive: true,
  gas: 55,
  battery: 30,
};

console.log("Avante Tag:", getAvailableDistanceTag(avanteTag));
console.log("Avante Hybrid Tag:", getAvailableDistanceTag(avanteHybridTag));

/**
 * 3. 타입을 클래스로 만들기
 */

class AvanteClass {
  constructor(
    public price: number,
    public driver: string,
    public isActive: boolean,
    public gas: number
  ) {}
}

class AvanteHybridClass extends AvanteClass {
  constructor(
    public price: number,
    public driver: string,
    public isActive: boolean,
    public gas: number,
    public battery: number
  ) {
    super(price, driver, isActive, gas);
  }
}

// 여기서는 각각 타입으로 참조됨
type CarClass = AvanteClass | AvanteHybridClass;

function getAvailableDistanceClass(car: CarClass) {
  // 여기서는 값으로 참조됨
  if (car instanceof AvanteHybridClass) {
    return car.battery * 1 + car.gas * 5;
  } else {
    // 역시, battery 속성은 자동완성에 뜨지 않는다.
    return car.gas * 5;
  }
}

const avanteClass = new AvanteClass(2500, "e", true, 55);
const avanteHybridClass = new AvanteHybridClass(2500, "e", true, 55, 30);

console.log("Avante Class:", getAvailableDistanceClass(avanteClass));
console.log(
  "Avante Hybrid Class:",
  getAvailableDistanceClass(avanteHybridClass)
);

/**
 * 타입 연산은 런타임에 하등 상관이 없다.
 * '1' as number 쓴다고 '1'이 1이 되는게 아니다.
 * 그냥 타입상에서만 number로 바뀌는 것이다.
 * as는 그저 타입 단언문이다.
 */

/**
 * 런타임 타입은 선언된 타입이랑 다를 수 있다.
 * 타입 체크가 항상 완벽하게 모든 경우를 다 고려하지는 못한다.
 * 특히, 외부의 요청에 의존성을 가지고 있는 서버와 같은 경우에
 * boolean으로 타입 선언을 해둔 곳에 string이 들어올지는 아무도 모르는 일
 * 이런 런타임 타입과 선언 타입이 달라지는 상황을 최대한 피해야한다.
 */

/**
 * 타입스크립트는 런타임의 동작과는 무관하기 때문에,
 * 이 타입을 가지고 오버로딩을 수행할 수는 없다.
 * 함수 오버로딩을 아예 지원하지 않는 것은 아닌데, 구현체는 단 하나여야 한다.
 * 즉, 파라미터 타입에 따라 구현체를 다르게 가져갈 수는 없다는 뜻이다.
 */
function add(a: number, b: number): number;
function add(a: string, b: string): string;
// 마치 C에서 프로토타이핑 하는 것을 보는 것 같다. 주의점이 추후에 또 나온다고 한다. 어렵네?
// 살짝 들춰보고 온 바에 따르면 이거 쓰지 말고 조건부 타입 쓰란다.
function add(a: any, b: any) {
  return a + b;
}

const tree = add(1, 2);
const twelve = add("1", "2");

/**
 * 타입스크립트 타입은 런타임 성능에 영향을 주지 않는다.
 * 어쨌든 중간에 빌드타임이 길어지긴 하지만,
 * 빌드가 되고 나서는 런타임상에서는 그냥 자바스크립트이기 때문에
 * 성능에 일체 영향이 없다.
 */

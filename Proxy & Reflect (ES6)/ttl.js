/**
 * Reference: http://dealwithjs.io/es6-features-10-use-cases-for-proxy/
 * 1. With Proxy we can control the value we store in Object, useful when we want to store meta data
 * 2. Below example we put a TTL based on the real value, so when we set the value cache.a = 42, instead of 42 we store {ttl: 30, value: 42}
 * 3. Then we decrease the ttl every second and when it reaches 0, remove the property.
 */

/**
 * Function to set TTL for the value being stored in Object
 * @param {function} ttlFunc 
 */

function cacheObj(ttlFunc) {

  const obj = {};
  const handler = {
    get: function (obj, prop) {
      const data = Reflect.get(obj, prop);
      if (data) {
        return data.value;
      }
    },
    set: function (obj, prop, value) {
      const data = {
        ttl: ttlFunc(prop),
        value: value
      };
      return Reflect.set(obj, prop, data);
    }
  }

  // Decrease TTL and remove prop when it reaches zero
  function invalidate() {
    for (let prop in obj) {
      obj[prop].ttl -= 1;
      if (obj[prop].ttl <= 0) {
        delete obj[prop];
      }
    }
  }

  window.setInterval(invalidate, 1000);
  return new Proxy(obj, handler);

}

// Try it out
const cache = cacheObj(prop => 5);

function log(sec) {
  console.log(`${sec}s: a = ${cache.a}`);
}

console.clear();

cache.a = 123;

for (let sec = 0; sec < 6; sec += 1) {
  window.setTimeout(() => log(sec), sec * 1000);
}
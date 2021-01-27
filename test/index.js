const { suite } = require('uvu');
const assert = require('uvu/assert');
const { simultan } = require('../lib/cjs');
const test = suite('basics');

console.log(simultan);

const sleep = t => new Promise(r => setTimeout(r, t));
async function* generateSequence(start, end) {
    for (let i = start; i <= end; i++) {
      await sleep(2);
      yield i;
    }
}

test('should be a function', () => {
	assert.type(simultan, 'function');
});

test('should return promise', () => {
    const promise = simultan([], () => {});
    assert.ok(Promise.resolve(promise) == promise);
});

test('should resolve to return values', async () => {
    const input = [1, 2, 3, 4];
    const values = await simultan(input, async value => {
        await sleep(2);
        return value;
    });
    assert.equal(input, values);
    assert.is.not(input, values);
});

test('should run simultaneously', async () => {
    const input = [1, 2];
    const start = process.hrtime();
    await simultan(input, async value => {
        await sleep(500);
        return value;
    }, );
    const end = process.hrtime(start);
    assert.is(end[0], 0)
});

test('should accept limit', async () => {
    const input = [1, 2];
    const start = process.hrtime();
    await simultan(input, async value => {
        await sleep(500);
        return value;
    }, 1);
    const end = process.hrtime(start);
    assert.is(end[0], 1)
});

test('should accept async iterable', async () => {
    const input = generateSequence(0, 2);
    const values = await simultan(input, async value => value);
    assert.equal(values, [0, 1, 2]);
});

test.run();
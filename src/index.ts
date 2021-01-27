type IteratorFn<T, R = unknown> = (item: T) => Promise<R>;

/**
 * Simultaneously run an async function on any iterable with limited concurrency.
 * @param iterable
 * @param fn callback function to execute on each item in iterable.
 * @param limit maximum number of concurrent promises.
 */
export async function simultan<T, R = unknown>(iterable: Iterable<T> | AsyncIterable<T>, fn: IteratorFn<T, R>, limit = 200) {
  let run: Promise<R>[] = [], val: R[] = [], p: Promise<R>;
  for await (const item of iterable) {
    p = fn(item), p.then(v => val.push(run.splice(run.indexOf(p), 1) && v));
    run.push(p);
    if (run.length >= limit) await Promise.race(run);
  }
  return await Promise.all(run) && val;
}
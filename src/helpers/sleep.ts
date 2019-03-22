/**
 * Provide a function that wait t ms before resolving the value given to it in parameter
 * @param t ms to wait
 */
const sleep = (t: number) => <T>(v?: T): Promise<T> =>
  new Promise(res => setTimeout(() => res(v), t));

export default sleep;

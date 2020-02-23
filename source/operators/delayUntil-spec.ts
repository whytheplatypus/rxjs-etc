/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { delayUntil } from "./delayUntil";

describe("delayUntil", () => {
  it(
    "should delay notifications received prior to the signal",
    marbles(m => {
      const source = m.cold("   -a-b------c-d-|");
      const signal = m.cold("   -----x---------");
      const subs = "            ^-------------!";
      const expected = m.cold(" -----(ab)-c-d-|");

      const destination = source.pipe(delayUntil(signal));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support empty sources",
    marbles(m => {
      const source = m.cold("   --------------|");
      const signal = m.cold("   -----x---------");
      const subs = "            ^-------------!";
      const expected = m.cold(" --------------|");

      const destination = source.pipe(delayUntil(signal));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support sources that error before the signal",
    marbles(m => {
      const source = m.cold("   --#    ");
      const signal = m.cold("   -----x-");
      const subs = "            ^-!    ";
      const expected = m.cold(" --#    ");

      const destination = source.pipe(delayUntil(signal));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support sources that error after the signal",
    marbles(m => {
      const source = m.cold("   -------#");
      const signal = m.cold("   -----x--");
      const subs = "            ^------!";
      const expected = m.cold(" -------#");

      const destination = source.pipe(delayUntil(signal));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );
});
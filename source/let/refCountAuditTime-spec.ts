/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { mergeMapTo } from "rxjs/operators/mergeMapTo";
import { publish } from "rxjs/operators/publish";
import { marbles } from "rxjs-marbles";
import { refCountAuditTime } from "./refCountAuditTime";

describe("let/refCountAuditTime", () => {

    it("should multicast to multiple observers and complete", marbles(m => {

        const source =     m.cold("-1-2-3----4-|");
        const sourceSubs =        "^           !";

        const duration = m.time("--|");
        const published = source.pipe(publish(), refCountAuditTime(duration, m.scheduler));

        const subscriber1 = m.hot("a|           ").pipe(mergeMapTo(published));
        const expected1   =       "-1-2-3----4-|";
        const subscriber2 = m.hot("    b|       ").pipe(mergeMapTo(published));
        const expected2   =       "    -3----4-|";
        const subscriber3 = m.hot("        c|   ").pipe(mergeMapTo(published));
        const expected3   =       "        --4-|";

        m.expect(subscriber1).toBeObservable(expected1);
        m.expect(subscriber2).toBeObservable(expected2);
        m.expect(subscriber3).toBeObservable(expected3);
        m.expect(source).toHaveSubscriptions(sourceSubs);
    }));

    it("should multicast an error to multiple observers", marbles(m => {

        const source =     m.cold("-1-2-3----4-#");
        const sourceSubs =        "^           !";

        const duration = m.time("--|");
        const published = source.pipe(publish(), refCountAuditTime(duration, m.scheduler));

        const subscriber1 = m.hot("a|           ").pipe(mergeMapTo(published));
        const expected1   =       "-1-2-3----4-#";
        const subscriber2 = m.hot("    b|       ").pipe(mergeMapTo(published));
        const expected2   =       "    -3----4-#";
        const subscriber3 = m.hot("        c|   ").pipe(mergeMapTo(published));
        const expected3   =       "        --4-#";

        m.expect(subscriber1).toBeObservable(expected1);
        m.expect(subscriber2).toBeObservable(expected2);
        m.expect(subscriber3).toBeObservable(expected3);
        m.expect(source).toHaveSubscriptions(sourceSubs);
    }));

    it("should disconnect after the specified duration once the last subscriber unsubscribes", marbles(m => {

        const source =     m.cold(   "-1-2-3----4--");
        const sourceSubs =        "   ^          ! ";

        const duration = m.time("--|");
        const published = source.pipe(publish(), refCountAuditTime(duration, m.scheduler));

        const subscriber1 = m.hot("   a|           ").pipe(mergeMapTo(published));
        const unsub1 =            "          !     ";
        const expected1   =       "   -1-2-3--     ";
        const subscriber2 = m.hot("       b|       ").pipe(mergeMapTo(published));
        const unsub2 =            "            !   ";
        const expected2   =       "       -3----   ";

        m.expect(subscriber1, unsub1).toBeObservable(expected1);
        m.expect(subscriber2, unsub2).toBeObservable(expected2);
        m.expect(source).toHaveSubscriptions(sourceSubs);
    }));

    it("should disconnect if a subscription occurs within the duration", marbles(m => {

        const source =     m.cold(   "-1-2-3----4-5----");
        const sourceSubs =        "   ^              ! ";

        const duration = m.time("--|");
        const published = source.pipe(publish(), refCountAuditTime(duration, m.scheduler));

        const subscriber1 = m.hot("   a|               ").pipe(mergeMapTo(published));
        const unsub1 =            "          !         ";
        const expected1   =       "   -1-2-3--         ";
        const subscriber2 = m.hot("       b|           ").pipe(mergeMapTo(published));
        const unsub2 =            "            !       ";
        const expected2   =       "       -3----       ";
        const subscriber3 = m.hot("              c|    ").pipe(mergeMapTo(published));
        const unsub3 =            "                !   ";
        const expected3   =       "              -5-   ";

        m.expect(subscriber1, unsub1).toBeObservable(expected1);
        m.expect(subscriber2, unsub2).toBeObservable(expected2);
        m.expect(subscriber3, unsub3).toBeObservable(expected3);
        m.expect(source).toHaveSubscriptions(sourceSubs);
    }));

    it("should reconnect if a subscription occurs after the duration", marbles(m => {

        const source =     m.cold(   "-1-2-3----4-5-------");
        const sourceSubs =       ["   ^          !        ",
                                  "                 ^   ! "];

        const duration = m.time("--|");
        const published = source.pipe(publish(), refCountAuditTime(duration, m.scheduler));

        const subscriber1 = m.hot("   a|                  ").pipe(mergeMapTo(published));
        const unsub1 =            "          !            ";
        const expected1   =       "   -1-2-3--            ";
        const subscriber2 = m.hot("       b|              ").pipe(mergeMapTo(published));
        const unsub2 =            "            !          ";
        const expected2   =       "       -3----          ";
        const subscriber3 = m.hot("                 c|    ").pipe(mergeMapTo(published));
        const unsub3 =            "                   !   ";
        const expected3   =       "                 -1-   ";

        m.expect(subscriber1, unsub1).toBeObservable(expected1);
        m.expect(subscriber2, unsub2).toBeObservable(expected2);
        m.expect(subscriber3, unsub3).toBeObservable(expected3);
        m.expect(source).toHaveSubscriptions(sourceSubs);
    }));
});

/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable } from "rxjs/Observable";

import "rxjs/add/observable/from";
import "rxjs/add/operator/concat";

export function endWith<T>(...values: T[]): (source: Observable<T>) => Observable<T> {

    return (source) => source.concat(Observable.from(values));
}

/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable, of, zip } from "rxjs";

export function zipArray<T>(observables: Observable<T>[]): Observable<T[]>;

export function zipArray<T, R>(
  observables: Observable<T>[],
  project: (values: T[]) => R
): Observable<R>;

export function zipArray<T, R>(
  ...args: (Observable<T>[] | ((values: T[]) => R))[]
): Observable<T[] | R> {
  let observables = args[0] as Observable<T>[];
  let project = args[1] as (values: T[]) => R;

  if (observables.length === 0) {
    return of(project ? project([]) : []);
  }

  const applyArgs: any[] = observables.slice();
  if (project) {
    applyArgs.push((...values: any[]) => project(values));
  }
  /*tslint:disable-next-line:deprecation*/
  return zip.apply(null, applyArgs) as any;
}

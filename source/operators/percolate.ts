import { from, Observable, ObservableInput } from "rxjs";

/**
 * This combiner is very similar to `onErrorResumeNext`, except
 * operates on the following attributes:
 *   - When all child observables are exhausted, throw an error.
 *   - Stop executing when any observable completes.
 *
 * A better way of understanding this is that if `concat([a, b, c])`
 * can be translated into the procedure: `if (a && b && c) {` then
 * `percolate([a, b, c])` can be translated to `if (a || b || c) {`.
 *
 * @see {@link onErrorResumeNext}
 *
 * @param {...ObservableInput} sources Observables (or anything that *is* observable) passed either directly or as an array.
 * @return {Observable} An Observable that concatenates all sources, one after the other,
 * ignoring all errors, such that any error causes it to move on to the next source.
 */
export function percolate<R>(
  ...sources: (
    | ObservableInput<any>
    | ObservableInput<any>[]
    | ((...values: any[]) => R)
  )[]
): Observable<R> {
  const [first, ...remainder] = sources;

  if (sources.length === 1 && Array.isArray(first)) {
    return percolate(...first);
  }

  return new Observable((subscriber) => {
    let errs: any[] = [];
    const subNext = (err: any) => {
      errs.push(err);
      if (errs.length < sources.length) {
	return;
      }
      subscriber.error(errs.pop());
    };

    for (let i = 0; i < sources.length; i++) {
      from(sources[i]).subscribe({
        complete: () => {
          subscriber.complete();
        },
        next(value?: R) {
          subscriber.next(value);
        },
        error: subNext,
      });
    }
  });
}

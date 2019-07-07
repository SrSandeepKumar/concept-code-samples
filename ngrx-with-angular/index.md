# ngrx with Angular project.

## I had a chance to work on an Angular project, from previously being reactjs developer - this has given great amount of learning

### store/index.ts
```typescript
export * from './actions';
export * from './effects';
export * from './reducers';
```

### store/actions/index.ts
```typescript
import {Action} from "@ngrx/store";

// Action
export const FETCH_PERSON_INFO_INIT = "[PERSON] Fetch Person details - Init";
export const FETCH_PERSON_INFO_SUCCESS = "[PERSON] Fetch Person details - Success";

// Action creator
export class fetchPersonInfoSuccess implements Action {
  readonly type = UPDATE_NAME;
  constructor(public payload) {};
};

export class fetchPersonDetails implements Action {
  readonly type = FETCH_PERSON_INFO;
}

export type PersonActions = fetchPersonInfoSuccess | fetchPersonDetails;
```

### store/effects/index.ts
```typescript
import {Injectable} from "@angular/core";
import {Effect, Actions, ofType} from "@ngrx/effects";

import * as personAction  from "../actions";
import { PersonService } from "../../service/person.service";

@Injectable()
export class PersonEffects {

  constructor(
    private action$: Actions,
    private personService: PersonService
  ) {}

  @Effect()
  fetchPersonInformation$ = this.action$.pipe(
    ofType(personAction.FETCH_PERSON_INFO),
    switchMap(() => {
      return this.personService.fetchAllPerson()
        .pipe(
          map((details: any) => {
            return new personAction.fetchPersonInfoSuccess(details)
          })
        )
        .pipe(
          catchError(err => return throwError(err))
        )
    })
  );

}

```



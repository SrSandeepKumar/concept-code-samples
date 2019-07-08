# ngrx with Angular project (v6).

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

### store/reducer/person.reducer.ts
```typescript
import * as fromPerson from "../actions";

export interface PersonState {
  fullName: string,
  Age: number
};

export const initialState: PersonState = {
  fullName: null,
  age: null
};

export function reducer (
  state = initalState,
  action: fromPerson.PersonActions
):PersonState  {
  switch(action.type) {
    case: fromPerson.FETCH_PERSON_INFO_SUCCESS:
      return {...state, ...action.data};
    default: return state;
  }
};

export const getPersonFullname = (state: PersonState) => state.fullName;

```


### store/reducer/index.ts
```typescript
import {ActionReducerMap, createSelector, createFeatureSelector} from '@ngrx/store';
import * as fromPerson from "./reducer/person.reducer";

export interface GlobalState {
  person: fromPerson.PersonState,
  ...
};

export const reducers: ActionReducerMap<GlobalState> = {
  person: fromPerson.reducer,
  ...
};

export const getPersonReducerState = createFeatureSelector<GlobalState>("person");

export const getPersonState = createSelector(
  getPersonReducerState,
  (state: GlobalState) => state.person
);

export const getPersonFullName = createSelector(getPersonState, fromPerson.getPersonFullname);

```

### app.module.ts
```typescript
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { effects } from './store';

....

@NgModule({
  imports:[
    ...
    StoreModule.forRoot({}),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: true,
    })
    ...
  ]
});

export class AppModule {}

```

### person.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";

import * as fromStore from "../../store";

@Component({
  selector: 'person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  
  constructor(
    private store: Store<fromStore.PersonActions>,
  ) {}
  
  ngOnInit() {
    this.store.dispatch(new fromStore.fetchPersonDetails());
    this.personDetails$ = this.store.select(fromStore.getPersonFullName);
    this.personDetails$.subscribe((data) => {
      this.personFullname = data;
    });
  }

  ...

}

```

### person.component.html
```html
<div>{{personFullName | async}}</div>
```





































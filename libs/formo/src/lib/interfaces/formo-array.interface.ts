import {FormArray, FormGroup} from '@angular/forms';
import {FormValidationError} from "../validation";
import {FormoGroupType} from './formo-group.interface';
import {FormoRootType} from './formo-root.interface';

export interface IFormoArray<
  T extends Array<any>,
  R extends FormoRootType<any>,
  N extends string,
  P = any,
  RT = ReturnType<R['_type']>
> {
  root: R;
  parent: P;
  absolutePath: string;
  control: FormArray;
  model: () => T[0] extends Array<any>
    ? FormoArrayType<T[0], R, string, FormoArrayType<T, R, N, P>>
    : T[0] extends object
    ? FormoGroupType<T[0], R, string, FormoArrayType<T, R, N, P>>
    : never;
  children: ReturnType<IFormoArray<T, R, N, P>['model']>[];
  config: IFormoArrayConfig<R, FormoArrayType<T, R, N, P>>;
  listeners: IFormoArrayListeners<R, FormoArrayType<T, R, N, P>>;

  onGenerateForm(parent: FormGroup | FormArray);
  validationErrors(): FormValidationError[];
  setValue(
    value: T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  );

  prepareForValue(value);

  addModel(
    value?: T[0],
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  );

  removeAt(index: number);

  removeAllChildren();

  generateControl();

  getChildByPath(key, nextPath: string[]);

  updateValidation(formValue: any);

  valueChanged(value: T);
  formValueChanged(value: RT);

  setParent(parent: P);
  setRoot(root: R);

  getValue(): T;

  setConfig(config: FormoArrayType<T, R, N, P>['config']);

  setListeners(listeners: FormoArrayType<T, R, N, P>['listeners']);

  getChildByKey(key: number);
}

interface IFormoArrayConfig<
  R extends FormoRootType<any>,
  C extends FormoArrayType<any, any, string, any>
> {
  visible?: boolean;
}

interface IFormoArrayListeners<
  R extends FormoRootType<any>,
  C extends FormoArrayType<any, any, string, any>,
  T = ReturnType<C['getValue']>,
  RT = R['_type']
> {
  onUpdateValidation?: (root: R, currentArray: C) => void;
  valueChanged?: (root: R, array: C, value: T) => void;
  formValueChanged?: (root: R, array: C, value: RT) => void;
}

export type FormoArrayType<
  T extends Array<any>,
  R extends FormoRootType<any>,
  N extends string,
  P = any
> = IFormoArray<T, R, N, P>;

import {FormArray, FormGroup} from '@angular/forms';
import {FormValidationError} from "../validation";
import {FormoArrayType} from './formo-array.interface';
import {FormoArrayFieldType, FormoBooleanType, FormoNumberType, FormoStringType,} from './formo-field.interface';
import {FormoRootType} from './formo-root.interface';

export enum FormFieldGroupType {
  GoogleMapAutoComplete = 'google-map-autocomplete',
}

export interface IFormoGroup<
  T extends object,
  R extends FormoRootType<any>,
  N extends string,
  P = any,
  RT = R['_type']
> {
  parent: P;
  control: FormGroup;
  children: {
    [K in keyof T & string]: T[K] extends number
      ? FormoNumberType<
          T[K],
          FormoRootType<T>,
          K extends string ? K : string,
          FormoGroupType<T, R, N, P>
        >
      : T[K] extends string
      ? FormoStringType<
          T[K],
          FormoRootType<T>,
          K extends string ? K : string,
          FormoGroupType<T, R, N, P>
        >
      : T[K] extends boolean
      ? FormoBooleanType<
          T[K],
          FormoRootType<T>,
          K extends string ? K : string,
          FormoGroupType<T, R, N, P>
        >
      : T[K] extends Array<any>
      ? T[K][0] extends string
        ? FormoArrayFieldType<
            T[K],
            FormoRootType<T>,
            K extends string ? K : string,
            FormoRootType<T>
          >
        : T[K][0] extends boolean
        ? FormoArrayFieldType<
            T[K],
            FormoRootType<T>,
            K extends string ? K : string,
            FormoRootType<T>
          >
        : T[K][0] extends number
        ? FormoArrayFieldType<
            T[K],
            FormoRootType<T>,
            K extends string ? K : string,
            FormoRootType<T>
          >
        : FormoArrayType<
            T[K],
            FormoRootType<T>,
            K extends string ? K : string,
            FormoRootType<T>
          >
      : T[K] extends object
      ? FormoGroupType<T[K], FormoRootType<T>, K extends string ? K : string>
      : never;
  };
  config: IFormoGroupConfig<R, FormoGroupType<T, R, N, P>>;
  validation: IFormoGroupValidation<R, FormoGroupType<T, R, N, P>>;
  listeners: IFormoGroupListeners<R, FormoGroupType<T, R, N, P>>;

  validationErrors(): FormValidationError[];
  createForm();

  prepareForValue(value);

  onGenerateForm(parent: FormGroup | FormArray);

  generateControl();

  // TODO
  getChildByPath(key: string);

  setParent(parent: P);

  setRoot(root: R);

  updateValidation(formValue: any);

  valueChanged(value: T);
  formValueChanged(value: RT);

  setConfig(config: FormoGroupType<T, R, N, P>['config']);

  setListeners(listeners: FormoGroupType<T, R, N, P>['listeners']);

  setValidation(validation: FormoGroupType<T, R, N, P>['validation']);

  setValue(
    value: T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  );

  getValue(): T;

  patchValue(value: Partial<T>);

  getChildByKey(key: string | number);
}

export interface IFormoGroupConfig<
  R extends FormoRootType<any>,
  C extends FormoGroupType<any, any, string, any>
> {
  visible?: boolean;
}

export interface IFormoGroupListeners<
  R extends FormoRootType<any>,
  C extends FormoGroupType<any, any, string, any>,
  T = ReturnType<C['getValue']>,
  RT = ReturnType<C['getValue']>
> {
  onUpdateValidation?: (root: R, currentGroup: C) => void;
  valueChanged?: (root: R, group: C, value: T) => void;
  formValueChanged?: (root: R, group: C, value: RT) => void;
}

export interface IFormoGroupValidation<
  R extends FormoRootType<any>,
  C extends FormoGroupType<any, any, string, any>
> {
  isRequired?: boolean;
}

export type FormoGroupType<
  T extends object,
  R extends FormoRootType<any>,
  N extends string,
  P = any
> = IFormoGroup<T, R, N, P>;

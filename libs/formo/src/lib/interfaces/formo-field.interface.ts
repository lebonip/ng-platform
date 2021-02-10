import {FormArray, FormControl, FormGroup,} from '@angular/forms';
import {FormoFieldConfig} from '../config';
import {FormValidationError} from "../validation";
import {FormoRootType} from './formo-root.interface';

export enum FormoFieldTypes {
  Text = 'text',
  PlaceAutoComplete = 'place_autocomplete',
  TextArea = 'text_area',
  Select = 'select',
  Switch = 'switch',
  Price = 'price',
  Number = 'number',
  Checkbox = 'checkbox',
  CheckboxTree = 'checkbox_tree',
  Hidden = 'checkbox',
  File = 'file',
  IconPicker = 'icon-picker',
  MatChips = 'mat-chips',
}

export interface IFormoField<
  T,
  R extends FormoRootType<any>,
  N extends string,
  P = any,
    RT = ReturnType<R['getValue']>
> {
  absolutePath: string;
  root: R;
  parent: P;
  key: N;
  control: FormControl;
  config: FormoFieldConfig<R, FormoFieldType<T, R, N, P>>;
  listeners: IFormoFieldListeners<R, FormoFieldType<T, R, N, P>>;
  validation: IFormoFieldValidation<R, FormoFieldType<T, R, N, P>>;

  validationErrors(): FormValidationError[];
  getLabel(value: any): string;
  setListeners(listeners: FormoFieldType<T, R, N, P>['listeners']);
  setValidation(validation: FormoFieldType<T, R, N, P>['validation']);
  onGenerateForm(parent: FormGroup | FormArray);
  generateControl();
  prepareForValue(value);
  setParent(parent: P);
  setRoot(root: R);
  getValue(): T;
  setValue(
    value: T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  );
  patchValue(value: Partial<T>);
  updateValidation(formValue: any);
  valueChanged(value: T);
  formValueChanged(value: RT);
  getParent(): P;
}


export interface IFormoFieldListeners<
  R extends FormoRootType<any>,
  C extends FormoFieldType<any, any, string, any>,
  T = ReturnType<C['getValue']>,
  RT = R['_type']
> {
  onUpdateValidation?: (root: R, currentField: C) => void;
  valueChanged?: (root: R, field: C, value: T) => void;
  formValueChanged?: (root: R, field: C, value: RT) => void;
  onCustomEvent?: (event: string, value: any, currentField: C) => void;
}

export interface IFormoFieldValidation<
  R extends FormoRootType<any>,
  C extends FormoFieldType<any, any, string, any>
> {
  isEmail?: boolean;
  isRequired?: boolean;
  min?: number;
  max?: number;
}

export type FormoFieldType<
  T,
  R extends FormoRootType<any>,
  N extends string,
  P = any
> = IFormoField<T, R, N, P>;

export type FormoStringType<
  T extends string,
  R extends FormoRootType<any>,
  N extends string,
  P = any
> = IFormoField<T, R, N, P>;

export type FormoArrayFieldType<
    T extends Array<any>,
    R extends FormoRootType<any>,
    N extends string,
    P = any
    > = IFormoField<T, R, N, P>;

export type FormoNumberType<
  T extends number,
  R extends FormoRootType<any>,
  N extends string,
  P = any
> = IFormoField<T, R, N, P>;

export type FormoBooleanType<
  T extends boolean,
  R extends FormoRootType<any>,
  N extends string,
  P = any
> = IFormoField<T, R, N, P>;

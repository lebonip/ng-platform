import {FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators,} from '@angular/forms';
import * as _ from 'lodash';
import {FormoFieldConfig, IFormoFieldConfig} from './config';
import {
  FormoFieldType,
  FormoFieldTypes,
  FormoRootType,
  IFormoField,
  IFormoFieldListeners,
  IFormoFieldValidation,
} from './interfaces';
import {FormValidationError} from './validation';

export class FormoField<
  T,
  R extends FormoRootType<any>,
  N extends string,
  P = any,
  RT = R['_type']
> implements IFormoField<T, R, N, P> {
  absolutePath: string;
  root: R;
  parent: P;
  key: N;
  control: FormControl;
  config: FormoFieldConfig<R, FormoFieldType<T, R, N, P>>;
  listeners: IFormoFieldListeners<R, FormoFieldType<T, R, N, P>>;
  validation: IFormoFieldValidation<R, FormoFieldType<T, R, N, P>>;

  constructor(
    key: N,
    config:IFormoFieldConfig<R, FormoFieldType<T, R, N, P>>,
    validation: FormoFieldType<T, R, N, P>['validation'] = {},
    listeners: FormoFieldType<T, R, N, P>['listeners'] = {}
  ) {
    this.key = key;
    this.config = new FormoFieldConfig(config);
    this.generateControl();
    this.setListeners(listeners);
    this.setValidation(validation);
    if (this.listeners.valueChanged) {
      this.control.valueChanges.subscribe((value) => {
        this.valueChanged(value);
      });
    }
  }




  setListeners(listeners: FormoFieldType<T, R, N, P>['listeners']) {
    this.listeners = {};
    this.listeners.onUpdateValidation =
      listeners.onUpdateValidation === undefined
        ? undefined
        : listeners.onUpdateValidation;
    this.listeners.valueChanged =
      listeners.valueChanged === undefined ? undefined : listeners.valueChanged;
    this.listeners.formValueChanged =
      listeners.formValueChanged === undefined
        ? undefined
        : listeners.formValueChanged;
    this.listeners.onCustomEvent =
      listeners.onCustomEvent === undefined
        ? undefined
        : listeners.onCustomEvent;
  }

  setValidation(validation: FormoFieldType<T, R, N, P>['validation']) {
    this.validation = {};
    this.validation.isRequired =
      validation.isRequired === undefined ? false : validation.isRequired;
    this.validation.isEmail =
      validation.isEmail === undefined ? false : validation.isEmail;
    this.validation.min = validation.min || 0;
    this.validation.max = validation.max || 100000;
    const validators: ValidatorFn[] = [];
    if (this.validation.isRequired) {
      validators.push(Validators.required);
    }
    if (this.validation.isEmail) {
      validators.push(Validators.email);
    }
    this.control.setValidators(validators);
  }

  getLabel(value: any): any {
    if (this.config.labelPath) {
      return _.get(value, this.config.labelPath);
    }
    return value;
  }

  onGenerateForm(parent: FormGroup | FormArray) {
    if (parent instanceof FormArray) {
      parent.push(this.control);
    } else {
      parent.addControl(this.key, this.control);
    }
  }

  generateControl() {
    this.control = new FormControl(this.config.value);
  }

  prepareForValue(value) {}

  setParent(parent: P) {
    this.parent = parent;
  }
  setRoot(root: R) {
    this.root = root;
    if (this.listeners.formValueChanged) {
      this.root.control.valueChanges.subscribe((value) => {
        this.formValueChanged(value);
      });
    }
  }

  getValue() {
    return this.control.value;
  }

  setValue(
    value,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ) {
    this.control.setValue(value, options);
  }

  patchValue(value) {
    this.control.patchValue(value);
  }

  updateValidation(formValue: any) {
    //this.validation.onUpdateValidation(this.root, this);
    // this.setValidation();
  }

  valueChanged(value: T) {
    this.listeners.valueChanged(this.root, this, value);
  }
  formValueChanged(value: RT) {
    this.listeners.formValueChanged(this.root, this, value);
  }

  getParent(): P {
    return this.parent;
  }

  validationErrors(): FormValidationError[]{
    const errors: FormValidationError[] = []
    const controlErrors: ValidationErrors = this.control.errors;
    if (controlErrors !== null) {
      Object.keys(controlErrors).forEach(keyError => {
        errors.push({
          key: this.key,
          error: keyError,
          value: this.control.value,
          formoType: 'field'
        });
      });
    }
    return errors;
  }
}

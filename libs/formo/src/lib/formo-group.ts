import {FormArray, FormGroup, ValidationErrors} from '@angular/forms';
import * as _ from 'lodash';
import {
    FormoGroupType,
    FormoRootType,
    IFormoGroup,
    IFormoGroupConfig,
    IFormoGroupListeners,
    IFormoGroupValidation
} from './interfaces';
import {FormValidationError} from "./validation";

export class FormoGroup<
  T extends object,
  R extends FormoRootType<any>,
  N extends string,
  P = any,

> implements IFormoGroup<T, R, N, P> {
  absolutePath: string;
  root: R;
  parent: P;
  key: N;
  children: FormoGroupType<T, R, N, P>['children'];
  control: FormGroup;
  config: IFormoGroupConfig<R, FormoGroupType<T, R, N, P>>;
  validation: IFormoGroupValidation<R, FormoGroupType<T, R, N, P>>;
  listeners: IFormoGroupListeners<R, FormoGroupType<T, R, N, P>>;

  constructor(
    key: N,
    children: FormoGroupType<T, R, N, P>['children'],
    config: FormoGroupType<T, R, N, P>['config'] = {},
    validation: FormoGroupType<T, R, N, P>['validation'] = {},
    listeners: FormoGroupType<T, R, N, P>['listeners'] = {}
  ) {
    this.key = key;
    this.children = children;
    this.setConfig(config);
    this.setValidation(validation);
    this.setListeners(listeners);
    if (this.listeners.valueChanged){
      this.control.valueChanges.subscribe((value) => {
        this.valueChanged(value);
      })
    }
  }

  createForm() {
    this.generateControl();
    Object.keys(this.children).forEach((key) => {
      this.children[key].onGenerateForm(this.control);
    });
  }

  prepareForValue(value) {
    Object.keys(this.children).forEach((key) => {
      this.children[key].prepareForValue(_.get(value, key));
    });
  }

  onGenerateForm(parent: FormGroup | FormArray) {
    this.generateControl();
    if (parent instanceof FormArray) {
      parent.push(this.control);
    } else {
      parent.addControl(this.key, this.control);
    }
    Object.keys(this.children).forEach((key) => {
      this.children[key].onGenerateForm(this.control);
    });
  }

  generateControl() {
    this.control = new FormGroup({});
  }

  getChildByPath(key:string) {
    return this.children[key];
  }



  setParent(parent: P) {
    this.parent = parent;
    Object.keys(this.children).forEach((key) => {
      this.children[key].setParent(this);
    });
  }
  setRoot(root: R) {
    this.root = root;
    if (this.listeners.formValueChanged) {
      this.root.control.valueChanges.subscribe((value) => {
        this.formValueChanged(value);
      });
    }
    Object.keys(this.children).forEach((key) => {
      this.children[key].setRoot(root);
    });
  }

  updateValidation(formValue: any) {
    Object.keys(this.children).forEach((key) => {
      this.children[key].updateValidation(formValue);
    });
  }

  valueChanged(value: T) {
    this.listeners.valueChanged(this.root, this, value);
  }

  formValueChanged(value: R['_type']) {
    this.listeners.formValueChanged(this.root, this, value);
  }

  setConfig(config: FormoGroupType<T, R, N, P>['config']) {
    this.config = {
      visible: config.visible || true
    }
  }

  setValidation(validation: FormoGroupType<T, R, N, P>['validation']) {
    this.validation = {
      isRequired: validation.isRequired || false
    }
  }

  setListeners(listeners: FormoGroupType<T, R, N, P>['listeners']) {
    this.listeners = {
      onUpdateValidation:
        listeners.onUpdateValidation === undefined
          ? undefined
          : listeners.onUpdateValidation,
      valueChanged:
        listeners.valueChanged === undefined
          ? undefined
          : listeners.valueChanged
    }
  }


  getValue(): T {
    return this.control.value;
  }

  setValue(value: T, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }) {
    this.control.setValue(value, options);
  }

  patchValue(value) {
    this.control.patchValue(value);
  }
  getChildByKey(key: string | number) {
    return this.children[key];
  }

  validationErrors(): FormValidationError[]{
    let errors: FormValidationError[] = []
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
    Object.keys(this.children).forEach((key) => {
      errors = [...errors, ...this.children[key].validationErrors()]
    });
    return errors;
  }
}

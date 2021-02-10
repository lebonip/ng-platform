import {BehaviorSubject} from "rxjs";
import { FormoFieldType, FormoFieldTypes, FormoRootType } from '../interfaces';

export interface IFormoFieldConfig<
  R extends FormoRootType<any>,
  C extends FormoFieldType<any, any, string, any>,
  T = ReturnType<C['getValue']>
> {
  type?: FormoFieldTypes;
  value: T;
  label?: string;
  hideLabel?: boolean;
  icon?: string;
  description?: string;
  compareKeyPath?: string;
  choices?: any[];
  choiceLabel?: string;
  choiceValue?: string;
  placeholder?: string;
  labelPath?: string;
  isDisabled?: boolean;
  multiple?: boolean;
  panelClass?: string;
  wrapperClass?: string;
  visible?: boolean;
}
export class FormoFieldConfig<
  R extends FormoRootType<any>,
  C extends FormoFieldType<any, any, string, any>
> {
  type?: FormoFieldTypes;
  value: IFormoFieldConfig<R, C>['value'];
  label?: string;
  hideLabel?: boolean;
  icon?: string;
  description?: string;
  compareKeyPath?: string;
  _choices = new BehaviorSubject([]);
  choiceLabel?: string;
  choiceValue?: string;
  placeholder?: string;
  labelPath?: string;
  isDisabled?: boolean;
  multiple?: boolean;
  panelClass?: string;
  wrapperClass?: string;
  visible?: boolean;

  constructor(config: IFormoFieldConfig<R, C>) {
    this.type = config.type || FormoFieldTypes.Text;
    this.panelClass = config.panelClass || 'col-md-6';
    this.wrapperClass = config.wrapperClass || '';
    this.isDisabled = config.isDisabled || false;
    this.multiple = config.multiple || false;
    this.value = config.value === undefined ? null : config.value;
    this.label = config.label === undefined ? '' : config.label;
    this.hideLabel = config.hideLabel === undefined ? false : config.hideLabel;
    this.compareKeyPath = config.compareKeyPath || null;
    this.placeholder = config.placeholder || config.label || '';
    this.icon = config.icon || null;
    this.choices = (config.choices || [])
    this.choiceLabel = config.choiceLabel || null;
    this.choiceValue = config.choiceValue || null;
    this.description = config.description || '';
    this.labelPath = config.labelPath || null;
    this.visible = config.visible === undefined ? true : config.visible;
  }


  public get choices(){
    return this._choices.value;
  }

  public set choices(choices){
    this._choices.next(choices)
  }




}

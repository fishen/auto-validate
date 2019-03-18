import { DISPLAY_NAME } from "./constants";
import { ArrayHelper, isArrayLike } from "./utils";
import { IValidatorOptions } from "./validatorOptions";
import { format } from 'secure-template';

export class ValidateError<T = any> implements IValidatorOptions {
    [x: string]: any;
    /**
     * The validator's type, such as 'required','length'.
     */
    public type: string;
    /**
     * The error message
     */
    public message: string;
    /**
     * The property's name.
     */
    public name: keyof T;
    /**
     * The property's display name.
     */
    public display: string;
    /**
     * The property's value.
     */
    public value: any;
    /**
     * The error sequence number. the default is the order in which the decorators are added.
     */
    public order: number = 0;
    constructor(target: any, name: keyof T, options: IValidatorOptions) {
        this.type = options.type;
        this.name = name;
        this.value = target[name];
        this.order = options.order;
        this.display = Reflect.getMetadata(DISPLAY_NAME, target, name as any) || name;
        if (isArrayLike(options.arguments)) {
            ArrayHelper.from(options.arguments).forEach((val, idx) => this[`$${idx}`] = val);
        }
        this.message = format(options.message, this);
    }
    public toString() {
        return this.message;
    }
}

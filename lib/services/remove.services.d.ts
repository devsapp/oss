import { RemoveEndProps } from '../common';
import { InputProps } from '../common/entity';
export declare const COMMAND: string[];
interface IRemove {
    props: RemoveEndProps;
    subCommand?: 'layer' | 'domain' | 'ondemand' | 'onDemand' | 'provision' | 'alias' | 'version' | 'service' | 'function' | 'trigger';
}
export default class Remove {
    static handlerInputs(inputs: InputProps): Promise<{
        errorMessage: string;
        help?: undefined;
        subCommand?: undefined;
        props?: undefined;
        args?: undefined;
        table?: undefined;
    } | {
        help: boolean;
        subCommand: any;
        errorMessage?: undefined;
        props?: undefined;
        args?: undefined;
        table?: undefined;
    } | {
        subCommand: any;
        props: RemoveEndProps;
        args: any;
        table: any;
        errorMessage?: undefined;
        help?: undefined;
    }>;
    remove({ props, subCommand }: IRemove, inputs: any): Promise<void>;
}
export {};

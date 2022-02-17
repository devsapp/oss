import { IOssRes } from './services/oss.services';
import Base from './common/base';
import { InputProps } from './common/entity';
export interface IResBucket {
    remoteAddress: string;
    remotePort?: string;
    requestUrls?: string;
}
export default class OssComponent extends Base {
    /**
     * deploy
     * @param inputs
     */
    deploy(inputs: InputProps): Promise<IOssRes | {
        errMesg: string;
    }>;
    /**
     * domain
     * @param inputs
     */
    domain(inputs: InputProps): Promise<void>;
}

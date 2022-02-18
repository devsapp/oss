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
     * 全不变亮植入domain组件，会报错，所以只获取domain相关的参数
     * report oss response
     */
    domain(inputs: InputProps): Promise<any[]>;
}

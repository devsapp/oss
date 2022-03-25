import Base from './common/base';
import { InputProps } from './common/entity';
export default class OssComponent extends Base {
    /**
     * deploy
     * @param inputs
     *
     */
    deploy(inputs: InputProps): Promise<{
        errMesg: any;
    }>;
    remove(inputs: InputProps): Promise<void>;
}

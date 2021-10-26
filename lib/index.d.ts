import Base from './common/base';
import { InputProps } from './common/entity';
export default class OssComponent extends Base {
    /**
     * 部署
     * @param inputs
     */
    deploy(inputs: InputProps): Promise<{
        Region: any;
        Bucket: any;
        Domain: string;
    }>;
}

import OssClient from 'ali-oss';
import { ACLType, IOssRes } from './services/oss.services';
import Base from './common/base';
import { InputProps } from './common/entity';
export interface IResBucket {
    remoteAddress: string;
    remotePort?: string;
    requestUrls?: string;
}
export default class OssComponent extends Base {
    /**
     * bucket is existing?
     * @param : client, bucket, ossAcl = 'private'
     */
    bucketIsExisting(client: OssClient, bucket: string, ossAcl?: ACLType): Promise<boolean>;
    /**
     * upload file
     * @param inputs
     */
    upload(ossClient: OssClient, staticPath: string): Promise<void>;
    /**
     * 部署
     * @param inputs
     */
    deploy(inputs: InputProps): Promise<IOssRes | {
        errMesg: string;
    }>;
}

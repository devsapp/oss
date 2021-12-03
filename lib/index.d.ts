import OssClient from 'ali-oss';
import { ACLType } from './services/oss.services';
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
     * @param ossClient staticPath  ossObject
     */
    upload(ossClient: OssClient, staticPath: string, ossObject: string): Promise<void>;
    /**
     * deploy
     * @param inputs
     */
    deploy(inputs: InputProps): Promise<any>;
}

import { spinner, reportComponent, getCredential, inquirer } from '@serverless-devs/core';
import { get, isEmpty } from 'lodash';
import OssClient from 'ali-oss';
import path from 'path';
import fs from 'fs-extra';
import walkSync from 'walk-sync';
import { IOssConfig, IOssStatic, IwebsiteConfig, ACLType } from './services/oss.services';
import { DEFAULT_SRC, logger } from './common';
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
  async bucketIsExisting(client: OssClient, bucket: string, ossAcl: ACLType = 'private') {
    try {
      await client.getBucketInfo(bucket);
      return true;
    } catch (error) {
      if (error.name === 'NoSuchBucketError') {
        // NoSuchBucketError
        // create bucket ?
        const res = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'isCreated',
            message: `The bucket ${bucket} is inexistent, create the ${bucket} now?`,
          },
        ]);
        if (res.isCreated) {
          // create bucket
          const createLoading = spinner(`The bucket of ${bucket} is creating`);
          await client.putBucket(bucket);
          await client.putBucketACL(bucket, ossAcl);
          createLoading.succeed(`The ${bucket} is created`);
          return true;
        } else {
          logger.log(`The bucket ${bucket} is inexistent`, 'red');
        }
      } else {
        logger.log('GetBucketInfo Server is Error', 'red');
      }
      return false;
    }
  }
  /**
   * upload file
   * @param inputs
   */
  async upload(ossClient: OssClient, staticPath: string) {
    const paths = walkSync(staticPath);
    for (const p of paths) {
      const fillPath = path.resolve(staticPath, p);
      const stat = fs.statSync(fillPath);
      if (stat.isFile()) {
        const spin = spinner(`上传 ${p}`);
        try {
          // eslint-disable-next-line no-await-in-loop
          await ossClient.put(p, fillPath);
          spin.stop();
        } catch (error) {
          spin.fail();
          throw new Error(error.message);
        }
      }
    }
  }
  /**
   * 部署
   * @param inputs
   */
  async deploy(inputs: InputProps) {
    let credentials = get(inputs, 'credentials');
    if (isEmpty(credentials)) {
      credentials = await getCredential(inputs, inputs.project.access);
    }
    reportComponent('oss', {
      uid: credentials.AccountID,
      command: 'deploy',
    });
    logger.debug(
      `[${get(inputs, 'project.projectName')}] inputs params: ${JSON.stringify(inputs, null, 2)}`,
    );
    // attr
    const { AccessKeyID, AccessKeySecret } = credentials;
    const ossRegion = `oss-${get(inputs, 'props.region')}`;
    const ossBucket = get(inputs, 'props.bucket');
    const ossAcl = get(inputs, 'props.acl') || 'private';
    const ossCors = get(inputs, 'props.cors') || [];
    const ossReferer = get(inputs, 'props.referer');
    const { allowEmpty, referers: ossReferers = [] } = ossReferer;
    const ossSrc = get(inputs, 'props.codeUri');
    const ossStatic: IOssStatic = get(inputs, 'props.static', DEFAULT_SRC);
    const { index, error, subDir } = ossStatic;
    // cofig
    const ossConfig: IOssConfig = {
      accessKeyId: AccessKeyID,
      accessKeySecret: AccessKeySecret,
      region: ossRegion,
    };
    // oss clinet
    let ossClient = new OssClient(ossConfig);
    // isContinue
    const isContinue = await this.bucketIsExisting(ossClient, ossBucket, ossAcl);
    if (!isContinue) return;
    ossClient = new OssClient({
      ...ossConfig,
      bucket: ossBucket,
    });
    const deployLoading = spinner('The Oss is deploying');

    // add attr to bucket and upload object
    try {
      // update ossAcl
      ossAcl && (await ossClient.putBucketACL(ossBucket, ossAcl));
      // update ossCors
      ossCors.length > 0 && (await ossClient.putBucketCORS(ossBucket, ossCors));
      // update ossReferer
      if (allowEmpty.toString() && ossReferers.length > 0) {
        await ossClient.putBucketReferer(ossBucket, allowEmpty, ossReferers);
      }
      // upload file
      await this.upload(ossClient, ossSrc);
      // update static
      const websiteConfig: IwebsiteConfig = { index, error };
      if (subDir && subDir.type) {
        // supportSubDir ?
        websiteConfig.supportSubDir = true;
        const typeMap = {
          noSuchKey: 1,
          index: 2,
          redirect: 0,
        };
        const subDirType = typeMap[subDir.type];
        websiteConfig.type = subDirType;
      }
      index && error && (await ossClient.putBucketWebsite(ossBucket, websiteConfig));
      deployLoading.succeed('OSS static source deployed success');
      const { res: bucketRes } = await ossClient.getBucketWebsite(ossBucket);
      const { remoteAddress, remotePort }: any = bucketRes;
      return {
        Bucket: ossBucket,
        Region: get(inputs, 'props.region'),
        RemoteAddress: remoteAddress,
        RemotePort: remotePort,
      };
    } catch (e) {
      deployLoading.fail();
      logger.log('Oss deploy is Error', 'red');
      return {};
    }
  }
}

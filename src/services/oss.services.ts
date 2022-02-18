import OssClient from 'ali-oss';
import { spinner, inquirer } from '@serverless-devs/core';
import path from 'path';
import { spawnSync } from 'child_process';
import { logger } from '../common';
import walkSync from 'walk-sync';
import fs from 'fs-extra';

interface ISrc {
  subDir: any;
  publishDir: string;
  codeUri?: string;
  buildCommand?: string;
  index?: string;
  error?: string;
}
export interface IOssConfig {
  accessKeyId: string;
  accessKeySecret: string;
  region?: string;
  bucket?: string;
  cors?: OssClient.CORSRule[];
  src?: ISrc;
  acl?: string;
  cname?: boolean;
  endpoint?: string;
}
export interface IOssStatic {
  index: string;
  error?: string;
  subDir?: ISubDir;
}
export interface IOssRes {
  Bucket: string;
  Region: string;
  OssAddress?: string;
  Domains?: string | string[];
}
export type ACLType = 'public-read-write' | 'public-read' | 'private';
export interface ISubDir {
  type: string;
}

export interface IwebsiteConfig {
  index: string;
  error?: string;
  supportSubDir?: boolean;
  type?: number;
  subDirType?: number;
}
export interface IResBucket {
  remoteAddress: string;
  remotePort?: string;
  requestUrls?: string;
}

export default async (ossConfig: IOssConfig) => {
  const { bucket, region, accessKeyId, accessKeySecret, src, cors } = ossConfig;
  if (src.buildCommand) {
    await buildSpawnSync(src.buildCommand, src.codeUri);
  }
  // 构造oss客户端
  let ossClient = new OssClient({
    bucket,
    region: `oss-${region}`,
    accessKeyId,
    accessKeySecret,
  });

  // bucket, 不存在此bucket,则创建: 并且加上权限
  await getOrCreateBucket(ossClient, bucket);
  // region重新赋值
  const location = await ossClient.getBucketLocation(bucket);
  ossClient = new OssClient({
    bucket,
    region: location.location,
    accessKeyId,
    accessKeySecret,
  });
  // 文件上传
  await put(ossClient, src.publishDir);

  // 配置静态托管
  const ossConfigObj = { index: src.index, error: src.error };
  if (src.subDir && src.subDir.type) {
    ossConfigObj['supportSubDir'] = true;
    ossConfigObj['type'] =
      {
        noSuchKey: 1,
        index: 2,
        redirect: 0,
      }[src.subDir.type] || 1;
  }
  await ossClient.putBucketWebsite(bucket, ossConfigObj);
  // 设置跨域资源共享规则
  if (cors) {
    await ossClient.putBucketCORS(bucket, cors);
  }
};

export async function buildSpawnSync(hook: string, src: string) {
  const result = spawnSync(hook, [], {
    cwd: path.resolve(process.cwd(), src),
    stdio: 'inherit',
    shell: true,
  });
  if (result && result.status !== 0) {
    throw Error('> Execute Error');
  }
}
/**
 * bucket is existing?
 * @param : client, bucket, ossAcl = 'private'
 */
export async function bucketIsExisting(
  client: OssClient,
  bucket: string,
  ossAcl: ACLType = 'private',
) {
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
          name: 'needToCreate',
          message: `The bucket ${bucket} is inexistent, create the ${bucket} now?`,
        },
      ]);
      if (res.needToCreate) {
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
 * @param ossClient staticPath  subDir
 */
export async function put(ossClient: OssClient, staticPath: string, subDir: string) {
  const paths = walkSync(staticPath);
  for (const p of paths) {
    const fillPath = path.resolve(staticPath, p);
    /**
     * upload empty direction ？
     * const stat = fs.statSync(fillPath);
     * if (stat.isFile()) {}
     */

    /**
     * local create prefix ？
     * `${staticPath}/${ossPrefix}`
     */
    const stat = fs.statSync(fillPath);
    if (stat.isFile()) {
      const spin = spinner(`${p} is uploading `);
      try {
        const assignedOssdir = subDir ? `${subDir}/${p}` : p;
        // eslint-disable-next-line no-await-in-loop
        await ossClient.put(assignedOssdir, fillPath);
        spin.stop();
      } catch (error) {
        spin.fail(`${p} has uploaded failed`);
        throw new Error(error.message);
      }
    }
  }
}

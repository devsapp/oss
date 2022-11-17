/* eslint-disable @typescript-eslint/dot-notation */
import OssClient from 'ali-oss';
import { spinner, inquirer, commandParse, CatchableError } from '@serverless-devs/core';
import path from 'path';
import { spawnSync } from 'child_process';
import walkSync from 'walk-sync';
import { InputProps, IDomainProps } from '../common/entity';
import fs from 'fs-extra';
import { get, map } from 'lodash';
import domain from '../services/domain.service';

interface ISrc {
  subDir: any;
  publishDir: string;
  codeUri?: string;
  buildCommand?: string;
  index?: string;
  error?: string;
}
export interface IHandleInputsRes {
  [key: string]: any;
}
export interface IOssConfig {
  accessKeyId: string;
  accessKeySecret: string;
  region?: string;
  bucket?: string;
  stsToken?: string | undefined;
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
  subDirType?: string;
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
  argsData: IHandleInputsRes,
) {
  const assumeYes: boolean = argsData.y || argsData.assumeYes || argsData['assume-yes'];
  try {
    await client.getBucketInfo(bucket);
    return;
  } catch (error) {
    if (error.name === 'NoSuchBucketError') {
      // NoSuchBucketError
      // create bucket ?
      let autoCreateObj = { needToCreate: false };
      if (assumeYes) {
        autoCreateObj = { needToCreate: true };
      } else {
        autoCreateObj = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'needToCreate',
            message: `The bucket ${bucket} is inexistent, create the ${bucket} now?`,
          },
        ]);
      }
      if (autoCreateObj.needToCreate) {
        // create bucket
        const createLoading = spinner(`The bucket of ${bucket} is creating`);
        await client.putBucket(bucket);
        await client.putBucketACL(bucket, ossAcl);
        createLoading.succeed(`The ${bucket} is created`);
        return;
      } else {
        throw new CatchableError(`The bucket ${bucket} is inexistent`);
      }
    }
    throw new Error('GetBucketInfo Server is Error');
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
/**
 * domain
 * @param inputs
 * 全不变量植入domain组件，会报错，所以只获取domain相关的参数
 */
export async function bindDomain(inputs: InputProps, ossBucket: String) {
  const { props, Properties, ...rest } = inputs;
  const { region, customDomains } = get(inputs, 'props', {});
  const hosts = map(customDomains, (child: IDomainProps) => ({
    host: child.domainName,
    ...child,
  }));
  const domianProps = {
    bucket: ossBucket,
    region,
    hosts,
  };
  const domainParms = { props: domianProps, Properties: domianProps, ...rest };
  const domains = await domain(domainParms);

  const report_content = {
    oss: [
      {
        region: get(inputs, 'props.region'),
        bucket: get(inputs, 'props.bucket'),
      },
    ],
  };

  const result = {
    Region: get(inputs, 'props.region'),
    Bucket: get(inputs, 'props.bucket'),
  };

  if (domains.length > 0) {
    result['Domains'] = domains;
    report_content['url'] = [];
    report_content['cdn'] = [];
    for (let i = 0; i < domains.length; i++) {
      const tempUrl = {};
      tempUrl[`Domain_${i}`] = domains[i];
      report_content['url'].push(tempUrl);
      report_content['cdn'].push({
        region: get(inputs, 'props.region'),
        domain: domains[i],
      });
    }
  }
  return {
    domains,
    reportContent: {
      name: 'oss',
      access: inputs.project.access,
      content: result,
    },
  };
}

export function handleInputs(inputs: InputProps) {
  const parsedArgs: { [key: string]: any } = commandParse(inputs, {
    boolean: ['help', 'assume-yes'],
    string: ['type'],
    alias: { help: ['h', 'H'], 'assume-yes': ['y', 'Y'] },
  });
  const argsData: any = parsedArgs?.data || {};
  return argsData;
}

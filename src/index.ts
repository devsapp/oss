import { spinner, colors, reportComponent, getCredential } from '@serverless-devs/core';
import { get, isEmpty } from 'lodash';
import env from './services/env.servece';
import oss, { IOssConfig } from './services/oss.services';
import { DEFAULT_SRC, logger } from './common';
import Base from './common/base';
import { InputProps } from './common/entity';

export default class WebsiteComponent extends Base {
  /**
   * 部署
   * @param inputs
   */
  async deploy(inputs: InputProps, ...args) {
    console.log(args);
    let credentials = get(inputs, 'credentials');
    if (isEmpty(credentials)) {
      credentials = await getCredential(inputs, inputs.project.access);
    }
    reportComponent('website', {
      uid: credentials.AccountID,
      command: 'deploy',
    });
    logger.debug(
      `[${get(inputs, 'project.projectName')}] inputs params: ${JSON.stringify(inputs, null, 2)}`,
    );
    const ossConfig: IOssConfig = {
      accessKeyId: credentials.AccessKeyID,
      accessKeySecret: credentials.AccessKeySecret,
      bucket: get(inputs, 'props.bucket'),
      region: get(inputs, 'props.region'),
      src: get(inputs, 'props.src', DEFAULT_SRC),
      cors: get(inputs, 'props.cors'),
    };
    await env(inputs);
    await oss(ossConfig);
    spinner('OSS static source deployed success').succeed();

    const Region = get(inputs, 'props.region');
    const Bucket = get(inputs, 'props.bucket');

    const result = {
      Region,
      Bucket,
      Domain: `${Bucket}.oss-${Region}.aliyuncs.com`,
    };

    logger.log(`\n OSS_URL: ${colors.cyan.underline(`https://oss.console.aliyun.com/bucket/oss-${Region}/${Bucket}/object`)}\n`);

    return result;
  }
}

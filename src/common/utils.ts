import {
  IDomain,
  IReferer,
  ICertInfo,
  IIpFilter,
  RefererEnum,
  IpFilterEnum,
  IOptimization,
  IRedirects,
  RemoveICredentials,
} from './interface';
import { get, isFunction, isEmpty } from 'lodash';
import chillout from 'chillout';
import logger from './logger';
import path from 'path';
import * as core from '@serverless-devs/core';
import os from 'os';
import fs from 'fs';

export const parseDomain = (domain: string): IDomain => {
  const arr = domain.split('.');
  return {
    topDomain: arr.slice(arr.length - 2).join('.'),
    rrDomainName: arr.slice(0, arr.length - 2).join('.'),
  };
};

export function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

export function parseReferer(params: IReferer) {
  const { type, allowEmpty, rules } = params;
  if (type === 'whitelist') {
    return {
      functionName: RefererEnum.whitelist,
      functionArgs: [
        {
          argName: 'allow_empty',
          argValue: allowEmpty ? 'on' : 'off',
        },
        {
          argName: 'refer_domain_allow_list',
          argValue: rules.join(','),
        },
      ],
    };
  } else {
    return {
      functionName: RefererEnum.blacklist,
      functionArgs: [
        {
          argName: 'allow_empty',
          argValue: allowEmpty ? 'on' : 'off',
        },
        {
          argName: 'refer_domain_deny_list',
          argValue: rules.join(','),
        },
      ],
    };
  }
}

export function parseIpFilter(params: IIpFilter) {
  const { type, rules } = params;
  if (type === 'whitelist') {
    return {
      functionName: IpFilterEnum.whitelist,
      functionArgs: [
        {
          argName: 'ip_list',
          argValue: rules.join(','),
        },
      ],
    };
  } else {
    return {
      functionName: IpFilterEnum.blacklist,
      functionArgs: [
        {
          argName: 'ip_list',
          argValue: rules.join(','),
        },
      ],
    };
  }
}

export function parseUaFilter(params: IIpFilter) {
  const { type, rules } = params;
  if (type === 'whitelist') {
    return {
      functionName: 'ali_ua',
      functionArgs: [
        {
          argName: 'ua',
          argValue: rules.join('|'),
        },
        { argName: 'type', argValue: 'white' },
      ],
    };
  } else {
    return {
      functionName: 'ali_ua',
      functionArgs: [
        {
          argName: 'ua',
          argValue: rules.join('|'),
        },
        { argName: 'type', argValue: 'black' },
      ],
    };
  }
}

export function parseCertInfo(params: ICertInfo) {
  if (params.certType === 'free') {
    return {
      certType: params.certType,
      serverCertificateStatus: get(params, 'switch', 'on'),
    };
  }

  if (params.certType === 'upload') {
    return {
      certType: params.certType,
      serverCertificateStatus: get(params, 'switch', 'on'),
      certName: params.certName,
      serverCertificate: params.serverCertificate,
      privateKey: params.privateKey,
    };
  }

  if (params.certType === 'csr') {
    return {
      certType: params.certType,
      serverCertificateStatus: get(params, 'switch', 'on'),
      serverCertificate: params.serverCertificate,
    };
  }
}

export function parseOptimization(params: IOptimization) {
  return [
    {
      functionName: 'tesla',
      functionArgs: [
        { argName: 'enable', argValue: get(params, 'trim.html', 'off') },
        { argName: 'trim_css', argValue: get(params, 'trim.css', 'off') },
        { argName: 'trim_js', argValue: get(params, 'trim.javascript', 'off') },
      ],
    },
    {
      functionName: 'gzip',
      functionArgs: [{ argName: 'enable', argValue: get(params, 'gzip', 'off') }],
    },
    {
      functionName: 'brotli',
      functionArgs: [
        { argName: 'enable', argValue: get(params, 'brotli', 'off') },
        { argName: 'brotli_level', argValue: '1' },
      ],
    },
  ];
}

export function parseRedirects(params: IRedirects[]) {
  const option = params.filter((item) => get(item, 'switch', 'on') === 'on');
  return option.map((item) => ({
    functionName: 'host_redirect',
    functionArgs: [
      {
        argName: 'regex',
        argValue: item.source,
      },
      {
        argName: 'replacement',
        argValue: item.destination,
      },
      {
        argName: 'flag',
        argValue: 'redirect',
      },
    ],
  }));
}

// TODO: 专门针对publish.yaml来处理default字段。不需要每次都都手动处理

export const waitUntil = async (
  asyncService: () => Promise<any>,
  stopCondition: (result: any) => boolean,
  {
    timeout = 10 * 60 * 1000, // 10分超时时间
    timeInterval = 1000,
    timeoutMsg,
    hint,
  }: {
    timeInterval?: number;
    timeout?: number;
    timeoutMsg?: string;
    hint?: {
      loading: string;
      success: string;
      fail: string;
    };
  },
) => {
  const spin = hint && core.spinner(hint.loading);
  const startTime = new Date().getTime();
  let result: any;
  await chillout.waitUntil(async () => {
    if (new Date().getTime() - startTime > timeout) {
      logger.debug(timeoutMsg);
      spin?.fail(hint.fail);
      return chillout.StopIteration;
    }
    await sleep(timeInterval);
    result = await asyncService();
    if (stopCondition(result)) {
      spin?.succeed(hint.success);
      return chillout.StopIteration;
    }
  });
  return result;
};

export function deepMap(target: Object, condition: String, callback: Function) {
  if (Object.prototype.toString.call(target) !== '[object Object]') return;
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      if (key === condition && isFunction(callback)) {
        callback(target);
      }
      if (Object.prototype.toString.call(target[key]) === '[object Object]') {
        deepMap(target[key], condition, callback);
      }
    }
  }
}

export async function updateCore() {
  if (!isFunction(core.extend2)) {
    try {
      const homePath = isFunction(core.getRootHome) ? core.getRootHome() : os.homedir();
      const corePath = path.join(homePath, 'cache', 'core');
      const lockPath = path.resolve(corePath, '.s.lock');
      const result = await core.request(
        'https://registry.devsapp.cn/simple/devsapp/core/releases/latest',
      );
      const version = result.tag_name;
      const url = `https://registry.devsapp.cn/simple/devsapp/core/zipball/${version}`;
      const filename = `core@${version}.zip`;
      await core.downloadRequest(url, corePath, { filename, extract: true, strip: 1 });
      fs.writeFileSync(lockPath, JSON.stringify({ version }, null, 2));
    } catch (error) {
      logger.log(
        "\nWARNING\n======================\n* Exception happened! Please execute 's clean --cache' and try again",
        'yellow',
      );
      process.exit(1);
    }
  }
}

export async function getCredentials(credentials: RemoveICredentials, access: string) {
  if (isEmpty(credentials)) {
    return await core.getCredential(access);
  }
  return credentials;
}

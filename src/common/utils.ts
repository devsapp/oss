import {
  IDomain,
  IReferer,
  ICertInfo,
  IIpFilter,
  RefererEnum,
  IpFilterEnum,
  IOptimization,
  IRedirects,
} from './interface';
import { get } from 'lodash';
import chillout from 'chillout';
import logger from './logger';
import { spinner } from '@serverless-devs/core';

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
    timeout = 10 * 60 * 1000, //10分超时时间
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
  const spin = hint && spinner(hint.loading);
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

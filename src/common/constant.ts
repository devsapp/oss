export const PUT_BUCKET_CORS = [
  {
    allowedOrigin: '*',
    allowedHeader: '*',
    allowedMethod: ['GET'],
  },
];

export const DEFAULT_SRC = {
  index: 'index.html',
  error: 'error.html',
};

export const CDN_ERRORS = {
  'InvalidDomainName.Malformed': '域名格式错误或批量新增不支持泛域名。',
  MissingParameter: '参数cdnType和sourceType为必填。',
  'InvalidCdnType.Malformed':
    '参数CdnType不支持该参数值， 取值：web：图片及小文件分发；download：大文件下载加速；video：视音频点播加速；liveStream：直播流媒体加速。',
  'InvalidSources.Malformed':
    '参数Sources格式错误。可以是IP或域名；IP支持最多20个，以逗号区分，域名只能输入一个。IP与域名不能同时输入。',
  'InvalidSourceType.Malformed': 'CdnType格式错误。',
  'InvalidScope.Malformed': 'Scope格式错误。',
  'SourceIp.Exceed': '证书格式不正确。',
  InvalidCertificate: '证书格式不正确。',
  'InvalidCertificate.TooLong': '证书和私钥长度超出限制。',
  InnerAddDomainDenied: '您的帐户没有绑定aoneId，不能添加域名。',
  ExtensiveAndAllBothExist: '泛域名与all.开头域名不能同时存在。',
  CdnTypeNotSupportExtensiveDomain:
    '泛域名不支持该业务类型，目前泛域名只支持图片小文件加速，大文件下载加速，视频点播加速，请知悉。',
  'InvalidResourceGroupId.Malformed': '参数ResourceGroupId格式错误。',
  InvalidDomainNameLevel: 'alicdn.com最多支持三级域名。',
  'InvalidTopLevelDomain.Malformed': '参数TopLevelDomain错误。',
  'TopLevelDomain.NotFound': 'TopLevelDomain不存在。',
  'EntityNotExists.ResourceGroup': '资源组不存在。',
  'InvalidStatus.ResourceGroup': '资源组当前状态不允许进行此操作。',
  NotInternationRealIdentity:
    '根据中华人民共和国法律规定，在中国境内购买使用信息服务的用户需要进行实名登记。',
  DomainOwnerVerifyFail:
    '2020年6月12日起，当您首次将新域名添加至阿里云CDN时，需按要求做域名归属权验证，当您按要求配置DNS解析或文件验证后，才能正常调用AddCdnDomain接口添加域名。 <a href="https://help.aliyun.com/document_detail/169377.html" target="_blank">域名归属权验证请参见</a>',
  DomainNotRegistration:
    '域名尚未备案。欲了解备案，中国站用户前往<a href="https://beian.aliyun.com" target="_blank">备案</a>。国际站用户前往<a href="https://www.alibabacloud.com/zh/icp">ICP 注册支持</a>。',
};

export const DEPLOY_HELP_INFO = [
  {
    header: 'Deploy',
    content: 'Oss uploads files And bind Domain',
  },
  {
    header: 'Usage',
    content: ['$ s deploy <options>', '$ s remove <options>'],
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'y, -y',
        description: 'Assume that the answer to any question which would be asked is yes.',
        type: Boolean,
      },
      {
        name: 'h, -h',
        description: 'Display help for command',
        type: Boolean,
      },
    ],
  },
  {
    header: 'Global Options',
    optionList: [
      {
        name: 'assume-yes',
        description: 'Assume that the answer to any question which would be asked is yes.',
        alias: 'y',
        type: Boolean,
      },
      {
        name: 'help',
        description: 'Display help for the command of [s deploy]',
        alias: 'h',
        type: Boolean,
      },
    ],
  },
  {
    header: 'Examples with Yaml',
    content: ['$ s {bold deploy}', '$ s <ProjectName> {bold deploy}'],
  },
  {
    header: 'Examples with CLI',
    content: ['You can refer to the usage of s and execute [s -h] for help'],
  },
];

export const REMOVE_HELP_INFO = [
  {
    header: 'Remove',
    content:
      'Specify RESOURCE to remove it and resource belonging to it.\n' +
      'If {bold bucket} is specified, service and its functions should be removed.\n' +
      'If {bold domain} is specified, you can specify the domain name to remove the specific domain or remove all domains without domain name.',
  },
  {
    header: 'Usage',
    content: '$ s remove <RESOURCE> <options>',
  },
  {
    header: 'Resource',
    optionList: [
      {
        name: 'bucket',
        description: 'The bucket resource.',
        type: String,
      },
      {
        name: 'domain',
        description: 'The domain resource.',
        type: String,
      },
    ],
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'name',
        typeLabel: '{underline <name>}',
        description: 'Resource name to be removed, only for domain resource.',
        alias: '-n',
        type: String,
      },
    ],
  },
  {
    header: 'Global Options',
    optionList: [
      {
        name: 'assume-yes',
        description: 'Assume that the answer to any question which would be asked is yes.',
        alias: 'y',
        type: Boolean,
      },
      {
        name: 'help',
        description: 'Help for rm.',
        alias: 'h',
        type: Boolean,
      },
    ],
  },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s {bold remove}',
      '$ s <ProjectName> {bold remove}',
      '$ s {bold remove} {underline bucket} [{bold --name} {underline name}]',
      '$ s {bold remove} {underline domain} [{bold --name} {underline name}]',
    ],
  },
  {
    header: 'Examples with CLI',
    content: ['You can refer to the usage of fc-api and execute [s cli fc-api -h] for help'],
  },
];
export const globalParams = {
  header: 'Global Options',
  optionList: [
    {
      name: 'debug',
      description: '[Optional] Output debug informations  ',
      type: String,
    },
    {
      name: 'help',
      description: '[Optional] Help for command',
      alias: 'h',
      type: Boolean,
    },
    {
      name: 'template',
      description: '[Optional] Specify the template file',
      alias: 't',
      type: String,
    },
    {
      name: 'access',
      description: '[Optional] Specify key alias',
      alias: 'a',
      type: String,
    },
  ],
};

export const globalDescribe = {
  header: 'Options Help',
  content: [
    { desc: 'Required: Required parameters in YAML mode and CLI mode' },
    { desc: 'C-Required: Required parameters in CLI mode' },
    { desc: 'Y-Required: Required parameters in Yaml mode' },
    { desc: 'Optional: Non mandatory parameter' },
    { desc: '✋ The difference between Yaml mode and CLI mode: http://ej6.net/yc' },
  ],
};

export const assumeYesDescribe = {
  name: 'assume-yes',
  description: '[Optional] Assume that the answer to any question which would be asked is yes',
  alias: 'y',
  defaultOption: false,
  type: Boolean,
};

export const regionDescribe = {
  name: 'region',
  description:
    '[C-Required] Specify the fc region, value: cn-hangzhou/cn-beijing/cn-beijing/cn-hangzhou/cn-shanghai/cn-qingdao/cn-zhangjiakou/cn-huhehaote/cn-shenzhen/cn-chengdu/cn-hongkong/ap-southeast-1/ap-southeast-2/ap-southeast-3/ap-southeast-5/ap-northeast-1/eu-central-1/eu-west-1/us-west-1/us-east-1/ap-south-1',
  defaultOption: false,
  type: Boolean,
};

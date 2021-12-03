"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CDN_ERRORS = exports.DEFAULT_SRC = exports.PUT_BUCKET_CORS = void 0;
exports.PUT_BUCKET_CORS = [
    {
        allowedOrigin: '*',
        allowedHeader: '*',
        allowedMethod: ['GET'],
    },
];
exports.DEFAULT_SRC = {
    index: 'index.html',
    error: 'error.html',
};
exports.CDN_ERRORS = {
    'InvalidDomainName.Malformed': '域名格式错误或批量新增不支持泛域名。',
    MissingParameter: '参数cdnType和sourceType为必填。',
    'InvalidCdnType.Malformed': '参数CdnType不支持该参数值， 取值：web：图片及小文件分发；download：大文件下载加速；video：视音频点播加速；liveStream：直播流媒体加速。',
    'InvalidSources.Malformed': '参数Sources格式错误。可以是IP或域名；IP支持最多20个，以逗号区分，域名只能输入一个。IP与域名不能同时输入。',
    'InvalidSourceType.Malformed': 'CdnType格式错误。',
    'InvalidScope.Malformed': 'Scope格式错误。',
    'SourceIp.Exceed': '证书格式不正确。',
    InvalidCertificate: '证书格式不正确。',
    'InvalidCertificate.TooLong': '证书和私钥长度超出限制。',
    InnerAddDomainDenied: '您的帐户没有绑定aoneId，不能添加域名。',
    ExtensiveAndAllBothExist: '泛域名与all.开头域名不能同时存在。',
    CdnTypeNotSupportExtensiveDomain: '泛域名不支持该业务类型，目前泛域名只支持图片小文件加速，大文件下载加速，视频点播加速，请知悉。',
    'InvalidResourceGroupId.Malformed': '参数ResourceGroupId格式错误。',
    InvalidDomainNameLevel: 'alicdn.com最多支持三级域名。',
    'InvalidTopLevelDomain.Malformed': '参数TopLevelDomain错误。',
    'TopLevelDomain.NotFound': 'TopLevelDomain不存在。',
    'EntityNotExists.ResourceGroup': '资源组不存在。',
    'InvalidStatus.ResourceGroup': '资源组当前状态不允许进行此操作。',
    NotInternationRealIdentity: '根据中华人民共和国法律规定，在中国境内购买使用信息服务的用户需要进行实名登记。',
    DomainOwnerVerifyFail: '2020年6月12日起，当您首次将新域名添加至阿里云CDN时，需按要求做域名归属权验证，当您按要求配置DNS解析或文件验证后，才能正常调用AddCdnDomain接口添加域名。 <a href="https://help.aliyun.com/document_detail/169377.html" target="_blank">域名归属权验证请参见</a>',
    DomainNotRegistration: '域名尚未备案。欲了解备案，中国站用户前往<a href="https://beian.aliyun.com" target="_blank">备案</a>。国际站用户前往<a href="https://www.alibabacloud.com/zh/icp">ICP 注册支持</a>。',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbW9uL2NvbnRhbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFhLFFBQUEsZUFBZSxHQUFHO0lBQzdCO1FBQ0UsYUFBYSxFQUFFLEdBQUc7UUFDbEIsYUFBYSxFQUFFLEdBQUc7UUFDbEIsYUFBYSxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ3ZCO0NBQ0YsQ0FBQztBQUVXLFFBQUEsV0FBVyxHQUFHO0lBQ3pCLEtBQUssRUFBRSxZQUFZO0lBQ25CLEtBQUssRUFBRSxZQUFZO0NBQ3BCLENBQUM7QUFFVyxRQUFBLFVBQVUsR0FBRztJQUN4Qiw2QkFBNkIsRUFBRSxvQkFBb0I7SUFDbkQsZ0JBQWdCLEVBQUUsMEJBQTBCO0lBQzVDLDBCQUEwQixFQUN4QixzRkFBc0Y7SUFDeEYsMEJBQTBCLEVBQ3hCLDhEQUE4RDtJQUNoRSw2QkFBNkIsRUFBRSxjQUFjO0lBQzdDLHdCQUF3QixFQUFFLFlBQVk7SUFDdEMsaUJBQWlCLEVBQUUsVUFBVTtJQUM3QixrQkFBa0IsRUFBRSxVQUFVO0lBQzlCLDRCQUE0QixFQUFFLGNBQWM7SUFDNUMsb0JBQW9CLEVBQUUsd0JBQXdCO0lBQzlDLHdCQUF3QixFQUFFLHFCQUFxQjtJQUMvQyxnQ0FBZ0MsRUFDOUIsaURBQWlEO0lBQ25ELGtDQUFrQyxFQUFFLHdCQUF3QjtJQUM1RCxzQkFBc0IsRUFBRSxxQkFBcUI7SUFDN0MsaUNBQWlDLEVBQUUscUJBQXFCO0lBQ3hELHlCQUF5QixFQUFFLG9CQUFvQjtJQUMvQywrQkFBK0IsRUFBRSxTQUFTO0lBQzFDLDZCQUE2QixFQUFFLGtCQUFrQjtJQUNqRCwwQkFBMEIsRUFDeEIseUNBQXlDO0lBQzNDLHFCQUFxQixFQUNuQix1TEFBdUw7SUFDekwscUJBQXFCLEVBQ25CLGtKQUFrSjtDQUNySixDQUFDIn0=
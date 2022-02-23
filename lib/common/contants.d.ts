export declare const PUT_BUCKET_CORS: {
    allowedOrigin: string;
    allowedHeader: string;
    allowedMethod: string[];
}[];
export declare const DEFAULT_SRC: {
    index: string;
    error: string;
};
export declare const CDN_ERRORS: {
    'InvalidDomainName.Malformed': string;
    MissingParameter: string;
    'InvalidCdnType.Malformed': string;
    'InvalidSources.Malformed': string;
    'InvalidSourceType.Malformed': string;
    'InvalidScope.Malformed': string;
    'SourceIp.Exceed': string;
    InvalidCertificate: string;
    'InvalidCertificate.TooLong': string;
    InnerAddDomainDenied: string;
    ExtensiveAndAllBothExist: string;
    CdnTypeNotSupportExtensiveDomain: string;
    'InvalidResourceGroupId.Malformed': string;
    InvalidDomainNameLevel: string;
    'InvalidTopLevelDomain.Malformed': string;
    'TopLevelDomain.NotFound': string;
    'EntityNotExists.ResourceGroup': string;
    'InvalidStatus.ResourceGroup': string;
    NotInternationRealIdentity: string;
    DomainOwnerVerifyFail: string;
    DomainNotRegistration: string;
};
export declare const DEPLOY_HELP_INFO: ({
    header: string;
    content: string;
    optionList?: undefined;
} | {
    header: string;
    optionList: {
        name: string;
        description: string;
        type: BooleanConstructor;
    }[];
    content?: undefined;
} | {
    header: string;
    optionList: {
        name: string;
        description: string;
        alias: string;
        type: BooleanConstructor;
    }[];
    content?: undefined;
} | {
    header: string;
    content: string[];
    optionList?: undefined;
})[];

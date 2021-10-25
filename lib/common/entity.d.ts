export interface ICredentials {
    AccountID?: string;
    AccessKeyID?: string;
    AccessKeySecret?: string;
    SecretID?: string;
    SecretKey?: string;
    SecretAccessKey?: string;
    KeyVaultName?: string;
    TenantID?: string;
    ClientID?: string;
    ClientSecret?: string;
    PrivateKeyData?: string;
}
export interface InputProps {
    props: any;
    credentials: ICredentials;
    appName: string;
    project: {
        component: string;
        access: string;
        projectName: string;
    };
    command: string;
    args: string;
    argsObj: any;
    path: {
        configPath: string;
    };
}
export interface Code {
    /**
     * bucket地址
     */
    ossBucketName?: string;
    /**
     * oss 对象地址
     */
    ossObjectName?: string;
    /**
     * 压缩文件地址
     */
    zipFile: string;
}
export interface CustomContainerConfig {
    /**
     * 容器启动参数。如["-arg1", "value1"]
     */
    args: string;
    /**
     * 容器启动命令。如["/code/myserver"]
     */
    command: string;
    /**
     * 容器镜像地址。如 registry-vpc.cn-hangzhou.aliyuncs.com/fc-demo/helloworld:v1beta1
     */
    image: string;
    /**
     * 是否开启镜像加速。Default：表示开启镜像加速 None：默认值，表示关闭镜像加速。
     */
    accelerationType: string;
}
export interface ComponentInputs {
    project?: Boolean;
    credentials: any;
    props?: any;
    args?: string;
    argsObj: any;
}
/**
 * Global Options
 */
export interface GlobalParams {
    /**
     * Specify key alias.
     * @alias a
     */
    access: boolean;
    /**
     * Display help for command.
     * @alias h
     */
    help?: boolean;
}
/**
 * s cli fc-api createFunction\nAPI Document: https://help.aliyun.com/document_detail/189984.html
 * @pre_help
 * {"header":"Logs","content":"Query the function log. You need to open SLS log service."}
 * @pre_help
 * {"header": "Detail", "content": "Query the function log. You need to open SLS log service."}
 * @after_help
 * {"ref":"GlobalParams"}
 * @example
 * {"header": "Example1","content": [{"desc":"Query the function log. You need to open SLS log service.","example":"$ s exec -- logs -t"},{"desc":"Query the function log. You need to open SLS log service.","example":"$ s exec -- logs -t"}]}
 * @example
 * {"header": "Example2","content": [{"desc":"Query the function log. You need to open SLS log service.","example":"$ s exec -- logs -t"}]}
 */
export interface CreateFunctionInputsProps {
    /**
     * The region of fc endpoint.
     */
    region: string;
    /**
     * Specify the key name.
     */
    access: string;
    /**
     * The json string of props.
     */
    props: string;
    /**
     * The name of the service.
     */
    serviceName: string;
    /**
     * The description of the function.
     */
    functionName: string;
    /**
     * [JSON String] The code of the function. The code must be packaged into a ZIP file.
     */
    code: Code;
    /**
     * [JSON String] The configuration of the custom container runtime. After you configure the custom container runtime, you can use custom container images to execute functions.
     */
    customContainerConfig: CustomContainerConfig;
    /**
     * The description of the function.
     */
    description: string;
    /**
     * The handler of the function. The format is determined by the programming language.
     */
    handler: string;
    /**
     * The timeout period for Function Compute to run the initializer function. Unit: seconds. Default value: 3. Valid values: 1 to 300. When this period expires, the execution of the initializer function is terminated.
     */
    initializationTimeout: number;
    /**
     * The handler of the initializer function. The format is determined by the programming language.
     */
    initializer: string;
    /**
     * The memory size of the function. Unit: MB. The memory size must be a multiple of 64 MB. Instance types have different memory specifications.
     */
    memorySize: number;
    /**
     * The runtime environment of the function. Valid values: nodejs4.4, nodejs6, nodejs8, nodejs10, nodejs12, python2.7, python3, java8, java11, php7.2, dotnetcore2.1, custom, and custom-container.
     */
    runtime: string;
    /**
     * The timeout period for the execution of the function. Unit: seconds. Default value: 60. Valid values: 1 to 600. When this period expires, the execution of the function is terminated.
     */
    timeout: number;
    /**
     * The port on which the HTTP server listens for the custom runtime or custom container runtime.
     */
    caPort: number;
}
export interface CreateFunctionInputs extends ComponentInputs {
    props?: CreateFunctionInputsProps;
}

declare namespace ServerlessDevsReport {
  export interface Oss {
    Region: string;
    Bucket: string;
    Domain?: string;
  }
  export interface ReportData {
    name: string;
    access: string;
    content: Oss;
  }
}

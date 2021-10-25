declare namespace ServerlessDevsReport {
  export interface Website {
    Region: string;
    Bucket: string;
    Domain?: string;
  }
  export interface ReportData {
    name: string;
    access: string;
    content: Website;
  }
}

export default class BaseComponent {
  protected __report(reportData: ServerlessDevsReport.ReportData) {
    if (process && process.send) {
      const { name, content, access } = reportData;
      process.send({
        action: 'resource',
        data: {
          name,
          access,
          content: JSON.stringify(content),
        },
      });
      return content;
    }
  }
}

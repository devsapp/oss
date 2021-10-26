import OssClient from 'ali-oss';
// import path from 'path';

const clinet = new OssClient({
  bucket: 'MY_BUCKET',
  region: 'oss-cn-hangzhou',
  accessKeyId: 'ACCESS_KEY_ID',
  accessKeySecret: 'ACCESS_KEY_SECRET',
});

const demo = async () => {
  const result = await clinet.putBucketWebsite('MY_BUCKET', {
    index: 'index.html',
    error: 'error.html',
  });
  console.log(result);
};
demo();

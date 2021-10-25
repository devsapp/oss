import fs from 'fs-extra';
import { get, isEmpty } from 'lodash';

export default async (inputs: any) => {
  const env = get(inputs, 'props.env', {});
  if (isEmpty(env)) return;
  const publishDir = get(inputs, 'props.src.publishDir');
  const str = `window.env = ${JSON.stringify(env, null, 2)};`;
  fs.writeFileSync(`${publishDir}/env.js`, str);
};

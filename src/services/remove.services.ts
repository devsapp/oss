/* eslint-disable @typescript-eslint/indent */
import { logger, RemoveEndProps } from '../common';
import { InputProps } from '../common/entity';
import * as core from '@serverless-devs/core';
import * as HELP from '../common/remove';
import { includes } from 'lodash';

export const COMMAND: string[] = [
  'service',
  'function',
  'trigger',
  'domain',
  'version',
  'alias',
  'provision',
  'ondemand',
  'onDemand',
  'layer',
  'bucket',
];
interface IRemove {
  props: RemoveEndProps;
  subCommand?:
    | 'layer'
    | 'domain'
    | 'ondemand'
    | 'onDemand'
    | 'provision'
    | 'alias'
    | 'version'
    | 'service'
    | 'function'
    | 'trigger';
}

export default class Remove {
  static async handlerInputs(inputs: InputProps) {
    const parsedArgs: { [key: string]: any } = core.commandParse(inputs, {
      boolean: ['help'],
      alias: { help: 'h' },
    });
    const parsedData = parsedArgs?.data || {};
    const rawData = parsedData._ || [];

    const subCommand = rawData[0] || 'oss';
    logger.debug(`remove subCommand: ${subCommand}`);
    if (!includes(COMMAND, subCommand)) {
      core.help(HELP.REMOVE);
      return { errorMessage: `Does not support ${subCommand} command` };
    }
    if (parsedData.help) {
      rawData[0]
        ? core.help(HELP[`remove_${subCommand}`.toLocaleUpperCase()])
        : core.help(HELP.REMOVE);
      return { help: true, subCommand };
    }

    const props = inputs.props || {};

    const endProps: RemoveEndProps = {
      region: parsedData.region || props.region,
      assumeYes: parsedData['assume-yes'] || parsedData.y,
      onlyLocal: parsedData['use-local'],
      serviceName: parsedData['service-name'] || props.service?.name,
      versionId: parsedData['version-id'] || parsedData.id,
      aliasName: parsedData['alias-name'],
    };

    if (!endProps.region) {
      throw new Error('Not found region');
    }

    return {
      subCommand,
      props: endProps,
      args: props.args,
      table: parsedData.table,
    };
  }

  async remove({ props, subCommand }: IRemove, inputs) {
    console.log('props', props);
    console.log('subCommand', subCommand);
    console.log('inputs', inputs);
  }
}

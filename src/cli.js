import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import yaml from 'js-yaml';

function readFromStdin() {
  return new Promise(res => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    let data = '';
    rl.on('line', line => data += line + '\n');
    rl.on('close', () => res(data));
  });
}

export function cli(args) {
  process.argv = args;
  require('yargs')
  .command(
    'yaml2json [file] [options]',
    'Convert yaml to json',
    yargs => {
      const fileOptions = {
        type: 'string',
        desc: 'File to process',
        required: false,
      };
      yargs
      .positional('file', fileOptions)
      .option('file', {
        ...fileOptions,
        alias: 'f',
      })
      .option('out-file', {
        type: 'string',
        desc: 'Output file',
        alias: 'o',
      });
    },
    async ({
      file: filename,
      'out-file': toFilename,
    }) => {
      try {
        let yamlData;

        if (!filename) {
          yamlData = await readFromStdin();
        } else {
          yamlData = readFileSync(filename, 'utf-8');
        }

        writeFileSync(toFilename || 1, JSON.stringify(yaml.safeLoad(yamlData)));
      } catch (e) {
        console.error(e);
      }
    },
  )
  .command(
    'json2yaml [file] [options]',
    'Convert yaml to json',
    yargs => {
      const fileOptions = {
        type: 'string',
        desc: 'File to process',
        required: false,
      };
      yargs
      .positional('file', fileOptions)
      .option('file', {
        ...fileOptions,
        alias: 'f',
      })
      .option('out-file', {
        type: 'string',
        desc: 'Output file',
        alias: 'o',
      });
    },
    async ({
      file: filename,
      'out-file': toFilename,
    }) => {
      try {
        let jsonData;

        if (!filename) {
          jsonData = await readFromStdin();
        } else {
          jsonData = readFileSync(filename, 'utf-8');
        }

        jsonData = yaml.safeLoad(jsonData);
        writeFileSync(toFilename || 1, yaml.safeDump(jsonData, {
          lineWidth: -1,
        }));
      } catch (e) {
        console.error(e);
      }
    },
  )
  .help().argv;
}

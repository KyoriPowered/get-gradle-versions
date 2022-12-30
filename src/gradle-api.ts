import * as https from 'node:https';

const GRADLE_API = 'services.gradle.org';

export interface VersionInfo {
  id: string;
  buildTime: Date;
  release: boolean;
}

export class VersionType {
  output: string;
  endpointId: string;
  release: boolean;

  constructor(output: string, endpointId: string, release: boolean) {
    this.output = output;
    this.endpointId = endpointId;
    this.release = release;
  }

  endpoint() {
    return '/versions/' + this.endpointId;
  }

  async queryLatest(): Promise<VersionInfo | null> {
    const literalValue = await readToText(this.endpoint());

    if (literalValue.trim() == '') {
      return null;
    }

    const parsed = JSON.parse(literalValue);

    if (
      typeof parsed == 'object' &&
      'version' in parsed &&
      'buildTime' in parsed
    ) {
      return {
        id: parsed.version,
        buildTime: parseDate(parsed.buildTime),
        release: this.release
      };
    } else {
      return null;
    }
  }
}

export const VERSION_TYPES: ReadonlyArray<VersionType> = [
  new VersionType('release', 'current', true),
  new VersionType('rc', 'release-candidate', false),
  new VersionType('nightly', 'nightly', false),
  new VersionType('release_nightly', 'release-nightly', false)
];

// Fetching machinery

function parseDate(date: string): Date {
  // ex. 20221229123250+0000
  //     YYYYMMDDHHMMSS+ZZZZ
  const year = Number(date.substring(0, 4));
  const month = Number(date.substring(4, 6));
  const day = Number(date.substring(6, 8));
  const hour = Number(date.substring(8, 10));
  const minute = Number(date.substring(10, 12));
  const seconds = Number(date.substring(12, 14));
  // const offset = Number(date.substring(15, 19))
  return new Date(Date.UTC(year, month - 1, day, hour, minute, seconds));
}

async function readToText(endpoint: string): Promise<string> {
  // Attempt to fetch content
  return new Promise<string>((resolve, reject) => {
    let data = '';
    https
      .get({ hostname: GRADLE_API, path: endpoint }, res => {
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => resolve(data));
      })
      .on('error', err => reject(err));
  }).then(result => result.trim());
}

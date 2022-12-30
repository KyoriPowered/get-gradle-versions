import * as core from '@actions/core';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { VersionInfo, VERSION_TYPES } from './gradle-api';

const OUTPUT_LATEST_NON_RELEASE = 'latest_rc_or_nightly';

// Utils

const IS_DEBUG = core.getBooleanInput('debug') || false;

/**
 * Log a message to the actions log, but only if debug mode is enabled.
 *
 * @param message the message to log
 */
function debug(message: string): void;

/**
 * Log a template to the actions log, but only if debug mode is enabled.
 *
 * This overload can be used as a template function, skipping full evaluation if debug logging is not occurring
 *
 * @param message the message to log
 */
function debug(literals: TemplateStringsArray, ...templates: string[]): void;
function debug(
  arg: string | TemplateStringsArray,
  ...templates: string[]
): void {
  if (!IS_DEBUG) {
    return;
  }
  if (typeof arg == 'string') {
    core.notice(arg);
  } else {
    core.notice(String.raw({ raw: arg }, ...templates));
  }
}

async function writeLatestToFile(latest: string, targetFile?: string) {
  debug`Discovered latest Gradle version ${latest}`;
  // Then persist the found version
  core.setOutput(OUTPUT_LATEST_NON_RELEASE, latest);

  if (targetFile) {
    const targetDir = path.dirname(targetFile);
    debug`Creating directory ${targetDir}`;
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(
      targetFile,
      latest + '\n' + latest + ':--configuration-cache\n'
    );
  }
}

async function run(): Promise<void> {
  try {
    let target = null;
    const override = core.getInput('override');
    if (override && override != '-') {
      debug`Declared override: ${override}`;
      target = override;
    }

    const versionPromises: Record<string, Promise<VersionInfo | null>> = {};
    for (const type of VERSION_TYPES) {
      versionPromises[type.output] = type.queryLatest();
    }

    for (const [output, infoP] of Object.entries(versionPromises)) {
      const info = await infoP;
      core.setOutput(output, info?.id || '');
    }

    // Prepare latest option
    const rcInfo = await versionPromises['rc'];
    const nightlyInfo = await versionPromises['nightly'];
    if (target == null) {
      if (rcInfo != null) {
        target = rcInfo.id;
      } else {
        target = nightlyInfo?.id;
      }
    }

    if (target != null) {
      writeLatestToFile(target, core.getInput('output_file'));
    } else {
      core.setOutput(OUTPUT_LATEST_NON_RELEASE, '');
      core.notice('No RC or nightly Gradle build found');
    }
  } catch (error: any) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();

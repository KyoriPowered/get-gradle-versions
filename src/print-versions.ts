import { VERSION_TYPES } from './gradle-api';

async function run() {
  for (const type of VERSION_TYPES) {
    console.log(`Checking ${type.output}`);
    const info = await type.queryLatest();
    if (info == null) {
      console.log(`No version available for ${type.output}`);
    } else {
      console.log(
        `Release type ${type.output}: ${info.id} released at ${info.buildTime}`
      );
    }
  }
}

run();

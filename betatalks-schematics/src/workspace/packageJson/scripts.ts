import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { PackageJsonScript } from '../types/package-json';

const scriptsTemplate: PackageJsonScript[] = [
  { name: 'clean', value: 'rimraf dist' },
  { name: 'start:dev', value: 'npm run clean && run-p watch:@libs/common watch:@libs/utils watch:{{DASHERIZE}}' },
  { name: 'watch:@libs/common', value: 'ng build @libs/common --watch --configuration development' },
  { name: 'watch:@libs/utils', value: 'ng build @libs/utils --watch --configuration development' },
  { name: 'watch:{{DASHERIZE}}', value: 'wait-on dist/libs/utils/public-api.d.ts dist/libs/common/public-api.d.ts && npm run start:{{DASHERIZE}}' },
  { name: 'start:{{DASHERIZE}}', value: 'ng serve {{DASHERIZE}}' },
  { name: 'cypress:open:{{DASHERIZE}}', value: 'wait-on http-get://localhost:4200 && ng run {{DASHERIZE}}:cypress-open' },
  { name: 'e2e:{{DASHERIZE}}:open', value: 'ng build @libs/utils && ng build @libs/common && run-p start:{{DASHERIZE}} cypress:open:{{DASHERIZE}}' },
  { name: 'e2e:{{DASHERIZE}}:run', value: 'ng build @libs/utils && ng build @libs/common && ng run {{DASHERIZE}}:cypress-run' },
  { name: 'test:@libs/utils:open', value: 'ng test @libs/utils' },
  { name: 'test:@libs/utils:run', value: 'ng test @libs/utils --no-watch --no-progress --code-coverage --browsers ChromeHeadless' },
  { name: 'test:@libs/common:open', value: 'ng test @libs/common' },
  { name: 'test:@libs/common:run', value: 'ng test @libs/common --no-watch --no-progress --code-coverage --browsers ChromeHeadless' },
  { name: 'test:{{DASHERIZE}}:open', value: 'ng test {{DASHERIZE}}' },
  { name: 'test:{{DASHERIZE}}:run', value: 'ng test {{DASHERIZE}} --no-watch --no-progress --code-coverage --browsers ChromeHeadless' },
  { name: 'build:@libs/common', value: 'ng build @libs/common --configuration production' },
  { name: 'build:@libs/utils', value: 'ng build @libs/utils --configuration production' },
  { name: 'build:{{DASHERIZE}}', value: 'ng build {{DASHERIZE}} --configuration production' },
  { name: 'refreshVSToken', value: 'ng build {{DASHERIZE}} --configuration production' },
];

export function createScripts(name: string): PackageJsonScript[] {
  const dasherizedName = dasherize(name);
  return scriptsTemplate.map(scriptTemplate => ({
    name: scriptTemplate.name.replace(/{{DASHERIZE}}/g, dasherizedName),
    value: scriptTemplate.value.replace(/{{DASHERIZE}}/g, dasherizedName),
  }));
}
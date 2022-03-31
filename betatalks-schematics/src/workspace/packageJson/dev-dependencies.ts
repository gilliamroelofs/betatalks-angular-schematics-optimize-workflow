import { PackageJsonDependency } from '../types/package-json';

export const devDependencies: PackageJsonDependency[] = [
  { name: '@angular-eslint/builder', version: '13.1.0' },
  { name: '@angular-eslint/eslint-plugin', version: '13.1.0' },
  { name: '@angular-eslint/eslint-plugin-template', version: '13.1.0' },
  { name: '@angular-eslint/schematics', version: '13.1.0' },
  { name: '@angular-eslint/template-parser', version: '13.1.0' },
  { name: '@typescript-eslint/eslint-plugin', version: '5.11.0' },
  { name: '@typescript-eslint/parser', version: '5.11.0' },
  { name: '@cypress/schematic', version: '^1.6.0' },
  { name: 'cypress', version: 'latest' },
  { name: 'eslint', version: '^8.2.0' },
  { name: 'ng-packagr', version: '^13.0.0' },
  { name: 'npm-run-all', version: '^4.1.5' },
  { name: 'rimraf', version: '^3.0.2' },
  { name: 'wait-on', version: '^6.0.1' },
];

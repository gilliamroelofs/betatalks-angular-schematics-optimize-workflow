import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('feature', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    collectionPath,
  );

  const workspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '13.2.3',
  };

  const appOptions = {
    name: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    routing: true,
    skipTests: false,
    skipPackageJson: false,
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await runner.runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions).toPromise();
    appTree = await runner.runExternalSchematicAsync('@schematics/angular', 'application', appOptions, appTree).toPromise();
  });

  it('should create a workspace', async () => {
    const tree = await runner
      .runSchematicAsync('feature', { name: 'foo', project: 'bar' }, appTree)
      .toPromise();
    const files = tree.files;

    expect(files).toContain('/projects/bar/src/app/foo/components/foo-sidebar/foo-sidebar.component.ts');
    expect(files).toContain('/projects/bar/src/app/foo/components/foo-header/foo-header.component.ts');
    expect(files).toContain('/projects/bar/src/app/foo/foo.service.ts');
    expect(files).toContain('/projects/bar/src/app/foo/foo.component.ts');
    expect(files).toContain('/projects/bar/src/app/foo/foo.module.ts');
    expect(files).toContain('/projects/bar/src/app/foo/foo-routing.module.ts');
  });

  it('throws error for missing argument name', async () => {
    let errorMessage: string | null = null;
    try {
      await runner
      .runSchematicAsync('feature', {}, Tree.empty())
      .toPromise();
    } catch (error) {
        errorMessage = error.message;
    }
    expect(errorMessage).toBe('option --name is required');
  });
});

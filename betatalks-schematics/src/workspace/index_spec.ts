import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('workspace', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    collectionPath,
  );

  const workspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '13.2.3',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await runner.runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions).toPromise();
  });

  it('should create a workspace', async () => {
    const tree = await runner
      .runSchematicAsync('workspace', { name: 'my-test-app' }, appTree)
      .toPromise();
    const files = tree.files;

    console.log(files);

    expect(files).toContain('/projects/my-test-app/src/app/core/core.module.ts');
    expect(files).toContain('/projects/my-test-app/src/app/shared/shared.module.ts');
    expect(files).toContain('/projects/libs/common/package.json');
    expect(files).toContain('/projects/libs/utils/package.json');
    expect(files).toContain('/.npmrc');
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

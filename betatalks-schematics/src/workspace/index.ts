import { strings } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, Rule, SchematicContext, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { NodeDependency, NodeDependencyType, addPackageJsonDependency } from '@schematics/angular/utility/dependencies';
import { createScripts } from './packageJson/scripts';
import { modify, applyEdits } from 'jsonc-parser';
import { Schema as WorkspaceSchema } from './schema';
import { dependencies } from './packageJson/dependencies';
import { devDependencies } from './packageJson/dev-dependencies';

function updateJsonFile(tree: Tree, pathName: string[], fileName: string, name: string, value: any): void {
  const jsonFile = tree.read(fileName);
  var content = jsonFile?.toString();
  if(content !== undefined) {
    pathName.push(name);
    var edits = modify(content, pathName, value, { formattingOptions: { insertSpaces: true, tabSize: 2, }, });
    content = applyEdits(content, edits);
    tree.overwrite(fileName, content);
  }
}

function createBetatalksWorkspace(name: string): Rule {
  return (_host: Tree, context: SchematicContext) => {
    context.logger.log('info', `Creating your workspace...`);

    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        name
      })
    ]);

    return mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}

function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);

    return host;
  };
}

function createNodeDependence(name: string, version: string, type: NodeDependencyType): NodeDependency {
  return {
    type,
    name,
    version,
    overwrite: true
  };
}

function updatePackageConfig(name: string): Rule {  
  return (host: Tree, context: SchematicContext) => {
    context.logger.log('info', `Updating package.json...`);

    dependencies.forEach(item => {
      const nodeDependency: NodeDependency = createNodeDependence(item.name, item.version, NodeDependencyType.Default);
      context.logger.log('info', `✅️ Added "${item.name}" into ${NodeDependencyType.Default}`);
      addPackageJsonDependency(host, nodeDependency);
    });

    devDependencies.forEach(item => {
      const nodeDependency: NodeDependency = createNodeDependence(item.name, item.version, NodeDependencyType.Dev);
      context.logger.log('info', `✅️ Added "${item.name}" into ${NodeDependencyType.Dev}`);
      addPackageJsonDependency(host, nodeDependency);
    });

    const scripts = createScripts(name);
    scripts.forEach(item => {
      updateJsonFile(host, ['scripts'], 'package.json', item.name, item.value);
      context.logger.log('info', `✅️ Added "${item.name}" into scripts`);
    });

    return host;
  };
}

function removeDefaultSourceFolder(): Rule {
  return (host: Tree, _context: SchematicContext) => {
    if (host.exists('src')) {
      host.delete('src');
    }
  };
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function workspace(options: WorkspaceSchema): Rule {
  if (!options.name) {
    throw new SchematicsException('option --name is required');
  }

  return chain([
    removeDefaultSourceFolder(),
    updatePackageConfig(options.name),
    createBetatalksWorkspace(options.name),
    installPackageJsonDependencies()
  ]);
}

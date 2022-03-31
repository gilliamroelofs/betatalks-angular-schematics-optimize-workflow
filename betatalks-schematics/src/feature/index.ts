import { chain, externalSchematic, Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { Schema as FeatureModuleSchema } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function feature(options: FeatureModuleSchema): Rule {
  return (_host: Tree, context: SchematicContext) => {
    const name = options.name;

    if (!name) {
      throw new SchematicsException('option --name is required');
    }

    const module = options.module ?? 'app';
    const route = options.route ?? name;
    const project = options.project;

    context.logger.log('info', `Adding feature module: ${name}`);

    return chain([
      externalSchematic('@schematics/angular', 'module', { routing: true, route: route, module: module, name: name, project: project }),
      externalSchematic('@schematics/angular', 'component', { name: `${name}/components/${name}-sidebar`, project: project, module: name, style: 'scss' }),
      externalSchematic('@schematics/angular', 'component', { name: `${name}/components/${name}-header`, project: project, module: name, style: 'scss' }),
      externalSchematic('@schematics/angular', 'service', { name: `${name}/${name}`, project: project }),
    ]);
  };
}

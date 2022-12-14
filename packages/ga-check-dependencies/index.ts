import * as core from '@actions/core';
import { addCommentToCurrentPR, Comment } from '@monorepolyser/ga-utils';
import { MainOptions } from '@monorepolyser/dependencies/types';

import { getIncoherentDependencies } from './utils';

const main = async (options?: MainOptions) => {
  const { onlyWarn = false, project, dependenciesToIgnore } = options || {};

  try {
    const { incoherentDependencies, deps } = getIncoherentDependencies(project, dependenciesToIgnore);

    const repeatedDeps = Object.keys(incoherentDependencies);

    if (repeatedDeps.length > 0) {
      const comment = new Comment();

      comment.addTitle({
        title: 'Dependencies check',
        level: 2,
      });
      comment.addText({
        text:
          'Some of the packages in your monorepo use different dependencies, which can lead to multiple versions ending up in your production bundle',
      });

      const rows: string[][] = [];
      repeatedDeps.forEach((repeatedDep) => {
        const versions = incoherentDependencies[repeatedDep];
        versions.forEach((v) => {
          const row = [repeatedDep, v.addedBy, v.version, deps[repeatedDep]];
          rows.push(row);
        });
      });

      comment.addTable({
        columns: ['Dependency', 'Added by', 'Added version', 'Base Version'],
        rows,
      });

      addCommentToCurrentPR(comment);

      if (!onlyWarn) {
        throw new Error('There are deps with different versions');
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('All packages are using the same versions of their dependencies!');
    }
  } catch (error) {
    if (!onlyWarn) {
      core.setFailed(error.message);
    }
  }
};

export { main };

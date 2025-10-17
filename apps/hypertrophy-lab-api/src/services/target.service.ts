import * as repo from '../repositories/targets.repo.js';

export async function createTarget(data: {
  slug: string;
  name: string;
  group: string;
  color?: string | null;
  icon?: string | null;
}) {
  return repo.createTarget(data);
}

export async function listTargets() {
  return repo.listTargets();
}
//

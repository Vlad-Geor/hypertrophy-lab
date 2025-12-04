import { Router } from 'express';
import * as groups from '../controllers/groups.controller.js';
import * as inventory from '../controllers/group-inventory.controller.js';

const r = Router();

r.get('/', groups.listGroups);
r.post('/', groups.createGroup);

r.get('/:groupId/members', groups.listMembers);
r.post('/:groupId/members', groups.addMember);

r.get('/:groupId/supplements', inventory.listSupplements);
r.get('/:groupId/supplements/:supplementId', inventory.getSupplement);
r.post('/:groupId/supplements', inventory.createSupplement);
r.patch('/:groupId/supplements/:supplementId', inventory.patchSupplement);
r.delete('/:groupId/supplements/:supplementId', inventory.archiveSupplement);

r.post('/:groupId/supplements/:supplementId/batches', inventory.addBatch);
r.patch('/:groupId/batches/:batchId', inventory.updateBatch);
r.delete('/:groupId/batches/:batchId', inventory.deleteBatch);

r.post('/:groupId/consumptions', inventory.recordConsumption);

export default r;

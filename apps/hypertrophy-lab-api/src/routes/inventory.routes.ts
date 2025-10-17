import { Router } from 'express';
import * as ctl from '../controllers/inventory.controller.js';

const r = Router();

// inventory
r.get('/', ctl.list);
r.get('/:id', ctl.getOne);
r.post('/', ctl.add);
r.post('/bulk-existing', ctl.addBulkExisting)
r.patch('/:id', ctl.patch);
r.delete('/:id', ctl.remove);

// batches
r.post('/:id/batches', ctl.addBatch);
r.patch('/batches/:batchId', ctl.updateBatch);
r.delete('/batches/:batchId', ctl.deleteBatch);

// helpers
r.get('/helpers/low-stock', ctl.lowStock);
r.get('/helpers/expiring-soon', ctl.expiringSoon);

export default r;

/** @format */

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { SupplementService } from '../services/supplement.service';

const supplementService = new SupplementService();

export class SupplementController {
	public static async getOne(req: Request, res: Response, next: NextFunction) {
		try {
			const id = parseInt(req.params.id, 10);
			const supplement = await supplementService.getSupplementById(id);

			if (!supplement) {
				res.status(404).json({ message: 'Supplement not found' });
			}
			res.json(supplement);
		} catch (error) {
			res.status(500).json({ error: (error as Error).message });
		}
	}

	public static async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const supplements = await supplementService.getAllSupplements();
			res.send(supplements);
		} catch (error) {
			res.status(500).json({ error: (error as Error).message });
		}
	}

	public static async create(req: Request, res: Response, next: NextFunction) {
		try {
			const newSupplement = await supplementService.createSupplement(req.body);
			res.status(201).json(newSupplement);
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	}

	public static async update(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id, 10);
			const updatedSupplement = await supplementService.updateSupplement(id, req.body);

			if (!updatedSupplement) {
				res.status(404).json({ message: 'Supplement not found' });
			}
			res.json(updatedSupplement);
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	}

	public static async delete(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id, 10);
			const success = await supplementService.deleteSupplement(id);

			if (!success) {
				res.status(404).json({ message: 'Supplement not found' });
			}
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ error: (error as Error).message });
		}
	}
}

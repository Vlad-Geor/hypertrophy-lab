/** @format */

// Helper to convert a single camelCase string to snake_case
function camelToSnake(str: string): string {
	return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// Recursively convert all keys of an object (or array of objects) to snake_case
export function toSnakeCase(obj: any): any {
	if (obj === null || typeof obj !== 'object') {
		return obj; // Return the value if obj is not an object
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => toSnakeCase(item));
	}

	const newObj: Record<string, any> = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const newKey = camelToSnake(key);
			newObj[newKey] = toSnakeCase(obj[key]);
		}
	}
	return newObj;
}

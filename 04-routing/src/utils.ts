import { type Request } from 'express';

let id: number = 22;

export function getId() {
	return id++;
}

export function logRequest(req: Request) {
	console.log();
	console.log('-------------------');
	console.log('Request');
	console.log('- Method: ' + req.method);
	console.log('- URL:    ' + req.url);
	console.log('- Body:   ' + JSON.stringify(req.body, null, 2));
	console.log('-------------------');
	console.log();
}
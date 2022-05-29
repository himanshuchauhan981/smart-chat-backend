import jwt from 'jsonwebtoken';
import { JWTPayload } from '../interfaces/jwt';

import Locals from '../server/Locals';

class JWTService {
	signJWT(payload: JWTPayload) {
		const secret: string = Locals.config().jwt_secret;

		return jwt.sign(payload, secret);
	};

	decode(token: string) {
		const secret = Locals.config().jwt_secret;

		return jwt.verify(token, secret);
	};
};

export default JWTService;
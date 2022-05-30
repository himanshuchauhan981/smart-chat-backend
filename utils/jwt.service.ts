import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '../interfaces/jwt';

import Locals from '../server/Locals';

class JWTService {
	signJWT(payload: JWTPayload) {
		const secret: string = Locals.config().jwt_secret;

		const signOption: SignOptions = {
			expiresIn: '2h'
		};

		return jwt.sign(payload, secret, signOption);
	};

	decode(token: string) {
		const secret = Locals.config().jwt_secret;

		return jwt.verify(token, secret);
	};
};

export default JWTService;
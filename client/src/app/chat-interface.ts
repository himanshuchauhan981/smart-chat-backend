export interface UserDetails {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface DecodedToken {
  expiresIn?: string;
  id?: string;
  iat?: Number;
}

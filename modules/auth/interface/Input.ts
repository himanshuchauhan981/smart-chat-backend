interface LoginInput {
  username: string;
  password: string;
}

interface SignUpInput {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export { LoginInput, SignUpInput };
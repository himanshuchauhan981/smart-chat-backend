interface LoginInput {
  userName: string;
  password: string;
}

interface SignUpInput {
  fullName: string;
  userName: string;
  password: string;
  email: string;
}

export { LoginInput, SignUpInput };
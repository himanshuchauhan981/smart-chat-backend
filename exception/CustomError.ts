class CustomError {
  message: string;
  status: number;

  constructor(message: string, status: number = 500) {
    this.message = message;
    this.status = status;
  }

}

export default CustomError;
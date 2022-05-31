class CustomError {
  message: string;
  status: number;
  description: string;

  constructor(message: string, status: number = 500, description: string = '') {
    this.message = message;
    this.status = status;
    this.description = description;
  }

}

export default CustomError;
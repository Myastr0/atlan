export default class AtlError extends Error {
  public helpMessage?: string;

  constructor(message: string, helpMessage?: string) {
    super(message);
    this.name = 'AtlError';
    this.helpMessage = helpMessage;
  }
}

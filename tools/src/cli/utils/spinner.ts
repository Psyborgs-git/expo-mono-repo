import ora, { Ora } from 'ora';

export class Spinner {
  private spinner: Ora;

  constructor(text: string) {
    this.spinner = ora(text);
  }

  start(text?: string): void {
    if (text) {
      this.spinner.text = text;
    }
    this.spinner.start();
  }

  succeed(text?: string): void {
    this.spinner.succeed(text);
  }

  fail(text?: string): void {
    this.spinner.fail(text);
  }

  warn(text?: string): void {
    this.spinner.warn(text);
  }

  info(text?: string): void {
    this.spinner.info(text);
  }

  stop(): void {
    this.spinner.stop();
  }

  updateText(text: string): void {
    this.spinner.text = text;
  }
}

export function createSpinner(text: string): Spinner {
  return new Spinner(text);
}
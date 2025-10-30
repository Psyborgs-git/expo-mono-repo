import inquirer from 'inquirer';

export interface PromptChoice {
  name: string;
  value: any;
  short?: string;
}

export class Prompts {
  static async confirm(message: string, defaultValue = false): Promise<boolean> {
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message,
        default: defaultValue,
      },
    ]);
    return confirmed;
  }

  static async select(message: string, choices: PromptChoice[]): Promise<any> {
    const { selected } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selected',
        message,
        choices,
      },
    ]);
    return selected;
  }

  static async multiSelect(message: string, choices: PromptChoice[]): Promise<any[]> {
    const { selected } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message,
        choices,
      },
    ]);
    return selected;
  }

  static async input(message: string, defaultValue?: string): Promise<string> {
    const { value } = await inquirer.prompt([
      {
        type: 'input',
        name: 'value',
        message,
        default: defaultValue,
      },
    ]);
    return value;
  }

  static async password(message: string): Promise<string> {
    const { value } = await inquirer.prompt([
      {
        type: 'password',
        name: 'value',
        message,
      },
    ]);
    return value;
  }
}
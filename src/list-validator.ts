import { File } from './list-types';

export default interface IListValidator {
  /**
   * Validates given file and its properties
   * @param file The source file id
   */
  isValidFile(file: File): boolean;

  /**
   * Validates given file as a folder and validates its properties
   * @param file The source file id
   */
  isValidFolder(file: File): boolean;

  /**
   * Validates list method
   * @param source The source file id
   * @param source The destination folder id
   */
  validateInput(source: string, destination?: string): boolean;
}

export class ListValidator implements IListValidator {
  private idPattern = /^[1-9]+\d*$/;

  private fileNamePattern = /^(File+\s+[1-9]+\d*$)$/;

  private folderNamePattern = /^(Folder+\s+[1-9]+\d*$)$/;

  private validateSource(source: string) {
    const isSourceValid = this.idPattern.test(source);
    if (!isSourceValid) {
      throw new Error('Source is not valid');
    }
  }

  private validateDestination(source: string) {
    const isDestinationValid = this.idPattern.test(source);
    if (!isDestinationValid) {
      throw new Error('Destination is not valid');
    }
  }

  public validateInput(source: string, destination?: string): boolean {
    this.validateSource(source);
    if (typeof destination === 'string') {
      this.validateDestination(destination);
    }
    return true;
  }

  public isValidFile(file: File): boolean {
    const isIdPatternValid = this.idPattern.test(file.id);
    const isFilePatternValid = this.fileNamePattern.test(file.name);
    return isIdPatternValid && isFilePatternValid;
  }

  public isValidFolder(file: File): boolean {
    const isIdPatternValid = this.idPattern.test(file.id);
    const isFilePatternValid = this.folderNamePattern.test(file.name);
    return isIdPatternValid && isFilePatternValid;
  }
}

import { File } from './list-types';

export default interface IListValidator {
  /**
   * Checks if given source is valid or not
   * @param source The source id parameter to check
   */
  isValidSource(source: string): boolean;

  /**
   * Checks if given destination is valid or not
   * @param destination The source id parameter to check
   */
  isValidDestination(destination: string): boolean;

  /**
   * Checks if given file is a valid file or not
   * @param file The source file id
   */
  isValidFile(file: File): boolean;

  /**
   * Checks if given file is a valid folder or not (at this point folder flattened to a file).
   * @param file The source file id
   */
  isValidFolder(file: File): boolean;
}

export class ListValidator implements IListValidator {
  private idPattern = /^[1-9]+\d*$/;

  private fileNamePattern = /^(File+\s+[1-9]+\d*$)$/;

  private folderNamePattern = /^(Folder+\s+[1-9]+\d*$)$/;

  public isValidSource(source: string): boolean {
    if (!this.idPattern.test(source)) throw new Error('Source is not valid');
    return true;
  }

  public isValidDestination(destination: string): boolean {
    if (!this.idPattern.test(destination)) throw new Error('Destination is not valid');
    return true;
  }

  public isValidFile(file: File): boolean {
    return this.idPattern.test(file.id) && this.fileNamePattern.test(file.name);
  }

  public isValidFolder(file: File): boolean {
    return this.idPattern.test(file.id) && this.folderNamePattern.test(file.name);
  }
}

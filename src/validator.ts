import { List, File, Indexes, ValidIndexes } from './types';

export default class Validator {
  private idRegex: RegExp;

  private folderNameRegex: RegExp;

  private fileNameRegex: RegExp;

  constructor() {
    this.idRegex = /^[1-9]+\d*$/;
    this.folderNameRegex = /^(Folder+\s+[1-9]+\d*$)$/;
    this.fileNameRegex = /^(File+\s+[1-9]+\d*$)$/;
  }

  validateList = (list: List): boolean => {
    if (!list.length) {
      throw new Error('List cannot be empty');
    } else {
      return true;
    }
  };

  validateParameters = (source: string, destination: string): boolean => {
    if (source === destination) {
      throw new Error('Given parameters cannot have the same value');
    } else if (this.idRegex.test(source) === false || this.idRegex.test(destination) === false) {
      throw new Error('Given parameters are not valid');
    } else {
      return true;
    }
  };

  validateFolder = (file: File): boolean => {
    return this.idRegex.test(file.id) && this.folderNameRegex.test(file.name);
  };

  validateFile = (file: File): boolean => {
    return this.idRegex.test(file.id) && this.fileNameRegex.test(file.name);
  };

  validateMovedFile = (movedFile: File | undefined): File => {
    if (movedFile === undefined) {
      throw new Error('Moved file is undefined');
    } else return movedFile;
  };

  validateIndexes = (indexes: Indexes): ValidIndexes => {
    const {
      sourceFolderIndex,
      sourceFileIndex,
      destinationFolderIndex,
      destinationFileIndex,
    } = indexes;

    if (sourceFolderIndex == null || destinationFolderIndex == null) {
      throw new Error('Folder indexes cannot be null');
    } else if (sourceFolderIndex === destinationFolderIndex) {
      throw new Error('File cannot be moved to its own folder');
    } else if (sourceFileIndex == null) {
      throw new Error('Folder cannot be moved');
    } else if (destinationFileIndex != null) {
      throw new Error('Destination cannot be a file');
    }

    return indexes as ValidIndexes;
  };
}

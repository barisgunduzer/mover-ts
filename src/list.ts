import { List, FlatList, ListMap, Location, File } from './list-types';
import IListValidator from './list-validator';

export default interface IListImpl {
  /**
   * This method gets file from source folder
   * @param source The source file id
   */
  getFile(source: string): File;

  /**
   * This method adds file to the destination folder
   * @param file Added file
   * @param destination The destination folder id
   */
  addFile(file: File, destination: string): boolean;

  /**
   * This method moves file from source folder to the destination folder
   * @param source The source file id
   * @param destination The destination folder id
   */
  moveFile(source: string, destination: string): List;

  /**
   * This method removes file from source folder
   * @param source The source file id
   */
  removeFile(source: string): File;
}

export class ListImpl implements IListImpl {
  private list: List;

  private listMap: ListMap;

  private listValidator: IListValidator;

  constructor(list: List, listValidator: IListValidator) {
    if (!list.length) {
      throw new Error('List cannot be empty');
    }
    this.list = list;
    this.listMap = new Map<string, Location>();
    this.listValidator = listValidator;
    this.setListMap();
  }

  private flattenList(): FlatList {
    const flatList: FlatList = [];
    this.list.forEach((folder) => {
      const flatFolder: File = { id: folder.id, name: folder.name };
      flatList.push(flatFolder, ...folder.files);
    });
    return flatList;
  }

  private isIdExist(source: string): boolean {
    if (this.listMap.has(source)) {
      throw new Error("ID's are not unique in given list");
    } else {
      return true;
    }
  }

  private setListMap(): boolean {
    let [folderIndex, fileIndex] = [-1, -1];
    const flatList = this.flattenList();
    flatList.forEach((file) => {
      this.isIdExist(file.id);
      if (this.listValidator.isValidFolder(file)) {
        [fileIndex, folderIndex] = [-1, folderIndex + 1];
        this.listMap.set(file.id, { folderIndex, fileIndex });
      } else if (this.listValidator.isValidFile(file)) {
        fileIndex += 1;
        this.listMap.set(file.id, { folderIndex, fileIndex });
      } else {
        throw new Error('Some properties are not valid in given list');
      }
    });
    return true;
  }

  private getLocation(source: string): Location {
    const location = this.listMap.get(source);
    if (location === undefined) {
      throw new Error('Location not found');
    } else {
      return location;
    }
  }

  public getFile(source: string): File {
    this.listValidator.validateInput(source);
    const { folderIndex, fileIndex } = this.getLocation(source);
    if (fileIndex === -1) {
      throw new Error('File cannot be get, requested file id but folder id given');
    }
    const { files } = this.list[folderIndex];
    return files[fileIndex];
  }

  public addFile(file: File, destination: string): boolean {
    this.listValidator.validateInput(destination);
    const { folderIndex, fileIndex } = this.getLocation(destination);
    if (fileIndex !== -1) {
      throw new Error('File cannot be added, requested folder id but file id given.');
    }
    const { files } = this.list[folderIndex];
    files.push(file);
    const newFileIndex = files.length - 1;
    this.listMap.set(file.id, { folderIndex, fileIndex: newFileIndex });
    return true;
  }

  public moveFile(source: string, destination: string): List {
    this.listValidator.validateInput(source, destination);
    const sourceIndexes = this.getLocation(source);
    const destinationIndexes = this.getLocation(destination);
    if (sourceIndexes.folderIndex === destinationIndexes.folderIndex) {
      throw new Error('File cannot be moved to its own folder');
    }
    const file = this.removeFile(source);
    this.addFile(file, destination);
    return this.list;
  }

  public removeFile(source: string): File {
    this.listValidator.validateInput(source);
    const sourceIndexes = this.getLocation(source);
    const { folderIndex, fileIndex } = sourceIndexes;
    if (fileIndex === -1) {
      throw new Error('File cannot be moved or removed, requested file id but folder id given');
    }
    const { files } = this.list[folderIndex];
    const removedFile = files.splice(fileIndex, 1)[0];
    files.slice(fileIndex).forEach((file, newFileIndex) => {
      this.listMap.set(file.id, { folderIndex, fileIndex: newFileIndex });
    });
    return removedFile;
  }
}

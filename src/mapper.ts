import { List, FlatList, ListMap, Location, Indexes, ValidIndexes } from './types';

import Validator from './validator';

export default class Mapper {
  private listMap: ListMap;

  private validator: Validator;

  constructor() {
    this.listMap = new Map<string, Location>();
    this.validator = new Validator();
  }

  mapList = (flatlist: FlatList): boolean => {
    let [folderIndex, fileIndex] = [-1, -1];

    const checkID = (id: string) => {
      if (this.listMap.has(id)) {
        throw new Error("ID's are not unique in given list");
      } else {
        return true;
      }
    };

    flatlist.forEach((file) => {
      checkID(file.id);
      if (this.validator.validateFolder(file)) {
        fileIndex = -1;
        folderIndex += 1;
        this.listMap.set(file.id, { folderIndex, fileIndex: null });
      } else if (this.validator.validateFile(file)) {
        fileIndex += 1;
        this.listMap.set(file.id, { folderIndex, fileIndex });
      } else {
        throw new Error('Some expressions are not correct in given list');
      }
    });
    return true;
  };

  getLocation = (id: string): Location => {
    const location = this.listMap.get(id);
    if (location === undefined) {
      throw new Error(`Location not found`);
    }
    return location;
  };

  getIndexes = (source: string, destination: string): ValidIndexes => {
    const sourceFileLocation = this.getLocation(source);
    const destinationFolderLocation = this.getLocation(destination);

    const indexes: Indexes = {
      sourceFolderIndex: sourceFileLocation?.folderIndex,
      sourceFileIndex: sourceFileLocation?.fileIndex,
      destinationFolderIndex: destinationFolderLocation?.folderIndex,
      destinationFileIndex: destinationFolderLocation?.fileIndex,
    };

    return this.validator.validateIndexes(indexes);
  };

  updateFolderIndexes = (
    list: List,
    sourceFolderIndex: number,
    sourceFileIndex: number,
  ): boolean => {
    const { files: sourceFolder } = list[sourceFolderIndex];
    sourceFolder.slice(sourceFileIndex).forEach((file, fileIndex) => {
      this.listMap.set(file.id, { folderIndex: sourceFolderIndex, fileIndex });
    });
    return true;
  };

  updateFileLocation = (list: List, source: string, newFolderIndex: number): boolean => {
    this.listMap.set(source, {
      folderIndex: newFolderIndex,
      fileIndex: list[newFolderIndex].files.length - 1,
    });
    return true;
  };
}

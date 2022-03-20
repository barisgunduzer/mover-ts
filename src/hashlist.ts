import { List, FlatList } from './types';

import Mapper from './mapper';
import Validator from './validator';

export default class HashList {
  private list: List;

  private mapper: Mapper;

  private validator: Validator;

  private once: boolean;

  constructor(list: List) {
    this.list = list;
    this.once = false;
    this.mapper = new Mapper();
    this.validator = new Validator();
  }

  /**
   * This method carries file to the destination folder
   * @param source The source file id
   * @param destination The destination folder id
   */

  move(source: string, destination: string): List {
    this.validator.validateParameters(source, destination);

    let flatList: FlatList = [];

    const flattenList = (list: List): FlatList => {
      list.forEach((folder) => {
        const seperator = { id: folder.id, name: folder.name };
        flatList.push(seperator, ...folder.files);
      });
      return flatList;
    };

    if (!this.once) {
      this.validator.validateList(this.list);
      flatList = flattenList(this.list);
      this.mapper.mapList(flatList);
      this.once = true;
    }

    const indexes = this.mapper.getIndexes(source, destination);

    const getFile = () => {
      const { files: sourceFolder } = this.list[indexes.sourceFolderIndex];
      const file = sourceFolder.splice(indexes.sourceFileIndex, 1).pop();
      return this.validator.validateMovedFile(file);
    };

    const movedFile = getFile();

    this.mapper.updateFolderIndexes(this.list, indexes.sourceFolderIndex, indexes.sourceFileIndex);

    const moveFile = () => {
      const { files: destinationFolder } = this.list[indexes.destinationFolderIndex];
      destinationFolder.push(movedFile);
      this.mapper.updateFileLocation(this.list, source, indexes.destinationFolderIndex);
    };

    moveFile();

    return this.list;
  }
}

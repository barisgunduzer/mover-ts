export type List = Folder[];

export type FlatList = File[];

export type ListMap = Map<string, Location>;

export type File = { id: string; name: string };

export type Folder = { id: string; name: string; files: File[] };

export type Location = { folderIndex: number; fileIndex: number | null };

export type Indexes = {
  sourceFolderIndex: number;
  sourceFileIndex: number | null;
  destinationFolderIndex: number;
  destinationFileIndex: number | null;
};

export type ValidIndexes = {
  sourceFolderIndex: number;
  sourceFileIndex: number;
  destinationFolderIndex: number;
  destinationFileIndex: number;
};

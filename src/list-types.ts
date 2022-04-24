export type List = Folder[];

export type Folder = { id: string; name: string; files: File[] };

export type File = { id: string; name: string };

export type FlatList = File[];

export type ListMap = Map<string, Location>;

export type Location = { folderIndex: number; fileIndex: number };

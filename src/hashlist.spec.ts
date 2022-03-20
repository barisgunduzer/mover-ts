import { List } from './types';

import HashList from './hashlist';

describe('move', () => {
  it('moves given file to another folder', () => {
    const list: List = [
      {
        id: '1',
        name: 'Folder 1',
        files: [
          { id: '2', name: 'File 1' },
          { id: '3', name: 'File 2' },
          { id: '4', name: 'File 3' },
          { id: '5', name: 'File 4' },
        ],
      },
      {
        id: '6',
        name: 'Folder 2',
        files: [{ id: '7', name: 'File 5' }],
      },
    ];

    const result = [
      {
        id: '1',
        name: 'Folder 1',
        files: [
          { id: '2', name: 'File 1' },
          { id: '3', name: 'File 2' },
          { id: '5', name: 'File 4' },
        ],
      },
      {
        id: '6',
        name: 'Folder 2',
        files: [
          { id: '7', name: 'File 5' },
          { id: '4', name: 'File 3' },
        ],
      },
    ];

    const hashedList = new HashList(list);
    expect(hashedList.move('4', '6')).toStrictEqual(result);
  });

  it('throws error if given list is empty', () => {
    const list: List = [];

    const newList = new HashList(list);
    expect(() => newList.move('1', '2')).toThrow('List cannot be empty');
  });

  it('throws error if given source parameter is not valid', () => {
    const list: List = [
      {
        id: '1',
        name: 'Folder 1',
        files: [{ id: '2', name: 'File 1' }],
      },
      { id: '3', name: 'Folder 2', files: [{ id: '4', name: 'File 2' }] },
    ];

    const hashedList = new HashList(list);
    expect(() => hashedList.move('', '3')).toThrow('Given parameters are not valid');
  });

  it('throws error if given destination parameter is not valid', () => {
    const list: List = [
      {
        id: '1',
        name: 'Folder 1',
        files: [{ id: '2', name: 'File 1' }],
      },
      { id: '3', name: 'Folder 2', files: [{ id: '4', name: 'File 2' }] },
    ];

    const hashedList = new HashList(list);
    expect(() => hashedList.move('2', '')).toThrow('Given parameters are not valid');
  });

  it('throws error if given destination and source are the same', () => {
    const list: List = [
      {
        id: '1',
        name: 'Folder 1',
        files: [{ id: '2', name: 'File 1' }],
      },
      { id: '3', name: 'Folder 2', files: [{ id: '4', name: 'File 2' }] },
    ];

    const hashedList = new HashList(list);
    expect(() => hashedList.move('2', '2')).toThrow('Given parameters cannot have the same value');
  });

  it('throws error if given list has incorrect folder infos', () => {
    const list: List = [
      {
        id: '',
        name: '',
        files: [{ id: '2', name: 'File 1' }],
      },
      { id: '3', name: 'Folder 2', files: [{ id: '4', name: 'File 2' }] },
    ];

    const hashedList = new HashList(list);
    expect(() => hashedList.move('1', '2')).toThrow(
      'Some expressions are not correct in given list',
    );
  });

  it('throws error if given list has incorrect file infos', () => {
    const list: List = [
      {
        id: '1',
        name: 'Folder 1',
        files: [{ id: '', name: '' }],
      },
      { id: '3', name: 'Folder 2', files: [{ id: '4', name: 'File 2' }] },
    ];

    const hashedList = new HashList(list);
    expect(() => hashedList.move('1', '2')).toThrow(
      'Some expressions are not correct in given list',
    );
  });

  it('throws error if given list has duplicate ids', () => {
    const list: List = [
      {
        id: '1',
        name: 'Folder 1',
        files: [{ id: '2', name: 'File 1' }],
      },
      { id: '1', name: 'Folder 2', files: [{ id: '3', name: 'File 2' }] },
      { id: '3', name: 'Folder 3', files: [{ id: '4', name: 'File 3' }] },
    ];

    const hashedList = new HashList(list);
    expect(() => hashedList.move('2', '3')).toThrow("ID's are not unique in given list");
  });

  it("throws error if given destination is the file's own directory", () => {
    const list: List = [
      {
        id: '1',
        name: 'Folder 1',
        files: [{ id: '2', name: 'File 1' }],
      },
      { id: '3', name: 'Folder 2', files: [{ id: '4', name: 'File 2' }] },
    ];

    const hashedList = new HashList(list);
    expect(() => hashedList.move('2', '1')).toThrow('File cannot be moved to its own folder');
  });

  it('throws error if given destination not a file', () => {
    const list: List = [
      {
        id: '1',
        name: 'Folder 1',
        files: [{ id: '2', name: 'File 1' }],
      },
      { id: '3', name: 'Folder 2', files: [{ id: '4', name: 'File 2' }] },
    ];

    const hashedList = new HashList(list);
    expect(() => hashedList.move('2', '4')).toThrow('Destination cannot be a file');
  });

  it('throws error if given destination not found', () => {
    const list: List = [
      {
        id: '1',
        name: 'Folder 1',
        files: [{ id: '2', name: 'File 1' }],
      },
      { id: '3', name: 'Folder 2', files: [{ id: '4', name: 'File 2' }] },
    ];

    const hashedList = new HashList(list);
    expect(() => hashedList.move('1', '3')).toThrow('Folder cannot be moved');
  });

  it('throws error if given source not found in given list', () => {
    const list: List = [
      {
        id: '1',
        name: 'Folder 1',
        files: [{ id: '2', name: 'File 1' }],
      },
      { id: '3', name: 'Folder 2', files: [{ id: '4', name: 'File 2' }] },
    ];

    const hashedList = new HashList(list);
    expect(() => hashedList.move('5', '1')).toThrow('Location not found');
  });

  it('throws error if given destination not found in given list', () => {
    const list: List = [
      {
        id: '1',
        name: 'Folder 1',
        files: [{ id: '2', name: 'File 1' }],
      },
      { id: '3', name: 'Folder 2', files: [{ id: '4', name: 'File 2' }] },
    ];

    const hashedList = new HashList(list);
    expect(() => hashedList.move('2', '5')).toThrow('Location not found');
  });
});

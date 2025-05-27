import { getItem, setItem } from './storage';

// Mock localStorage for testing environment
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// windowオブジェクトが利用可能であることを確認してからlocalStorageをモックする
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
}

describe('localStorage helpers', () => {
  beforeEach(() => {
    // localStorageがモックされていることを確認
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.clear();
    }
    vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error during tests
  });

  afterEach(() => {
    vi.mocked(console.error).mockRestore();
  });

  describe('setItem', () => {
    it('should store a string value', () => {
      setItem('myKey', 'myValue');
      expect(localStorage.getItem('myKey')).toBe(JSON.stringify('myValue'));
    });

    it('should store an object value', () => {
      const myObject = { a: 1, b: 'test' };
      setItem('myObjectKey', myObject);
      expect(localStorage.getItem('myObjectKey')).toBe(JSON.stringify(myObject));
    });

    it('should store a number value', () => {
      setItem('myNumberKey', 123);
      expect(localStorage.getItem('myNumberKey')).toBe(JSON.stringify(123));
    });

    it('should store a boolean value', () => {
      setItem('myBooleanKey', true);
      expect(localStorage.getItem('myBooleanKey')).toBe(JSON.stringify(true));
    });
  });

  describe('getItem', () => {
    it('should retrieve a stored string value', () => {
      const value = 'testString';
      localStorage.setItem('myKey', JSON.stringify(value));
      expect(getItem('myKey', 'fallback')).toBe(value);
    });

    it('should retrieve a stored object value', () => {
      const value = { id: 1, name: 'Test' };
      localStorage.setItem('myObjectKey', JSON.stringify(value));
      expect(getItem('myObjectKey', { id: 0, name: '' })).toEqual(value);
    });

    it('should return fallback for a non-existent key', () => {
      expect(getItem('nonExistentKey', 'fallbackValue')).toBe('fallbackValue');
    });

    it('should return fallback for a number if key does not exist', () => {
      expect(getItem('nonExistentNumber', 0)).toBe(0);
    });

    it('should return fallback for an object if key does not exist', () => {
      const fallbackObj = { default: true };
      expect(getItem('nonExistentObject', fallbackObj)).toEqual(fallbackObj);
    });

    it('should return fallback and log error for corrupted JSON', () => {
      localStorage.setItem('corruptedKey', 'this is not json');
      const fallback = 'fallbackForCorrupted';
      expect(getItem('corruptedKey', fallback)).toBe(fallback);
      expect(console.error).toHaveBeenCalled();
    });

    it('should return fallback and log error for another corrupted JSON (object)', () => {
      localStorage.setItem('corruptedObjectKey', '{a:1,b:'); // Malformed JSON
      const fallbackObj = { error: true };
      expect(getItem('corruptedObjectKey', fallbackObj)).toEqual(fallbackObj);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
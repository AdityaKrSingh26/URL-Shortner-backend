// Basic test to verify Jest is working
describe('Basic Test Suite', () => {
  test('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should handle string operations', () => {
    const str = 'Hello World';
    expect(str).toContain('World');
    expect(str.length).toBe(11);
  });

  test('should handle array operations', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr).toHaveLength(5);
    expect(arr).toContain(3);
    expect(arr[0]).toBe(1);
  });

  test('should handle object operations', () => {
    const obj = { name: 'test', value: 42 };
    expect(obj).toHaveProperty('name');
    expect(obj.name).toBe('test');
    expect(obj.value).toBe(42);
  });
});

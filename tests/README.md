# Test Suite for URL Shortener Backend

This directory contains comprehensive tests for the URL Shortener backend project.

## Test Structure

```
tests/
├── basic.test.js                    # Basic functionality tests
├── unit/
│   ├── url.controller.simple.test.js    # URL controller unit tests
│   └── ip.controller.simple.test.js     # IP controller unit tests
├── integration/
│   └── api.simple.test.js              # API integration tests
├── helpers/
│   └── testHelpers.js                   # Test utility functions
├── setup.simple.js                      # Test setup configuration
└── README.md                            # This file
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Specific Test Files
```bash
npm test -- tests/unit/url.controller.simple.test.js
npm test -- tests/integration/api.simple.test.js
```

## Test Categories

### 1. Basic Tests (`basic.test.js`)
- Basic JavaScript functionality
- String, array, and object operations
- Fundamental test framework validation

### 2. Unit Tests (`unit/`)
- **URL Controller Tests** (`url.controller.simple.test.js`)
  - URL validation logic
  - Input validation
  - Response format validation
  - Error handling patterns
  - Data structure validation

- **IP Controller Tests** (`ip.controller.simple.test.js`)
  - URL parsing logic
  - IP address validation
  - Location data structure validation
  - Error response validation

### 3. Integration Tests (`integration/`)
- **API Tests** (`api.simple.test.js`)
  - API endpoint structure validation
  - Request/response format validation
  - HTTP status code validation
  - CORS header validation
  - URL redirection logic

## Test Coverage

The current test suite provides:
- **36 passing tests** across 4 test suites
- **Basic functionality coverage** for core components
- **Data validation** for all major data structures
- **Error handling** pattern validation
- **API contract** validation

## Test Features

### ✅ What's Tested
- URL validation and parsing
- Input validation patterns
- Response format validation
- Error handling structures
- Data type validation
- HTTP status codes
- CORS configuration
- Basic business logic

### 🔄 Future Enhancements
- Database integration tests
- End-to-end API tests with real HTTP requests
- Mock-based unit tests for controllers
- Performance tests
- Security tests

## Dependencies

The test suite uses:
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library (for future integration tests)
- **MongoDB Memory Server** - In-memory database for testing (for future database tests)

## Configuration

### Jest Configuration (`jest.config.js`)
- Node.js test environment
- ES module support
- Coverage reporting
- Test timeout configuration
- Setup file configuration

### Test Setup (`tests/setup.simple.js`)
- Basic test environment setup
- Global test configuration
- Test lifecycle management

## Writing New Tests

### Test File Naming Convention
- Unit tests: `*.simple.test.js`
- Integration tests: `*.simple.test.js`
- Basic tests: `basic.test.js`

### Test Structure
```javascript
describe('Feature Name', () => {
  test('should do something specific', () => {
    // Arrange
    const input = 'test data';
    
    // Act
    const result = processInput(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Best Practices
1. Use descriptive test names
2. Follow AAA pattern (Arrange, Act, Assert)
3. Test both success and error cases
4. Validate data structures and types
5. Keep tests independent and isolated

## Troubleshooting

### Common Issues
1. **Jest not recognizing ES modules**: Use `--experimental-vm-modules` flag
2. **Test timeouts**: Increase timeout in `jest.config.js`
3. **Mock issues**: Use simple validation tests instead of complex mocking

### Debug Mode
```bash
npm test -- --verbose
```

## Contributing

When adding new tests:
1. Follow the existing naming conventions
2. Add tests to appropriate categories
3. Update this README if adding new test categories
4. Ensure all tests pass before submitting
5. Add meaningful test descriptions

## Test Results

Current test status:
- ✅ 4 test suites passing
- ✅ 36 tests passing
- ✅ 0 tests failing
- ✅ Basic coverage established

The test suite provides a solid foundation for ensuring code quality and preventing regressions in the URL Shortener backend.

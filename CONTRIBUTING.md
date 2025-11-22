# Contributing to MOST-PHARMA-GRO

Thank you for your interest in contributing to MOST-PHARMA-GRO! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**When suggesting an enhancement, include:**

- A clear and descriptive title
- Detailed description of the proposed feature
- Use cases and benefits
- Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Write or update tests as needed
5. Ensure all tests pass
6. Commit your changes
7. Push to your fork
8. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/MOST-PHARMA-GRO.git
cd MOST-PHARMA-GRO

# Install dependencies
npm install

# Create a branch for your changes
git checkout -b feature/my-new-feature
```

### Running Locally

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

## Pull Request Process

1. **Update Documentation**: Ensure README and relevant docs are updated
2. **Test Coverage**: Add tests for new features
3. **Code Quality**: Follow coding standards and pass linting
4. **Clean Commits**: Use clear, descriptive commit messages
5. **PR Description**: Provide detailed description of changes
6. **Review Process**: Address reviewer feedback promptly

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No console warnings/errors
- [ ] Builds without errors

## Coding Standards

### JavaScript

- Use ES6+ syntax
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused

### Example

```javascript
/**
 * Calculate the total price including tax
 * @param {number} price - Base price
 * @param {number} taxRate - Tax rate (0-1)
 * @returns {number} Total price with tax
 */
function calculateTotal(price, taxRate) {
  if (price < 0 || taxRate < 0) {
    throw new Error('Price and tax rate must be positive');
  }
  return price * (1 + taxRate);
}
```

### CSS

- Use meaningful class names
- Follow BEM methodology when appropriate
- Keep specificity low
- Use variables for colors and spacing

### HTML

- Use semantic HTML5 elements
- Ensure accessibility (ARIA labels, alt text)
- Keep markup clean and indented
- Validate HTML

## Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(ads-core): add video ad support

Added video ad format with autoplay and skip controls.
Includes analytics tracking for video completion.

Closes #123
```

```
fix(inventory): correct stock calculation

Fixed issue where stock count was incorrect after
multiple rapid transactions.

Fixes #456
```

## Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

Examples:
- `feature/add-video-ads`
- `fix/inventory-calculation`
- `docs/update-readme`

## Testing

### Writing Tests

- Write tests for new features
- Update tests for bug fixes
- Ensure tests are clear and focused
- Mock external dependencies

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.js

# Run tests with coverage
npm run test:coverage
```

## Documentation

- Update README for user-facing changes
- Add JSDoc comments for new functions
- Update API documentation
- Include code examples
- Keep changelog updated

## Review Process

### For Contributors

- Respond to feedback promptly
- Ask questions if unclear
- Be open to suggestions
- Update PR based on feedback

### For Reviewers

- Be constructive and respectful
- Explain reasoning for change requests
- Acknowledge good work
- Test changes when possible

## Getting Help

- **Documentation**: Check README and docs first
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions for questions
- **Contact**: Reach out via GitHub

## Recognition

Contributors will be recognized in:
- README acknowledgments
- Release notes
- Contributors list

## License

By contributing, you agree that your contributions will be licensed under the Boost Software License 1.0.

---

Thank you for contributing to MOST-PHARMA-GRO! 🎉

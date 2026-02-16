# Form Validation

## Overview
The contact form includes custom client-side validation to ensure users provide necessary information before submission. This replaces the default browser validation popups with styled, inline error messages that match the site's design.

## Features
- **Inline Error Messages:** Errors appear directly below the problematic field.
- **Visual Feedback:** Invalid fields are highlighted with a red border and a shake animation.
- **Real-time Clearing:** Error messages disappear immediately when the user starts typing to fix the issue.
- **Email Validation:** Checks for valid email format (e.g., `user@example.com`).

## Technical Implementation
- **HTML:** The `novalidate` attribute is added to the `<form>` tag to disable default browser tooltips.
- **CSS:**
    - `.form-group input.error`: Styles for invalid inputs.
    - `.error-message`: Styles for the error text and icon.
    - Animations: `@keyframes shake` and `@keyframes slideDown`.
- **JavaScript:**
    - `handleContactSubmit(e)`: Intercepts form submission.
    - `showError(input, message)`: Adds error classes and appends the error message element.
    - `clearErrors(form)`: Removes all error states before re-validating.

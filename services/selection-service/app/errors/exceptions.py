class DomainError(Exception):
    def __init__(self, message: str, code: str):
        super().__init__(message)
        self.message = message
        self.code = code

class NotFoundError(DomainError):
    def __init__(self, message: str):
        super().__init__(message, "NOT_FOUND")

class ValidationError(DomainError):
    def __init__(self, message: str):
        super().__init__(message, "VALIDATION_ERROR")

class ConflictError(DomainError):
    def __init__(self, message: str):
        super().__init__(message, "CONFLICT")

class ForbiddenError(DomainError):
    def __init__(self, message: str):
        super().__init__(message, "FORBIDDEN")

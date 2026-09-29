class AppError(Exception):
    def __init__(self, message: str, code: str = "INTERNAL_ERROR") -> None:
        super().__init__(message)
        self.message = message
        self.code = code
        self.details: list[str] = []

class NotFoundError(AppError):
    def __init__(self, message: str) -> None:
        super().__init__(message, "NOT_FOUND")

class ValidationError(AppError):
    def __init__(self, message: str, details: list[str] | None = None) -> None:
        super().__init__(message, "VALIDATION_ERROR")
        if details:
            self.details = details

class ConflictError(AppError):
    def __init__(self, message: str) -> None:
        super().__init__(message, "CONFLICT")

class ForbiddenError(AppError):
    def __init__(self, message: str) -> None:
        super().__init__(message, "FORBIDDEN")

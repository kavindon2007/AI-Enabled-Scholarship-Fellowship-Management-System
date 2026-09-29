"""Custom exception classes for fraud detection service."""


class FraudDetectionBaseException(Exception):
    """Base exception for all fraud detection errors."""

    def __init__(self, message: str, details: dict[str, object] | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}


class ApplicationNotFoundError(FraudDetectionBaseException):
    """Raised when an application cannot be found in the system."""

    pass


class FeatureExtractionError(FraudDetectionBaseException):
    """Raised when feature extraction from signals fails."""

    pass


class ModelInferenceError(FraudDetectionBaseException):
    """Raised when XGBoost model inference fails."""

    pass


class DuplicateEvaluationError(FraudDetectionBaseException):
    """Raised when attempting to re-score an already evaluated application."""

    pass


class InvalidInputDataError(FraudDetectionBaseException):
    """Raised when input data fails validation."""

    pass


class SignalProcessingError(FraudDetectionBaseException):
    """Raised when a signal processor encounters an error."""

    pass

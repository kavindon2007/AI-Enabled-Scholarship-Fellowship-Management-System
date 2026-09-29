import cv2
import easyocr
import pytesseract
import numpy as np

# Lazy load models
_easyocr_reader = None

def get_easyocr():
    global _easyocr_reader
    if _easyocr_reader is None:
        # Use CPU by default for local dev
        _easyocr_reader = easyocr.Reader(["en"], gpu=False)
    return _easyocr_reader

def preprocess_image(image: np.ndarray) -> np.ndarray:
    """General preprocessing for OCR."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    # Could add adaptive thresholding if needed
    return blurred

def extract_with_easyocr(image: np.ndarray) -> list[str]:
    reader = get_easyocr()
    results = reader.readtext(image)
    return [res[1] for res in results]

def extract_with_tesseract(image: np.ndarray) -> list[str]:
    text = pytesseract.image_to_string(image)
    return text.splitlines()

def run_ocr_fusion(image: np.ndarray) -> tuple[list[str], float]:
    """Run both engines and fuse results."""
    processed = preprocess_image(image)
    
    texts_easy = extract_with_easyocr(processed)
    texts_tess = extract_with_tesseract(processed)
    
    # Simple fusion: combine sets, could add deduplication
    all_texts = []
    for t in texts_easy + texts_tess:
        cleaned = t.strip()
        if cleaned and len(cleaned) > 2:
            all_texts.append(cleaned)
            
    # Mock confidence score based on text length (just for demo)
    confidence = min(98.0, 70.0 + len(all_texts) * 0.5)
    
    return all_texts, confidence

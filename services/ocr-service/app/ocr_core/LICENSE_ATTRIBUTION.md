# OCR Core License Attribution

The files in the `ocr_core` directory (including `engines/`, `extraction/`, and `pipeline.py`) were adapted from the `invoice-extraction-system` repository.

Original License: MIT License
Original Author: @kavindon2007 (kavin don)
Source Repository: https://github.com/kavindon2007/invoice-extraction-system

Modifications made for AI-SFMS:
- Migrated domain dictionaries from tractor/dealer context to Scheduled Tribe Certificate context.
- Modified fuzzy match to use standard library `difflib.SequenceMatcher` instead of `python-Levenshtein`.
- Restructured as a scalable fastapi `ocr_core` module instead of a standalone script.
- Wrapped engines to enable easy lazy loading and PyTesseract + EasyOCR fusion.

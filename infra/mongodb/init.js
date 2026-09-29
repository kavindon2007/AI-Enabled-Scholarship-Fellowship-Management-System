// MongoDB initialization — create collections with JSON Schema validators

// Switch to the sfms_ocr database
db = db.getSiblingDB('sfms_ocr');

// ─── Collection: ocr_results ───
db.createCollection('ocr_results', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['document_id', 'application_id', 'doc_type', 'extracted_fields', 'created_at'],
      properties: {
        document_id: {
          bsonType: 'string',
          description: 'UUID matching the PostgreSQL documents table',
        },
        application_id: {
          bsonType: 'string',
          description: 'UUID of the parent application',
        },
        doc_type: {
          bsonType: 'string',
          enum: [
            'ST_CERTIFICATE', 'INCOME_CERTIFICATE',
            'MARKSHEET_X', 'MARKSHEET_XII', 'MARKSHEET_GRADUATION', 'MARKSHEET_PG',
            'AADHAAR_CARD', 'DOMICILE_CERTIFICATE', 'ADMISSION_LETTER',
            'DISABILITY_CERTIFICATE', 'PVTG_CERTIFICATE', 'PASSPORT',
            'TEST_SCORECARD', 'PHD_CERTIFICATE', 'PROGRESS_REPORT',
            'JOINING_REPORT', 'COMPLETION_CERTIFICATE',
          ],
          description: 'Document type code',
        },
        extracted_fields: {
          bsonType: 'object',
          description: 'Nested JSON with field names, raw extracted values, and confidence scores',
        },
        confidence_scores: {
          bsonType: 'object',
          description: 'Per-field confidence scores (0.0 to 1.0)',
        },
        tampering_analysis: {
          bsonType: 'object',
          description: 'Individual tampering check results and severity',
          properties: {
            font_consistency: { bsonType: 'object' },
            metadata_mismatch: { bsonType: 'object' },
            resolution_anomaly: { bsonType: 'object' },
            phash_duplicate: { bsonType: 'object' },
            stamp_detection: { bsonType: 'object' },
            compression_artifacts: { bsonType: 'object' },
          },
        },
        cross_match_results: {
          bsonType: 'object',
          description: 'Name match scores against other documents in the same application',
        },
        model_version: {
          bsonType: 'string',
          description: 'OCR model version used for processing',
        },
        processing_log: {
          bsonType: 'object',
          description: 'Timestamps and fallback flags',
        },
        phash_fingerprint: {
          bsonType: 'string',
          description: 'Perceptual hash fingerprint for deduplication',
        },
        overall_confidence: {
          bsonType: 'double',
          minimum: 0,
          maximum: 1,
          description: 'Aggregate confidence score',
        },
        fallback_used: {
          bsonType: 'bool',
          description: 'Whether Tesseract fallback was used',
        },
        created_at: {
          bsonType: 'date',
          description: 'Processing timestamp',
        },
      },
    },
  },
});

// Indexes for ocr_results
db.ocr_results.createIndex({ document_id: 1 }, { unique: true });
db.ocr_results.createIndex({ application_id: 1 });
db.ocr_results.createIndex({ application_id: 1, doc_type: 1 });
db.ocr_results.createIndex({ phash_fingerprint: 1 });
db.ocr_results.createIndex({ created_at: 1 });

// ─── Collection: scheme_form_configs ───
db.createCollection('scheme_form_configs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['scheme_code', 'version', 'config', 'is_active', 'created_at'],
      properties: {
        scheme_code: {
          bsonType: 'string',
          enum: ['PREMATRIC', 'POSTMATRIC', 'NFST', 'NOS', 'TOPCLASS'],
          description: 'Scheme identifier code',
        },
        version: {
          bsonType: 'string',
          description: 'Configuration version (semver)',
        },
        config: {
          bsonType: 'object',
          description: 'Complete form field configuration JSON',
        },
        is_active: {
          bsonType: 'bool',
          description: 'Whether this version is the active configuration',
        },
        activated_at: {
          bsonType: 'date',
        },
        deactivated_at: {
          bsonType: 'date',
        },
        created_by: {
          bsonType: 'string',
          description: 'UUID of the admin who created this version',
        },
        created_at: {
          bsonType: 'date',
        },
      },
    },
  },
});

// Indexes for scheme_form_configs
db.scheme_form_configs.createIndex({ scheme_code: 1, version: 1 }, { unique: true });
db.scheme_form_configs.createIndex({ scheme_code: 1, is_active: 1 });

print('MongoDB initialization complete — collections and indexes created.');
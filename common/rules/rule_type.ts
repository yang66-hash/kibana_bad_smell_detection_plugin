
export enum ApmRuleType {
    ErrorCount = 'bsd.error_rate', // ErrorRate was renamed to ErrorCount but the key is kept as `error_rate` for backwards-compat.
    TransactionErrorRate = 'bsd.transaction_error_rate',
    TransactionDuration = 'bsd.transaction_duration',
    Anomaly = 'bsd.anomaly',
  }
  
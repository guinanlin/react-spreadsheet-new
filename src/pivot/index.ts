// Core types and interfaces
export * from './types';

// Data processing
export { PivotEngine } from './engine';
export * from './aggregations';

// API integration
export { PivotApiClient, MockPivotApiClient } from './api-client';
export {
  QUERY_KEYS,
  setPivotApiClient,
  getPivotApiClient,
  usePivotData,
  usePivotDrill,
  usePivotDatasets,
  usePivotFields,
  usePivotFieldValues,
  usePivotExport,
  useSavePivotConfiguration,
  usePivotConfigurations,
  usePivotHealth,
  useExpandedPaths,
  usePivotErrorHandler,
  useOptimisticPivot,
  usePrefetchPivotData,
  usePivotOperations,
} from './hooks';

// Components
export { PivotTable } from './PivotTable';
export { PivotTableWithConfiguration } from './PivotTableWithConfiguration';
export { PivotCell, PivotCellBase } from './PivotCell';
export { PivotHeadersContainer, PivotRowHeaders, PivotColumnHeaders } from './PivotHeaders';
export { PivotFieldSelector } from './PivotFieldSelector';

// Drill-down functionality
export * from './DrillDownManager';

// Configuration management - use exports from PivotConfigurationManager
export {
  type PivotConfigurationStorage,
  type SavedPivotConfiguration,
  type ConfigurationValidation,
  type PivotConfigurationState,
  type ConfigurationChangeEvent,
  usePivotConfigurationManager,
  PivotConfigurationContext,
  PivotConfigurationProvider,
  usePivotConfiguration,
} from './PivotConfigurationManager';
export * from './PivotConfigurationUI';

// Export functionality
export {
  type ExportOptions,
  type ExportResult,
  useExportManager,
} from './ExportManager';
export * from './ExportUI';
export { AdvancedExportManager, useAdvancedExportManager } from './AdvancedExportManager';

// Performance and optimization
export * from './PerformanceManager';
export { OptimizedPivotEngine, useOptimizedPivotEngine } from './OptimizedPivotEngine';
export { VirtualizedPivotTable } from './VirtualizedPivotTable';
export { PerformanceMonitor, usePerformanceMonitoring } from './PerformanceMonitor';

// Utilities
export { getExpandablePaths, getAllPossiblePaths } from './DrillDownManager';
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export { BaggageEntry, BaggageEntryMetadata, Baggage } from './baggage/types.ts';
export { baggageEntryMetadataFromString } from './baggage/utils.ts';
export { Exception } from './common/Exception.ts';
export { HrTime, TimeInput } from './common/Time.ts';
export { Attributes, AttributeValue } from './common/Attributes.ts';

// Context APIs
export { createContextKey, ROOT_CONTEXT } from './context/context.ts';
export { Context, ContextManager } from './context/types.ts';
export type { ContextAPI } from './api/context.ts';

// Diag APIs
export { DiagConsoleLogger } from './diag/consoleLogger.ts';
export {
  DiagLogFunction,
  DiagLogger,
  DiagLogLevel,
  ComponentLoggerOptions,
  DiagLoggerOptions,
} from './diag/types.ts';
export type { DiagAPI } from './api/diag.ts';

// Metrics APIs
export { createNoopMeter } from './metrics/NoopMeter.ts';
export { MeterOptions, Meter } from './metrics/Meter.ts';
export { MeterProvider } from './metrics/MeterProvider.ts';
export {
  ValueType,
  Counter,
  Histogram,
  MetricOptions,
  Observable,
  ObservableCounter,
  ObservableGauge,
  ObservableUpDownCounter,
  UpDownCounter,
  BatchObservableCallback,
  MetricAttributes,
  MetricAttributeValue,
  ObservableCallback,
} from './metrics/Metric.ts';
export {
  BatchObservableResult,
  ObservableResult,
} from './metrics/ObservableResult.ts';
export type { MetricsAPI } from './api/metrics.ts';

// Propagation APIs
export {
  TextMapPropagator,
  TextMapSetter,
  TextMapGetter,
  defaultTextMapGetter,
  defaultTextMapSetter,
} from './propagation/TextMapPropagator.ts';
export type { PropagationAPI } from './api/propagation.ts';

// Trace APIs
export { SpanAttributes, SpanAttributeValue } from './trace/attributes.ts';
export { Link } from './trace/link.ts';
export { ProxyTracer, TracerDelegator } from './trace/ProxyTracer.ts';
export { ProxyTracerProvider } from './trace/ProxyTracerProvider.ts';
export { Sampler } from './trace/Sampler.ts';
export { SamplingDecision, SamplingResult } from './trace/SamplingResult.ts';
export { SpanContext } from './trace/span_context.ts';
export { SpanKind } from './trace/span_kind.ts';
export { Span } from './trace/span.ts';
export { SpanOptions } from './trace/SpanOptions.ts';
export { SpanStatus, SpanStatusCode } from './trace/status.ts';
export { TraceFlags } from './trace/trace_flags.ts';
export { TraceState } from './trace/trace_state.ts';
export { createTraceState } from './trace/internal/utils.ts';
export { TracerProvider } from './trace/tracer_provider.ts';
export { Tracer } from './trace/tracer.ts';
export { TracerOptions } from './trace/tracer_options.ts';
export {
  isSpanContextValid,
  isValidTraceId,
  isValidSpanId,
} from './trace/spancontext-utils.ts';
export {
  INVALID_SPANID,
  INVALID_TRACEID,
  INVALID_SPAN_CONTEXT,
} from './trace/invalid-span-constants.ts';
export type { TraceAPI } from './api/trace.ts';

// Split module-level variable definition into separate files to allow
// tree-shaking on each api instance.
import { context } from './context-api.ts';
import { diag } from './diag-api.ts';
import { metrics } from './metrics-api.ts';
import { propagation } from './propagation-api.ts';
import { trace } from './trace-api.ts';

// Named export.
export { context, diag, metrics, propagation, trace };
// Default export.
export default {
  context,
  diag,
  metrics,
  propagation,
  trace,
};

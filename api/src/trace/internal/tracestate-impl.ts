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

import { TraceState } from '../trace_state.ts';
import { validateKey, validateValue } from './tracestate-validators.ts';

const MAX_TRACE_STATE_ITEMS = 32;
const MAX_TRACE_STATE_LEN = 512;
const LIST_MEMBERS_SEPARATOR = ',';
const LIST_MEMBER_KEY_VALUE_SPLITTER = '=';

/**
 * TraceState must be a class and not a simple object type because of the spec
 * requirement (https://www.w3.org/TR/trace-context/#tracestate-field).
 *
 * Here is the list of allowed mutations:
 * - New key-value pair should be added into the beginning of the list
 * - The value of any key can be updated. Modified keys MUST be moved to the
 * beginning of the list.
 */
export class TraceStateImpl implements TraceState {
  private _internalState: Map<string, string> = new Map();

  constructor(rawTraceState?: string) {
    if (rawTraceState) this._parse(rawTraceState);
  }

  set(key: string, value: string): TraceStateImpl {
    // TODO: Benchmark the different approaches(map vs list) and
    // use the faster one.
    const traceState = this._clone();
    if (traceState._internalState.has(key)) {
      traceState._internalState.delete(key);
    }
    traceState._internalState.set(key, value);
    return traceState;
  }

  unset(key: string): TraceStateImpl {
    const traceState = this._clone();
    traceState._internalState.delete(key);
    return traceState;
  }

  get(key: string): string | undefined {
    return this._internalState.get(key);
  }

  serialize(): string {
    return this._keys()
      .reduce((agg: string[], key) => {
        agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + this.get(key));
        return agg;
      }, [])
      .join(LIST_MEMBERS_SEPARATOR);
  }

  private _parse(rawTraceState: string) {
    if (rawTraceState.length > MAX_TRACE_STATE_LEN) return;
    this._internalState = rawTraceState
      .split(LIST_MEMBERS_SEPARATOR)
      .reverse() // Store in reverse so new keys (.set(...)) will be placed at the beginning
      .reduce((agg: Map<string, string>, part: string) => {
        const listMember = part.trim(); // Optional Whitespace (OWS) handling
        const i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
        if (i !== -1) {
          const key = listMember.slice(0, i);
          const value = listMember.slice(i + 1, part.length);
          if (validateKey(key) && validateValue(value)) {
            agg.set(key, value);
          } else {
            // TODO: Consider to add warning log
          }
        }
        return agg;
      }, new Map());

    // Because of the reverse() requirement, trunc must be done after map is created
    if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
      this._internalState = new Map(
        Array.from(this._internalState.entries())
          .reverse() // Use reverse same as original tracestate parse chain
          .slice(0, MAX_TRACE_STATE_ITEMS)
      );
    }
  }

  private _keys(): string[] {
    return Array.from(this._internalState.keys()).reverse();
  }

  private _clone(): TraceStateImpl {
    const traceState = new TraceStateImpl();
    traceState._internalState = new Map(this._internalState);
    return traceState;
  }
}

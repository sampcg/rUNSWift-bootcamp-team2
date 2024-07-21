/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'offnao';

export interface Commands {
  sendingMask: number;
  argv: string[];
}

function createBaseCommands(): Commands {
  return { sendingMask: 0, argv: [] };
}

export const Commands = {
  encode(message: Commands, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sendingMask !== 0) {
      writer.uint32(8).uint64(message.sendingMask);
    }
    for (const v of message.argv) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Commands {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommands();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sendingMask = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.argv.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Commands {
    return {
      sendingMask: isSet(object.sendingMask) ? Number(object.sendingMask) : 0,
      argv: Array.isArray(object?.argv) ? object.argv.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: Commands): unknown {
    const obj: any = {};
    message.sendingMask !== undefined && (obj.sendingMask = Math.round(message.sendingMask));
    if (message.argv) {
      obj.argv = message.argv.map((e) => e);
    } else {
      obj.argv = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Commands>, I>>(object: I): Commands {
    const message = createBaseCommands();
    message.sendingMask = object.sendingMask ?? 0;
    message.argv = object.argv?.map((e) => e) || [];
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  throw 'Unable to locate global object';
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends {}
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER');
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

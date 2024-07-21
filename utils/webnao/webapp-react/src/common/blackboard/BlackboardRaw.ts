import { Blackboard } from './definitions/Blackboard';

export class BlackboardRaw {
  constructor(
    public blackboard: Blackboard,
    public bytes: Uint8Array,
  ) {}
  static fromBytes(bytes: Uint8Array): BlackboardRaw {
    const blackboard = Blackboard.decode(bytes);
    return new this(blackboard, bytes);
  }
}

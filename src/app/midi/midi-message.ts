export enum MessageType {
    NOTE_ON = 'noteOn',
    NOTE_OFF = 'noteOff',
    POLYPHONIC_KEY_PRESSURE = 'polyphonicKeyPressure',
    PITCH_BEND_CHANGE = 'pitchBendChange',
    PROGRAM_CHANGE = 'programChange',
    CONTROL_CHANGE = 'controlChange',
    CHANNEL_MODE = 'channelMode',
    SYSTEM_COMMON = 'systemCommon',
    SYSTEM_REAL_TIME = 'systemRealTime',
    SYSTEM_EXCLUSIVE = 'systemExclusive'
}

const MIDI_STATUS = {
    NOTE_OFF: 0x80,
    NOTE_ON: 0x90,
    POLY_PRESSURE: 0xA0,
    CONTROL_CHANGE: 0xB0,
    PROGRAM_CHANGE: 0xC0,
    CHANNEL_MODE: 0xD0,
    PITCH_BEND: 0xE0,
    SYSTEM: 0xF0
} as const;

export interface MidiMessage {
    readonly type: MessageType;

    toData(): number[];
}

export interface ChannelMessage extends MidiMessage {
    readonly channel: number;
}

export interface NoteMessage {
    readonly note: number;
    readonly velocity: number;
}

abstract class BaseChannelMessage implements ChannelMessage {
    constructor(
        readonly type: MessageType,
        readonly channel: number,
        private readonly statusCode: number
    ) {
    }

    protected createData(data: number[]): number[] {
        return [this.statusCode | this.channel, ...data];
    }

    abstract toData(): number[];
}

export class NoteOnMessage extends BaseChannelMessage implements NoteMessage {
    constructor(
        channel: number,
        readonly note: number,
        readonly velocity: number
    ) {
        super(MessageType.NOTE_ON, channel, MIDI_STATUS.NOTE_ON);
    }

    toData(): number[] {
        return this.createData([this.note, this.velocity]);
    }
}

export class NoteOffMessage extends BaseChannelMessage implements NoteMessage {
    constructor(
        channel: number,
        readonly note: number,
        readonly velocity: number
    ) {
        super(MessageType.NOTE_OFF, channel, MIDI_STATUS.NOTE_OFF);
    }

    toData(): number[] {
        return this.createData([this.note, this.velocity]);
    }
}

export class PolyphonicKeyPressureMessage extends BaseChannelMessage {
    constructor(
        channel: number,
        readonly note: number,
        readonly pressure: number
    ) {
        super(MessageType.POLYPHONIC_KEY_PRESSURE, channel, MIDI_STATUS.POLY_PRESSURE);
    }

    toData(): number[] {
        return this.createData([this.note, this.pressure]);
    }
}

export class PitchBendChangeMessage extends BaseChannelMessage {
    constructor(channel: number, readonly bend: number) {
        super(MessageType.PITCH_BEND_CHANGE, channel, MIDI_STATUS.PITCH_BEND);
    }

    toData(): number[] {
        return this.createData([this.bend & 0x7F, (this.bend >> 7) & 0x7F]);
    }
}

export class ProgramChangeMessage extends BaseChannelMessage {
    constructor(channel: number, readonly program: number) {
        super(MessageType.PROGRAM_CHANGE, channel, MIDI_STATUS.PROGRAM_CHANGE);
    }

    toData(): number[] {
        return this.createData([this.program]);
    }
}

export class ControlChangeMessage extends BaseChannelMessage {
    constructor(
        channel: number,
        readonly control: number,
        readonly value: number
    ) {
        super(MessageType.CONTROL_CHANGE, channel, MIDI_STATUS.CONTROL_CHANGE);
    }

    toData(): number[] {
        return this.createData([this.control, this.value]);
    }
}

export class ChannelModeMessage extends BaseChannelMessage {
    constructor(
        channel: number,
        readonly mode: number,
        readonly value: number
    ) {
        super(MessageType.CHANNEL_MODE, channel, MIDI_STATUS.CHANNEL_MODE);
    }

    toData(): number[] {
        return this.createData([this.mode, this.value]);
    }
}

abstract class BaseSystemMessage implements SystemMessage {
    constructor(readonly type: MessageType, readonly data: number[]) {
    }

    toData(): number[] {
        return this.data;
    }
}

export interface SystemMessage extends MidiMessage {
}

export class SystemCommonMessage extends BaseSystemMessage {
    constructor(data: number[]) {
        super(MessageType.SYSTEM_COMMON, data);
    }
}

export class SystemRealTimeMessage extends BaseSystemMessage {
    constructor(data: number[]) {
        super(MessageType.SYSTEM_REAL_TIME, data);
    }
}

export class SystemExclusiveMessage extends BaseSystemMessage {
    constructor(data: number[]) {
        super(MessageType.SYSTEM_EXCLUSIVE, data);
    }
}

export function parseMidiEvent(event: MIDIMessageEvent): MidiMessage {
    if (!event.data) {
        throw new Error("Invalid MIDI message: no data");
    }

    const status = event.data[0];
    const messageType = status & 0xF0;
    const channel = status & 0x0F;

    switch (messageType) {
        case MIDI_STATUS.NOTE_OFF:
            return new NoteOffMessage(channel, event.data[1], event.data[2]);
        case MIDI_STATUS.NOTE_ON:
            return new NoteOnMessage(channel, event.data[1], event.data[2]);
        case MIDI_STATUS.POLY_PRESSURE:
            return new PolyphonicKeyPressureMessage(channel, event.data[1], event.data[2]);
        case MIDI_STATUS.CONTROL_CHANGE:
            return new ControlChangeMessage(channel, event.data[1], event.data[2]);
        case MIDI_STATUS.PROGRAM_CHANGE:
            return new ProgramChangeMessage(channel, event.data[1]);
        case MIDI_STATUS.CHANNEL_MODE:
            return new ChannelModeMessage(channel, event.data[1], event.data[2]);
        case MIDI_STATUS.PITCH_BEND:
            return new PitchBendChangeMessage(channel, (event.data[2] << 7) | event.data[1]);
        case MIDI_STATUS.SYSTEM:
            if (status === MIDI_STATUS.SYSTEM) {
                return new SystemExclusiveMessage(Array.from(event.data));
            } else if (status >= 0xF8) {
                return new SystemRealTimeMessage(Array.from(event.data));
            } else {
                return new SystemCommonMessage(Array.from(event.data));
            }
        default:
            throw new Error(`Unknown MIDI message type: ${messageType.toString(16)}`);
    }
}

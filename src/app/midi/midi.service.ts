import {Injectable} from "@angular/core";
import {MidiMessage, parseMidiEvent} from "./midi-message";

@Injectable({providedIn: 'root'})
export class MidiService {

    private midiAccess: MIDIAccess | null = null;

    private input: MIDIInput | null = null;

    private output: MIDIOutput | null = null;

    public async init() {
        console.log('Initializing MIDI Service');
        return navigator.requestMIDIAccess({
            sysex: true,
            software: true
        }).then(
            (midiAccess) => {
                console.log("MIDI ready");
                this.midiAccess = midiAccess;

                const storedInputId = localStorage.getItem('midiInputId');
                if (null != storedInputId) {
                    this.input = midiAccess.inputs.get(storedInputId) ?? null;
                }

                const storedOutputId = localStorage.getItem('midiOutputId');
                if (null != storedOutputId) {
                    this.output = midiAccess.outputs.get(storedOutputId) ?? null;
                }

                midiAccess.inputs.forEach(input => {
                    console.log('Registering MIDI input', input);
                    input.onmidimessage = (event: MIDIMessageEvent) => this.onMidiMessage(input, event)
                })
                midiAccess.onstatechange = (event) => {
                    console.log('MIDI state change', event);
                }
            },
            (msg) => {
                console.error(`Failed to get MIDI access - ${msg}`);
                throw new Error(`Failed to get MIDI access - ${msg}`);
            }
        );
    }

    public getMidiAccess(): MIDIAccess {
        if (this.midiAccess) {
            return this.midiAccess;
        }
        throw new Error("MIDI not initialized");
    }

    public getInputs(): MIDIInput[] {
        return Array.from(this.getMidiAccess().inputs.values());
    }

    public getOutputs(): MIDIOutput[] {
        return Array.from(this.getMidiAccess().outputs.values());
    }

    public send(message: MidiMessage): void {
        const output = this.output;
        if (null === output) {
            throw new Error("MIDI output not initialized");
        }
        console.log('MIDI OUT', message);
        output.send(message.toData());
    }

    public getInput(): MIDIInput | null {
        return this.input;
    }

    public setInput(input: MIDIInput | null) {
        this.input = input;
        if (null !== input) {
            localStorage.setItem('midiInputId', input.id);
        } else {
            localStorage.removeItem('midiInputId');
        }
    }

    public getOutput(): MIDIOutput | null {
        return this.output;
    }

    public setOutput(output: MIDIOutput | null) {
        this.output = output;
        if (null !== output) {
            localStorage.setItem('midiOutputId', output.id);
        } else {
            localStorage.removeItem('midiOutputId');
        }
    }

    public onMidiMessage(input: MIDIInput, event: MIDIMessageEvent) {
        if (input.id !== this.input?.id) {
            return
        }

        const timestampedMessage = {
            timestamp: event.timeStamp,
            message: parseMidiEvent(event)
        };
        console.log('MIDI IN', timestampedMessage);
    }
}

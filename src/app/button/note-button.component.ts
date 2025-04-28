import {ChangeDetectionStrategy, Component, input, OnDestroy, signal} from '@angular/core';
import {MidiService} from "../midi/midi.service";
import {NoteMessage, NoteOffMessage, NoteOnMessage} from "../midi/midi-message";
import {filter, map, Subscription} from "rxjs";

@Component({
    selector: 'button[app-note-button]',
    imports: [],
    templateUrl: './note-button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(click)': 'trigger()',
        '[class.triggering]': '$triggering()',
        '[class.running]': '$running()'
    }
})
export class NoteButtonComponent implements OnDestroy {
    public $channel = input.required<number>({alias: 'channel'});

    public $note = input.required<number>({alias: 'note'});

    protected $triggering = signal<boolean>(false);

    protected $running = signal<boolean>(false);

    private midiMessageSubscription: Subscription;

    constructor(private readonly midiService: MidiService) {
        this.midiMessageSubscription = this.midiService.getMessageObservable().pipe(
            filter(({type}) => type === 'noteOn' || type === 'noteOff'),
            map(message => message as NoteMessage),
            filter(({channel, note}) => channel === this.$channel() && note === this.$note()),
        ).subscribe((message: NoteMessage) => {

            if (message instanceof NoteOnMessage && message.velocity === 126) {
                this.$triggering.set(true);
                this.$running.set(false);
            }
            if (message instanceof NoteOnMessage && (message.velocity === 127 || message.velocity === 1)) {
                this.$running.set(true);
                this.$triggering.set(false);
            }

            if (message instanceof NoteOffMessage) {
                this.$running.set(false);
                this.$triggering.set(false);
            }
        });
    }

    /**
     * @override
     */
    public ngOnDestroy() {
        this.midiMessageSubscription.unsubscribe();
    }

    protected trigger() {
        this.midiService.send(new NoteOnMessage(this.$channel(), this.$note(), 127));
        this.midiService.send(new NoteOffMessage(this.$channel(), this.$note(), 0));
    }
}

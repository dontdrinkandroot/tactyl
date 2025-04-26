import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'highResTimestampToTimestamp'
})
export class HighResTimestampToTimestampPipe implements PipeTransform {
    /**
     * @override
     */
    public transform(timestamp: DOMHighResTimeStamp): number {
        const now = Date.now();
        const documentCreationTime = now - performance.now();
        return documentCreationTime + timestamp;
    }
}

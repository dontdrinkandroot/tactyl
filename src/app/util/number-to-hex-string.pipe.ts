import {Pipe, PipeTransform} from "@angular/core";
import {numberToHexString} from "./format";

@Pipe({
    name: 'numberToHexString'
})
export class NumberToHexStringPipe implements PipeTransform {
    /**
     * @override
     */
    public transform(value: number): string {
        return numberToHexString(value);
    }
}

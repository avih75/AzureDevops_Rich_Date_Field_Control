import { data } from "jquery"

export class RichDateTime {

    DateValue: Date
    DateValueRefName: string
    DateFutureLimitation: boolean
    DateMaxValue: Date
    DateMaxRefName: string
    DatePastLimitation: boolean
    DateMinValue: Date
    DateMinRefName: string
    MaxDays: number
    MinDays: number
    State: Array<string>;
    MaxDate: Date
    MinDate: Date
    ActualState: string
    Is: boolean
    DateFormat: string
    FieldsRefNames: Array<string>
    constructor() {
        this.State = new Array<string>();
        this.FieldsRefNames = new Array<string>();
        this.DateFutureLimitation = false
        this.DatePastLimitation = false
        this.MaxDays = 0
        this.MinDays = 0
        this.DateMaxValue = new Date;
        this.DateMinValue = new Date;
        this.Is = false;
        this.DateFormat = "dd mm yy";
    }
    public GetFieldRefNames() {
        let fieldsRefNames: Array<string> = new Array<string>();
        fieldsRefNames.push(this.DateValueRefName);
        if (this.DateMaxRefName) {
            fieldsRefNames.push(this.DateMaxRefName)
        }
        if (this.DateMinRefName) {
            fieldsRefNames.push(this.DateMinRefName)
        }
        return fieldsRefNames;
    }
    public SetValues(recivedValues: IDictionaryStringTo<Object>) {
        if (recivedValues[this.DateValueRefName])
            this.DateValue = new Date(recivedValues[this.DateValueRefName].toString());
        else
            this.DateValue = undefined;
        if (this.DateFutureLimitation == true) {
            if (this.DateMaxRefName) {
                if (recivedValues[this.DateMaxRefName])
                    this.DateMaxValue = new Date(recivedValues[this.DateMaxRefName].toString());
                else
                    this.DateMaxValue = new Date(this.DateMaxValue.getTime() + (86400000 * this.MaxDays));
            }
            this.MaxDate = new Date(this.DateMaxValue.getTime() + (86400000 * this.MaxDays));
        }
        if (this.DatePastLimitation == true) {
            if (this.DateMinRefName) {
                if (recivedValues[this.DateMinRefName])
                    this.DateMinValue = new Date(recivedValues[this.DateMinRefName].toString());
                else
                    this.DateMinValue = new Date(this.DateMinValue.getTime() + (86400000 * this.MinDays));
            }
            this.MinDate = new Date(this.DateMinValue.getTime() + (86400000 * this.MinDays));
        }
        if (this.State) {
            this.ActualState = recivedValues["System.State"].toString();
        }
    }
    public CheckIfDellay() {
        let xDate = new Date;
        xDate.setHours(0);
        xDate.setMinutes(0);
        xDate.setSeconds(0);
        if (this.DateValue < xDate) {
            let x = this.State.indexOf(this.ActualState);
            if (this.Is) {
                if (x > -1)
                    return true;
            }
            else {
                if (x < 0)
                    return true;
            }
        }
        return false;
    }
    public SetNewValues(newValues: Array<{ refName: string, value: string }>) {
        newValues.forEach(valueChange => {
            if (valueChange.refName == this.DateValueRefName) {
                this.DateValue = new Date(valueChange.value);
            }
            else if (this.DateFutureLimitation && valueChange.refName == this.DateMaxRefName) {
                this.DateMaxValue = new Date(valueChange.value);
                this.MaxDate = new Date(this.DateMaxValue.getTime() + (86400000 * this.MaxDays));
            }
            else if (this.DatePastLimitation && valueChange.refName == this.DateMinRefName) {
                this.DateMinValue = new Date(valueChange.value);
                this.MinDate = new Date(this.DateMinValue.getTime() - (86400000 * this.MinDays));
            }
            else if (valueChange.refName == "System.State") {
                this.ActualState = valueChange.value;
            }
        });
    }
    public CheckIfOutOfRange() {
        if ((this.DateFutureLimitation && this.DateValue > this.MaxDate) || (this.DatePastLimitation && this.DateValue < this.MinDate)) {
            return true
        }
        return false;
    }
}
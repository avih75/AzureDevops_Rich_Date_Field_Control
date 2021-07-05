import { data } from "jquery"

export class RichDateTime {
    StatusRefName: string;
    StatusValue: boolean;
    DateValue: Date                 // The Field Date Value
    DateValueRefName: string        // The Field RefName
    DateFutureLimitation: boolean   // Trigg the upper limitation
    DateMaxValue: Date              // The Max Value from the Anqure field
    DateMaxRefName: string          // the max  refname anqure
    DatePastLimitation: boolean     // Trigg the Lower limitation
    DateMinValue: Date              // The Min Value from the Anqure field
    DateMinRefName: string          // the min  refname anqure
    StateDays: number               // the number of days the state been reference to
    MaxDays: number
    MinDays: number
    CheckStateDate: Date             // The date that the Red sign turns on
    States: Array<string>;          // The States How needed to follow
    MaxDate: Date                   // The Upper Gap Size in days
    MinDate: Date                   // The Lower Gap Size in days
    ActualState: string             // The Actual State of the work item
    Is: boolean                     // IS\Not in States
    DateFormat: string              // Required Date format
    FieldsRefNames: Array<string>   // List of all Refnames need to be maintaine
    constructor() {
        this.States = new Array<string>();
        this.FieldsRefNames = new Array<string>();
        this.DateFutureLimitation = false
        this.DatePastLimitation = false
        this.MaxDays = 0
        this.MinDays = 0
        this.StateDays = 0
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
        let stateGapInMil: number = (86400000 * this.StateDays);
        let maxGapInMil: number = (86400000 * this.MaxDays);
        let minGapInMil: number = (86400000 * this.MinDays);
        if (recivedValues[this.DateValueRefName])
            this.DateValue = new Date(recivedValues[this.DateValueRefName].toString());
        else
            this.DateValue = undefined;
        let xDate = new Date;
        xDate.setHours(0);
        xDate.setMinutes(0);
        xDate.setSeconds(0);
        this.CheckStateDate = new Date(xDate.getTime() + stateGapInMil);
        if (this.DateFutureLimitation == true) {
            let tempDate: Date = new Date();
            if (this.DateMaxRefName && recivedValues[this.DateMaxRefName]) {
                tempDate = new Date(recivedValues[this.DateMaxRefName].toString())
            }
            this.MaxDate = new Date(tempDate.getTime() + maxGapInMil);
        }
        if (this.DatePastLimitation == true) {
            let tempDate: Date = new Date();
            if (this.DateMinRefName && recivedValues[this.DateMinRefName]) {
                tempDate = new Date(recivedValues[this.DateMinRefName].toString())
            }
            this.MinDate = new Date(tempDate.getTime() + minGapInMil);
        }
        if (this.States) {
            this.ActualState = recivedValues["System.State"].toString();
        }
    }
    // public SetValues(recivedValues: IDictionaryStringTo<Object>) {
    // if (recivedValues[this.DateValueRefName])
    //     this.DateValue = new Date(recivedValues[this.DateValueRefName].toString());
    // else
    //     this.DateValue = undefined;
    // if (this.DateFutureLimitation == true) {
    //     if (this.DateMaxRefName) {
    //         if (recivedValues[this.DateMaxRefName])
    //             this.DateMaxValue = new Date(recivedValues[this.DateMaxRefName].toString());//.getTime()+ (86400000 * this.MaxDays) );
    //         else
    //             this.DateMaxValue = new Date(this.DateMaxValue.getTime() + (86400000 * this.MaxDays));
    //     }
    //     this.MaxDate = new Date(this.DateMaxValue.getTime() + (86400000 * this.MaxDays));
    // }
    // if (this.DatePastLimitation == true) {
    //     if (this.DateMinRefName) {
    //         if (recivedValues[this.DateMinRefName])
    //             this.DateMinValue = new Date(recivedValues[this.DateMinRefName].toString());
    //         else
    //             this.DateMinValue = new Date(this.DateMinValue.getTime() + (86400000 * this.MinDays));
    //     }
    //     this.MinDate = new Date(this.DateMinValue.getTime() + (86400000 * this.MinDays));
    // }
    //     if (this.State) {
    //         this.ActualState = recivedValues["System.State"].toString();
    //     }
    // }
    public CheckIfDellay() {
        let xDate = new Date;
        xDate.setHours(0);
        xDate.setMinutes(0);
        xDate.setSeconds(0);
        if (this.DateValue < this.CheckStateDate) {//xDate
            let x = this.States.indexOf(this.ActualState);
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
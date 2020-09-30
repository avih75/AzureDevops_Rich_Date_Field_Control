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
    State: string
    MaxDate: Date
    MinDate: Date
    ActualState: string
    Is: boolean

    constructor() {
        this.DateFutureLimitation = false
        this.DatePastLimitation = false
        this.MaxDays = 0
        this.MinDays = 0
        this.DateMaxValue = new Date;
        this.DateMinValue = new Date;
        this.Is = false;
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
        if (recivedValues[this.DateValueRefName].toString())
            this.DateValue = new Date(recivedValues[this.DateValueRefName].toString());
        else
            this.DateValue = undefined;
        if (this.DateFutureLimitation) {
            if (this.DateMaxRefName) {
                this.DateMaxValue = new Date(recivedValues[this.DateMaxRefName].toString());
            }

            this.MaxDate = new Date(this.DateMaxValue.getTime() + (86400000 * this.MaxDays));
        }
        if (this.DatePastLimitation) {
            if (this.DateMinRefName) {
                this.DateMinValue = new Date(recivedValues[this.DateMinRefName].toString());
            }
            this.MinDate = new Date(this.DateMaxValue.getTime() - (86400000 * this.MinDays));
        }
        if (this.State) {
            this.ActualState = recivedValues["System.State"].toString();
        }
    }
    public CheckIfDellay() {
        if (this.State && this.DateValue < new Date && this.ActualState == this.State && this.Is)
            return true;
        else if (this.State && this.DateValue < new Date && this.ActualState != this.State && !this.Is)
            return true;
        else
            return false
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
            else if (valueChange.refName == this.DateMinRefName) {
                this.DateMinValue = new Date(valueChange.value);
                this.MinDate = new Date(this.DateMaxValue.getTime() - (86400000 * this.MinDays));
            }
            else if (valueChange.refName == "System.State") {
                this.ActualState = valueChange.value;
            }
        });
    }
}
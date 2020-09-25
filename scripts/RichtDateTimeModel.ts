export class RichDateTime {
    ControlName: string
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
    constructor() {
        this.DateFutureLimitation = false
        this.DatePastLimitation = false
        this.MaxDays = 0
        this.MinDays = 0
        this.DateMaxValue = new Date;
        this.DateMinValue = new Date;
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
            this.DateValue = this.ConvertStringToShortDate(recivedValues[this.DateValueRefName].toString());
        else
            this.DateValue = undefined;
        if (this.DateFutureLimitation) {
            if (this.DateMaxRefName) {
                this.DateMaxValue = this.ConvertStringToShortDate(recivedValues[this.DateMaxRefName].toString());
            }

            this.MaxDate = new Date(this.DateMaxValue.getTime() + (86400000 * this.MaxDays));
        }
        if (this.DatePastLimitation) {
            if (this.DateMinRefName) {
                this.DateMinValue = this.ConvertStringToShortDate(recivedValues[this.DateMinRefName].toString());
            }
            this.MinDate = new Date(this.DateMaxValue.getTime() - (86400000 * this.MinDays));
        }
    }
    public ConvertStringToShortDate(date: string) {
        return new Date(date);
    }
    public ValideDate(date: Date) {
        let selectedDay: number = Date.parse(date.toString());
        if (this.DateMaxValue) {
            let UpperReffDate: number = Date.parse(this.DateMaxValue.toString());
            if (selectedDay > UpperReffDate + this.MaxDays) {
                $("#dateErrorLabel").text("date bigger then max range");
                return false;
            }
        }
        if (this.DateMinValue) {
            let LowerReffDate: number = Date.parse(this.DateMinValue.toString());
            if (selectedDay < LowerReffDate + this.MinDays) {
                $("#dateErrorLabel").text("date lower then min range");
                return false;
            }
        }
        $("#dateErrorLabel").text("");
        this.DateValue = date;
        return true;
    }
    public CheckIfDellay(actualState: string) {
        if (this.State && this.DateValue >= new Date && actualState == this.State)
            return true;
        else
            return false
    }
}
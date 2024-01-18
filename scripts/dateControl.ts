import { CreateView, WorkItemFieldChanged } from "./dateView";
import { RichDateTime } from "./RichtDateTimeModel";
export class Controller {
    constructor() {
        let inputs = VSS.getConfiguration().witInputs;
        let model: RichDateTime = new RichDateTime();
        model.StatusRefName = inputs["stateValue"]; 
        model.FieldsRefNames.push(model.StatusRefName);
        model.DateValueRefName = inputs["dateValue"];
        model.FieldsRefNames.push(model.DateValueRefName);
        if (inputs["dateFormat"]) {
            model.DateFormat = inputs["dateFormat"];
        }
        model.Is = inputs["stateOfState"]
        model.FieldsRefNames.push("System.State");
        if (inputs["stateToFollow"]) {
            let states: string = inputs["stateToFollow"];
            model.State = states.split(',');
        }
        if (inputs["futureLimitation"] && (inputs["futureLimitation"] == true || inputs["futureLimitation"] == "true")) {
            model.DateFutureLimitation = true; //inputs["futureLimitation"];
            if (model.DateFutureLimitation) {
                model.DateMaxRefName = inputs["forwordDatRef"];
                model.FieldsRefNames.push(model.DateMaxRefName)
                model.MaxDays = inputs["forwordValue"];
            }
        }
        else {
            model.DateFutureLimitation = false;
        }
        if (inputs["pastLimitation"] && (inputs["pastLimitation"] == true || inputs["pastLimitation"] == "true")) {
            model.DatePastLimitation = true;// inputs["pastLimitation"];
            if (model.DatePastLimitation) {
                model.DateMinRefName = inputs["backDateRef"];
                model.FieldsRefNames.push(model.DateMinRefName)
                model.MinDays = inputs["backValue"];
            }
        }
        else {
            model.DatePastLimitation = false;
        }
        CreateView(model);
        VSS.resize();
    }
    public FieldChanged(changedFields: { [key: string]: any; }) {
        WorkItemFieldChanged(changedFields);
    }
}
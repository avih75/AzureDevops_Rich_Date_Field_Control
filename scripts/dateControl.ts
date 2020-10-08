import { CreateView, WorkItemFieldChanged } from "./dateView";
import { RichDateTime } from "./RichtDateTimeModel";
export class Controller {
    constructor() {
        let inputs = VSS.getConfiguration().witInputs;
        let model: RichDateTime = new RichDateTime();
        model.DateValueRefName = inputs["dateValue"];
        if (inputs["dateFormat"]) {
            model.DateFormat = inputs["dateFormat"];
        }
        if (inputs["isOrIsNot"] == "Is")
            model.Is = true;
        if (inputs["futureLimitation"] == "true")
            model.DateFutureLimitation = true;
        model.DateMaxRefName = inputs["forwordDatRef"];
        model.MaxDays = inputs["forwordValue"];
        if (inputs["pastLimitation"] == "true")
            model.DatePastLimitation = true;
        model.DateMinRefName = inputs["backDateRef"];
        model.MinDays = inputs["backValue"];
        if (inputs["stateToFollow"]) {
            let states: string = inputs["stateToFollow"];
            model.State = states.split(',');
        }
        CreateView(model);
        VSS.resize();
    }
    public FieldChanged(changedFields: { [key: string]: any; }) {
        WorkItemFieldChanged(changedFields);
    }
}
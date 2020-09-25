import { CreateView } from "./dateView";
import { RichDateTime } from "./RichtDateTimeModel";
export class Controller {
    constructor() {
        let inputs = VSS.getConfiguration().witInputs;
        let model: RichDateTime = new RichDateTime();
        model.DateValueRefName = inputs["dateValue"];
        model.ControlName = inputs["controlName"];
        if (inputs["futureLimitation"] == "true")
            model.DateFutureLimitation = true;
        model.DateMaxRefName = inputs["forwordDatRef"];
        model.MaxDays = inputs["forwordValue"];
        if (inputs["pastLimitation"] == "true")
            model.DatePastLimitation = true;
        model.DateMinRefName = inputs["backDateRef"];
        model.MinDays = inputs["backValue"];
        model.State = inputs["stateToFollow"];
        VSS.resize();
        CreateView(model);
    }
}
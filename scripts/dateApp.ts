import { IWorkItemFieldChangedArgs } from "TFS/WorkItemTracking/ExtensionContracts";
import { Controller } from "./dateControl";

let controller: Controller;
let provider = () => {
    return {
        onLoaded: () => {
            controller = new Controller();
        },
        onFieldChanged: (fieldChangedArgs: IWorkItemFieldChangedArgs) => {
            let changedValue = fieldChangedArgs.changedFields;
            controller.FieldChanged(changedValue)
        }
    };
};
VSS.register(VSS.getContribution().id, provider);
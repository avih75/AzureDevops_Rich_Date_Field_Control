import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { RichDateTime } from "./RichtDateTimeModel";
import RestClient = require("TFS/WorkItemTracking/RestClient");
let client = RestClient.getClient();
let dateModel: RichDateTime;
export function WorkItemFieldChanged(changedFields: { [key: string]: any; }) {
    let valuesList: Array<{ refName: string, value: string }> = new Array<{ refName: string, value: string }>();
    let newDateValue = changedFields[dateModel.DateValueRefName];
    if (newDateValue) {
        valuesList.push({ refName: dateModel.DateValueRefName, value: newDateValue })
    }
    let newMaxDateValue = changedFields[dateModel.DateMaxRefName];
    if (newMaxDateValue) {
        valuesList.push({ refName: dateModel.DateMaxRefName, value: newMaxDateValue })
    }
    let newMinDateValue = changedFields[dateModel.DateMinRefName];
    if (newMinDateValue) {
        valuesList.push({ refName: dateModel.DateMinRefName, value: newMinDateValue })
    }
    let newState = changedFields["System.State"];
    if (newState) {
        valuesList.push({ refName: "System.State", value: newState })
    }
    if (valuesList.length > 0) {
        dateModel.SetNewValues(valuesList);
        RefreshTheView();
    }
    IsReadOnly(dateModel.DateValueRefName).then((readOnly: boolean) => {
        if (readOnly) {
            $("#datepicker").attr("disabled", "true");
        }
        else {
            $("#datepicker").removeAttr("disabled");
        }
    });
}
export function CreateView(model: RichDateTime) {
    dateModel = model;
    GetValues();
    $("#body").css("background-color", "inherit");
    //$("#datepicker").datepicker('dateFormat', dateModel.DateFormat);
    $("#datepicker").change(() => OnFieldChanged());
    IsReadOnly(dateModel.DateValueRefName).then((readOnly: boolean) => {
        if (readOnly) {
            $("#datepicker").attr("disabled", "true");
        }
        else {
            $("#datepicker").removeAttr("disabled");
        }
    });
}
function GetValues() {
    let fieldsRefNames: Array<string> = dateModel.GetFieldRefNames();
    fieldsRefNames.push("System.State");
    WorkItemFormService.getService().then(
        (service) => {
            service.getFieldValues(fieldsRefNames).then((inputsValues) => {
                dateModel.SetValues(inputsValues);
                RefreshTheView();
            })
        }
    );
}
function RefreshTheView() {
    if (dateModel.DateValue != undefined) {
        $("#datepicker").val((ConverToViewMode(dateModel.DateValue)));
        if (dateModel.CheckIfDellay()) {
            $("#datepicker").css("background-color", "lightpink");
        }
        else
            $("#datepicker").css("background-color", "inherit");
    }
    if (dateModel.MaxDate != undefined) {
        $("#datepicker").attr("max", ConverToViewMode(dateModel.MaxDate));
    }
    if (dateModel.MinDate != undefined) {
        $("#datepicker").attr("min", ConverToViewMode(dateModel.MinDate));
    }
}
function OnFieldChanged() {
    WorkItemFormService.getService().then(
        (service) => {
            service.setFieldValue(dateModel.DateValueRefName, GiveShortDate($("#datepicker").val()));
        }
    );
}
function GiveShortDate(dateToConvert: Date) {
    let xD: number = (new Date()).getMonth() + 1;
    let xx = (new Date()).toLocaleString().split('/');
    let x = dateToConvert.toString().split('-');
    let dateNew: string;
    if (xx[0] == xD.toString()) {
        dateNew = x[2] + "/" + x[1] + "/" + x[0];//+ " 00:00";  
    }
    else if (xx[1] == xD.toString()) {
        dateNew = x[1] + "/" + x[2] + "/" + x[0];//+ " 00:00"; 
    }
    else {
        dateNew = x[2] + "/" + x[1] + "/" + x[0];//+ " 00:00";  
    }
    return dateNew;
}
function ConverToViewMode(date: Date) {
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let today = date.getFullYear() + "-" + (month) + "-" + (day);
    return today;
}
async function IsReadOnly(refName: string) {
    return await (await client.getField(refName, "nxowdncjofnmc")).readOnly;
} 
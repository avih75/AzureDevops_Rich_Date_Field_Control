import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { RichDateTime } from "./RichtDateTimeModel";
import RestClient = require("TFS/WorkItemTracking/RestClient");
let regional: string;
let neededFormat: string = "YYYY/MM/DD";
let dateModel: RichDateTime;

export function WorkItemFieldChanged(changedFields: { [key: string]: any; }) {
    let valuesList: Array<{ refName: string, value: string }> = new Array<{ refName: string, value: string }>();
    let newDateValue: Date = changedFields[dateModel.DateValueRefName];
    if (newDateValue) {
        valuesList.push({ refName: dateModel.DateValueRefName, value: newDateValue.toString() })
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
    // IsReadOnly(dateModel.DateValueRefName).then((readOnly: boolean) => {
    //     if (readOnly) {
    //         $("#datepicker").attr("disabled", "true");
    //     }
    //     else {
    //         $("#datepicker").removeAttr("disabled");
    //     }
    // });
}
export function CreateView(model: RichDateTime) {
    regional = window.navigator.language;
    let geolocation = window.navigator.geolocation;
    dateModel = model;
    GetValues();
    $("#body").css("background-color", "inherit");
    $("#datepicker").change(() => OnFieldChanged());
}
function GetValues() {
    // let fieldsRefNames: Array<string> = dateModel.GetFieldRefNames();
    // fieldsRefNames.push("System.State");
    WorkItemFormService.getService().then(
        (service) => {
            // service.getFieldValues(fieldsRefNames).then((inputsValues) => {
            service.getFieldValues(dateModel.FieldsRefNames).then((inputsValues) => {
                dateModel.SetValues(inputsValues);
                RefreshTheView();
            })
        }
    );
}
function RefreshTheView() {
    if (dateModel.DateValue != undefined) {
        $("#datepicker").val((ConverToViewMode(dateModel.DateValue)));
        WorkItemFormService.getService().then(
            (service) => {
                if (dateModel.CheckIfDellay()) {
                    $("#datepicker").css("background-color", "lightpink");
                    dateModel.StatusValue = true;
                    service.setFieldValue(dateModel.StatusRefName, true);
                }
                else {
                    $("#datepicker").css("background-color", "inherit");
                    dateModel.StatusValue = false;
                    service.setFieldValue(dateModel.StatusRefName, false);
                }
            })
        if (dateModel.CheckIfOutOfRange()) {
            $("#dateErrorLabel").text("Selected date is out of Range");
        }
        else {
            $("#dateErrorLabel").text("");
        }
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
            let date: Date = $("#datepicker").val();
            let values = date.toString().split('-');
            let stringDate: string;
            if (regional == "he" || regional == "he-IL" || regional == "en-GB") {
                stringDate = values[2] + "/" + values[1] + "/" + values[0];
            }
            else if (regional == "en-US" || regional == "en") {
                stringDate = values[1] + "/" + values[2] + "/" + values[0];
            }
            else {
                stringDate = date.toDateString();
            }

            stringDate += " 12:00:00"; // Append the hour component

            try {
                const dateValue = new Date(stringDate); // Convert stringDate to a Date object
                service.setFieldValue(dateModel.DateValueRefName, dateValue);
            }
            catch {
                // Handle any error that may occur
            }
        }
    );

} 
function ConverToViewMode(date: Date) {
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let today = date.getFullYear() + "-" + (month) + "-" + (day); // - /
    //let today = (day) + "-" + (month) + "-" + date.getFullYear(); // - /
    return today;
}  
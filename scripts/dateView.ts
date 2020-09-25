import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { RichDateTime } from "./RichtDateTimeModel";

let dateModel: RichDateTime;
export function CreateView(model: RichDateTime) {
    dateModel = model;
    GetValues();
    $("#body").css("background-color", "inherit");
    $("#label").text(model.ControlName);
    $("#datepicker").change(() => OnFieldChanged());
}
function GetValues() {
    let fieldsRefNames: Array<string> = dateModel.GetFieldRefNames();
    fieldsRefNames.push("System.State");
    WorkItemFormService.getService().then(
        (service) => {
            service.getFieldValues(fieldsRefNames).then((inputsValues) => {
                dateModel.SetValues(inputsValues);
                if (dateModel.DateValue != undefined) {
                    $("#datepicker").val((ConverToViewMode(dateModel.DateValue)));
                    if (dateModel.CheckIfDellay(inputsValues["System.State"].toString())) {
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
            })
        }
    );
}
function OnFieldChanged() {
    if (dateModel.ValideDate($("#datepicker").val())) {
        WorkItemFormService.getService().then(
            (service) => {
                service.setFieldValue(dateModel.DateValueRefName, GiveShortDate($("#datepicker").val())); // my need convert back
            }
        );
    }
    else {
        $("#datepicker").val(null);
    }
}
function GiveShortDate(dateToConvert: Date) {
    let x = dateToConvert.toString().split('-');
    let dateNew: string = x[2] + "/" + x[1] + "/" + x[0];//+ " 00:00"; 
    return dateNew;
}
function ConverToViewMode(date: Date) {
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let today = date.getFullYear() + "-" + (month) + "-" + (day);
    return today;
}


// let monthnum: number = (new Date().getMonth() + 1);
// let month: string = "";
// if (monthnum < 10)
// month += "0";
// month += monthnum;
// ReferenceDate = (new Date()).getFullYear() + "-" + month + "-" + (new Date().getDate());
import RestClient = require("TFS/WorkItemTracking/RestClient");
let client = RestClient.getClient();
async function IsReadOnly(refName: string) {
    let field = await client.getField(refName);
    return field.readOnly; 
} 
import { Controller } from "./dateControl"; 

let provider = () => {
    return {
        onLoaded: () => {
            new Controller(); 
        }
    };
};
VSS.register(VSS.getContribution().id, provider);
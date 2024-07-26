sap.ui.define([
    "sap/ui/core/format/DateFormat"
], (DateFormat) => {
    "use strict";

    return {
        dateFormat(sDate){
            if(!sDate){
                return "";
            }
            var oDateFormat = DateFormat.getInstance({
                patern: "MMMM yyyy"
            });
            return oDateFormat.format(new Date(sDate));
        }
    }
})
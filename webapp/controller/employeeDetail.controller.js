sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "../model/formatter"
], (Controller, ODataModel, JSONModel, MessageToast, formatter) => {
    "use strict";

    return Controller.extend("project2.controller.employeeDetail", {
        formatter: formatter,
        onInit() {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("employee", "selected", this.onEmployeeSelected, this);
        },

        onEmployeeSelected(sChannel, sEvent, oData) {
            var sServiceUrl = "/sap/opu/odata/sap/Z_MHQ_GETODATA_SRV/";
            var oModel = new ODataModel(sServiceUrl);

            var sPath = `/EMPLOYEESet(UserId='${oData.UserId}')/NAVEMPTODETAIL`;
            oModel.read(sPath, {
                success: (oData) =>{
                    var oDetailModel = new JSONModel(oData.results);
                    this.getView().setModel(oDetailModel, "detailModel");
                },
                error: (oError) =>{
                    MessageToast.show("Error fetching data:", oError)
                }
            })
        }
    })
})
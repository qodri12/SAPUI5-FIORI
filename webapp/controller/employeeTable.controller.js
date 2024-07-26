sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast"
], (Controller, JSONModel, ODataModel, MessageToast) => {
    "use strict";

    return Controller.extend("project2.controller.employeeTable", {
        onInit() {
            var sServiceUrl = "/sap/opu/odata/sap/Z_MHQ_GETODATA_SRV/";
            var oModel = new ODataModel(sServiceUrl);
            this.getView().setModel(oModel);

            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("employee", "added", this.onEmployeeAdded, this);
        },

        onEmployeeAdded(){
            var oTable = this.byId("employeeTableId");
            oTable.getBinding("items").refresh();
        },

        async onEditButton(oEvent){
            this.oEdit ??= await this.loadFragment({
                name: "project2.view.EditForm"
            });

            var oItem = oEvent.getSource().getParent().getBindingContext().getObject();
            this.selectedEmployee = oItem;
            
            this.byId("editWerksId").setValue(oItem.Werks);
            this.byId("editNamaId").setValue(oItem.Nama);
            this.byId("editNikId").setValue(oItem.UserId);
            this.byId("editDepartmentId").setSelectedKey(oItem.Department);
            this.byId("editGajiId").setValue(oItem.Gaji);
            this.byId("editCurrId").setSelectedKey(oItem.Waers);
            this.byId("editGelarId").setSelectedKey(oItem.Gelar);
            this.byId("editStatusId").setSelectedKey(oItem.Status);

            this.oEdit.open();
        },

        onCloseButton(){
            this.byId("updateFormId").close();
        },

        onEditEmployee(){
            var sWerks = this.byId("editWerksId").getValue();
            var sName = this.byId("editNamaId").getValue();
            var sNIK = this.byId("editNikId").getValue();
            var sDepartment = this.byId("editDepartmentId").getSelectedKey();
            var sGaji = this.byId("editGajiId").getValue();
            var sWaers = this.byId("editCurrId").getSelectedKey();
            var sGelar = this.byId("editGelarId").getSelectedKey();
            var sStatus = this.byId("editStatusId").getSelectedKey();

            var oUpdatedEmployee = {
                Werks : sWerks,
                UserId : sNIK,
                Nama : sName,
                Department : sDepartment,
                Gaji : sGaji,
                Waers : sWaers,
                Gelar : sGelar,
                Status : sStatus
            };

            var oModel = this.getView().getModel();
            var sPath = `/EMPLOYEESet('${this.selectedEmployee.UserId}')`;

            oModel.update(sPath, oUpdatedEmployee, {
                success(){
                    MessageToast.show("Data berhasil di update");
                    var oEventBus = sap.ui.getCore().getEventBus();
                    oEventBus.publish("employee", "added");
                    this.byId("employeeTableId").getBinding("items").refresh();
                },
                error(){
                    MessageToast.show("Data gagal di update");
                }
            });
            this.byId("updateFormId").close();
        },

        onDeleteEmployee(oEvent){
            var oModel = this.getView().getModel();
            var sPath = oEvent.getSource().getBindingContext().getPath();

            oModel.remove(sPath, {
                success(){
                    MessageToast.show("Data berhasil terhapus");
                    oModel.refresh(true);
                },
                error(){
                    MessageToast.show("Data gagal dihapus");
                }
            });
        },

        onEmployeeSelect(oEvent) {
            var oItem = oEvent.getSource().getBindingContext().getObject();
            var sUserId = oItem.UserId;
            var sNama = oItem.Nama;

            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("employee", "selected", { UserId: sUserId, Nama: sNama });
        },
    });
});
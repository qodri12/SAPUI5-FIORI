sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "../model/formatter",
    "sap/ui/core/format/DateFormat"
], (Controller, ODataModel, JSONModel, MessageToast, formatter, DateFormat) => {
    "use strict";

    return Controller.extend("project2.controller.employeeDetail", {
        formatter: formatter,
        onInit() {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("employee", "selected", this.onEmployeeSelected, this);
            oEventBus.subscribe("employee", "roleAdded", this.onEmployeeSelected, this);
        },

        onEmployeeSelected(sChannel, sEvent, oData) {
            var sServiceUrl = "/sap/opu/odata/sap/Z_MHQ_GETODATA_SRV/";
            var oModel = new ODataModel(sServiceUrl);

            var sEmployeePath = `/EMPLOYEESet(UserId='${oData.UserId}')`;
            oModel.read(sEmployeePath, {
                success: (oEmployeeData) => {
                    var sEmployeeDetailPath = `${sEmployeePath}/NAVEMPTODETAIL`;
                    oModel.read(sEmployeeDetailPath, {
                        success: (oDetailData) => {
                            var oDetailModel = new JSONModel({
                                employee: oEmployeeData,
                                details: oDetailData.results
                            });
                            this.getView().setModel(oDetailModel, "detailModel");
                        },
                        error: (oError) => {
                            MessageToast.show("Error fetching employee details: ", oError);
                        }
                    });
                },
                error: (oError) => {
                    MessageToast.show("Error fetching employee data:", oError)
                }
            })
        },

        async onEditRoleButton(oEvent) {
            this.oEditRole ??= await this.loadFragment({
                name: "project2.view.EditRole"
            });

            var oRoleData = oEvent.getSource().getBindingContext("detailModel").getObject();
            this.selectedRole = oRoleData;

            var oDateFormat = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
            var sFormattedDate = oDateFormat.format(new Date(oRoleData.Asgon));

            this.byId("editRoleNikId").setValue(oRoleData.UserId);
            this.byId("editRolePrmid").setValue(oRoleData.Prmid);
            this.byId("editRoleNamaId").setValue(this.getView().getModel("detailModel").getProperty("/employee/Nama"));
            this.byId("editRoleId").setValue(oRoleData.Jabtn);
            this.byId("editRoleDateId").setValue(sFormattedDate);

            this.oEditRole.open();
        },

        onCloseButton() {
            this.byId("editRoleFormId").close();
        },

        onSubmitEditRole() {
            var sUserId = this.byId("editRoleNikId").getValue();
            var sPrmid = this.byId("editRolePrmid").getValue();
            var sRole = this.byId("editRoleId").getValue();
            var sDate = this.byId("editRoleDateId").getValue();

            var oDateFormat = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
            var oDate = oDateFormat.parse(sDate);
            var oDateTimeFormat = DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd'T'HH:mm:ss" });
            var sFormattedDateTime = oDateTimeFormat.format(oDate);

            var oUpdatedRole = {
                UserId: sUserId,
                Prmid: sPrmid,
                Jabtn: sRole,
                Asgon: sFormattedDateTime
            };

            var oModel = this.getView().getModel();
            var sPath = `/EMPLOYEE_DETAILSet(UserId='${this.selectedRole.UserId}',Prmid='${this.selectedRole.Prmid}')`;

            oModel.update(sPath, oUpdatedRole, {
                success: () => {
                    MessageToast.show("Role updated successfully");
                    this.oEditRole.close();
                    var oDetailModel = this.getView().getModel("detailModel");
                    var sUserId = oDetailModel.getProperty("/employee/UserId");
                    var oEventBus = sap.ui.getCore().getEventBus();
                    oEventBus.publish("employee", "roleAdded", { UserId: sUserId });
                },
                error: () => {
                    MessageToast.show("Failed to update role");
                }
            });
        },

        onDeleteRole(oEvent){
            var oRoleData = oEvent.getSource().getBindingContext("detailModel").getObject();
            var oModel = this.getView().getModel();
            var sPath = `/EMPLOYEE_DETAILSet(UserId='${oRoleData.UserId}',Prmid='${oRoleData.Prmid}')`;

            oModel.remove(sPath, {
                success: () => {
                    MessageToast.show("Peran berhasil dihapus");
                    var oDetailModel = this.getView().getModel("detailModel");
                    var sUserId = oDetailModel.getProperty("/employee/UserId");
                    var oEventBus = sap.ui.getCore().getEventBus();
                    oEventBus.publish("employee", "roleAdded", {UserId: sUserId});
                },
                error: (oError) => {
                    MessageToast.show("Gagal menghapus peran: "+ oError.message);
                }
            })
        }
    })
})
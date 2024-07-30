sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat"
],
    function (Controller, JSONModel, MessageToast, DateFormat) {
        "use strict";

        return Controller.extend("project2.controller.View1", {
            async onOpenButton() {
                this.oOpen ??= await this.loadFragment({
                    name: "project2.view.Form"
                });
                this.resetAddForm();
                this.oOpen.open();
            },

            onCloseButton() {
                this.byId("formId").close();
            },

            onInit() {
                var listForm = new JSONModel({
                    department: [
                        {
                            text: "IT",
                            key: "IT"
                        },
                        {
                            text: "HC",
                            key: "HC"
                        },
                        {
                            text: "GENERAL",
                            key: "GENERAL"
                        }
                    ],
                    gelar: [
                        {
                            text: "SMA",
                            key: "SMA"
                        },
                        {
                            text: "S1",
                            key: "S1"
                        },
                        {
                            text: "S2",
                            key: "S2"
                        }
                    ],
                    status: [
                        {
                            text: "PKWT",
                            key: "PKWT"
                        },
                        {
                            text: "PKWTT",
                            key: "PKWTT"
                        }
                    ]
                });
                this.getView().setModel(listForm, "listForm");

                this.getView().setModel(new JSONModel(), "selectedEmployee");

                var oEventBus = sap.ui.getCore().getEventBus();
                oEventBus.subscribe("employee", "selected", this.onEmployeeSelected, this);
            },

            onEmployeeSelected(sChannel, sEvent, oData) {
                this.getView().getModel("selectedEmployee").setData(oData);
            },

            async onOpenAddRoleButton() {
                this.oOpenRole ??= await this.loadFragment({
                    name: "project2.view.addRole"
                });

                var oSelectedEmployee = this.getView().getModel("selectedEmployee").getData();
                if (oSelectedEmployee) {
                    this.byId("roleNikId").setValue(oSelectedEmployee.UserId);
                    this.byId("roleNamaId").setValue(oSelectedEmployee.Nama);
                }

                this.resetAddRoleForm();
                this.oOpenRole.open();
            },

            onCloseAddRoleButton() {
                this.byId("addRoleId").close();
            },

            onAddEmployee() {
                var newWerks = this.byId("werksId").getValue();
                var newName = this.byId("namaId").getValue();
                var newNIK = this.byId("nikId").getValue();
                var newDepartment = this.byId("departmentId").getSelectedKey();
                var newGaji = this.byId("gajiId").getValue();
                var newCurr = this.byId("currId").getSelectedKey();
                var newGelar = this.byId("gelarId").getSelectedKey();
                var newStatus = this.byId("statusId").getSelectedKey();

                var NewEmployee = {
                    Werks: newWerks,
                    UserId: newNIK,
                    Nama: newName,
                    Department: newDepartment,
                    Gaji: newGaji,
                    Waers: newCurr,
                    Gelar: newGelar,
                    Status: newStatus,
                },

                    oModel = this.getView().getModel();

                oModel.create("/EMPLOYEESet", NewEmployee, {
                    success() {
                        MessageToast.show("Data berhasil di input");
                        var oEventBus = sap.ui.getCore().getEventBus();
                        oEventBus.publish("employee", "added");
                        this.resetAddForm();
                    },
                    error() {
                        MessageToast.show("Data gagal di input");
                    }
                });

                this.byId("formId").close();
            },

            resetAddForm() {
                this.byId("werksId").setValue("");
                this.byId("namaId").setValue("");
                this.byId("nikId").setValue("");
                this.byId("departmentId").setSelectedKey("");
                this.byId("gajiId").setValue("");
                this.byId("currId").setSelectedKey("");
                this.byId("gelarId").setSelectedKey("");
                this.byId("statusId").setSelectedKey("");
            },

            resetAddRoleForm() {
                this.byId("rolePrmid").setValue("");
                this.byId("roleId").setValue("");
                this.byId("roleDateId").setValue("");
            },

            onAddRole() {
                var oSelectedEmployee = this.getView().getModel("selectedEmployee").getData();

                var sRoleDate = this.byId("roleDateId").getValue();
                var oDateFormat = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
                var oDate = oDateFormat.parse(sRoleDate);
                var oDateTimeFormat = DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd'T'HH:mm:ss" });
                var sFormattedDateTime = oDateTimeFormat.format(oDate);

                var newRole = {
                    UserId: this.byId("roleNikId").getValue(),
                    Prmid: this.byId("rolePrmid").getValue(),
                    Jabtn: this.byId("roleId").getValue(),
                    Asgon: sFormattedDateTime
                };

                var oModel = this.getView().getModel();

                oModel.create("/EMPLOYEE_DETAILSet", newRole, {
                    success: function () {
                        MessageToast.show("Role added successfully");
                        this.byId("addRoleId").close();

                        var oEventBus = sap.ui.getCore().getEventBus();
                        oEventBus.publish("employee", "roleAdded", oSelectedEmployee);
                    }.bind(this),
                    error: function () {
                        MessageToast.show("Failed to add role");
                    }
                })
            }
        });
    });

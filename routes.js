const express = require("express");
const router = express.Router();

// import controllers
const homeCtrl = require("./controllers/home");
const countryCtrl = require("./controllers/country");
const zoneCtrl = require("./controllers/zone");
const stateCtrl = require("./controllers/state");
const geographyCtrl = require("./controllers/geography");
const cityCtrl = require("./controllers/city");
const userCtrl = require("./controllers/users");
const orgCtrl = require("./controllers/organization")
const customerCtrl = require("./controllers/customer")
const productCtrl = require("./controllers/product")
const categoryCtrl = require("./controllers/category")


// routes
router.get("/", homeCtrl.showWorking);
router.post("/geography", geographyCtrl.addGeography);

router.get("/countries", countryCtrl.get);
router.post("/country", countryCtrl.add);
router.put("/country", countryCtrl.update);
router.post("/country/delete", countryCtrl.delete);
router.post("/country/toggle", countryCtrl.toggleStatus)

router.get("/zones", zoneCtrl.get);
router.post("/zone", zoneCtrl.add);
router.put("/zone", zoneCtrl.update);
router.post("/zone/delete", zoneCtrl.delete);
router.post("/zone/toggle", zoneCtrl.toggleStatus)


router.get("/states", stateCtrl.get);
router.post("/state", stateCtrl.add);
router.put("/state", stateCtrl.update);
router.post("/state/delete", stateCtrl.delete);
router.post("/state/toggle", stateCtrl.toggleStatus)

router.get("/cities", cityCtrl.get);
router.post("/city", cityCtrl.add);
router.put("/city", cityCtrl.update);
router.post("/city/delete", cityCtrl.delete);
router.post("/city/toggle", cityCtrl.toggleStatus)

router.post("/login", userCtrl.login);
router.post("/change-password", userCtrl.changePassword);
router.post("/forget-password", userCtrl.forgetPassword);
router.post("/forget-password-otp", userCtrl.forgetPasswordOtp);
router.post("/forget-password-change", userCtrl.forgetPasswordChange);

router.post("/organization", orgCtrl.addOrganization);
router.post("/organization/delete/:id", orgCtrl.deleteOrganization);
router.post("/organization/:id", orgCtrl.editOrganization);
router.get("/organizations", orgCtrl.listOrganizations);
router.get("/organization/:id", orgCtrl.getOrganization);

router.post("/customer", customerCtrl.addCustomer);
router.post("/customer/delete/:id", customerCtrl.deleteCustomer);
router.post("/customer/:id", customerCtrl.editCustomer);
router.get("/customers", customerCtrl.listCustomers);
router.get("/customer/:id", customerCtrl.getCustomer);

router.post("/product", productCtrl.addProduct);
router.post("/product/delete/:id", productCtrl.deleteProduct);
router.post("/product/:id", productCtrl.editProduct);
router.get("/products", productCtrl.listProducts);
router.get("/products/customer", productCtrl.listProductByCustomer);



router.get("/categories", categoryCtrl.get);
router.post("/category", categoryCtrl.add);
router.put("/category", categoryCtrl.update);
router.post("/category/delete", categoryCtrl.delete);
router.post("/category/toggle", categoryCtrl.toggleStatus)

router.get("/sub-categories", categoryCtrl.get);
router.post("/sub-category", categoryCtrl.add);
router.put("/sub-category", categoryCtrl.update);
router.post("/sub-category/delete", categoryCtrl.delete);
router.post("/sub-category/toggle", categoryCtrl.toggleStatus)



module.exports = router;

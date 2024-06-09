const express = require("express");
const router = express.Router();

// import controllers
const homeCtrl = require("./controllers/home");
const countryCtrl = require("./controllers/country");
const zoneCtrl = require("./controllers/zone");
const regionCtrl = require("./controllers/region");
const stateCtrl = require("./controllers/state");
const districtCtrl = require("./controllers/district");
const cityCtrl = require("./controllers/city");
const localityCtrl = require("./controllers/locality");
const userCtrl = require("./controllers/users");
const orgCtrl = require("./controllers/organization")
const customerCtrl = require("./controllers/customer")


// routes
router.get("/", homeCtrl.showWorking);

router.get("/countries", countryCtrl.get);
router.post("/country", countryCtrl.add);
router.put("/country", countryCtrl.update);
router.post("/country/delete", countryCtrl.delete);

router.get("/zones", zoneCtrl.get);
router.post("/zone", zoneCtrl.add);
router.put("/zone", zoneCtrl.update);
router.post("/zone/delete", zoneCtrl.delete);

router.get("/regions", regionCtrl.get);
router.post("/region", regionCtrl.add);
router.put("/region", regionCtrl.update);
router.post("/region/delete", regionCtrl.delete);

router.get("/states", stateCtrl.get);
router.post("/state", stateCtrl.add);
router.put("/state", stateCtrl.update);
router.post("/state/delete", stateCtrl.delete);

router.get("/districts", districtCtrl.get);
router.post("/district", districtCtrl.add);
router.put("/district", districtCtrl.update);
router.post("/district/delete", districtCtrl.delete);

router.get("/cities", cityCtrl.get);
router.post("/city", cityCtrl.add);
router.put("/city", cityCtrl.update);
router.post("/city/delete", cityCtrl.delete);

router.get("/localities", localityCtrl.get);
router.post("/locality", localityCtrl.add);
router.put("/locality", localityCtrl.update);
router.post("/locality/delete", localityCtrl.delete);


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


module.exports = router;

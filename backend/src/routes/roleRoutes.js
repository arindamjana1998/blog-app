const express = require("express");
const router = express.Router();
const { getRoles, createRole, deleteRole } = require("../controllers/roleController");
const { protect } = require("../middlewares/auth");
const { authorize } = require("../middlewares/rbac");

router.route("/")
  .get(protect, authorize("admin"), getRoles)
  .post(protect, authorize("admin"), createRole);

router.route("/:id")
  .delete(protect, authorize("admin"), deleteRole);

module.exports = router;

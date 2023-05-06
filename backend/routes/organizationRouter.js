const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');

const { protect } = require('../middleware/authToken')

// Create a new organization
router.post('/', organizationController.newOrganization);

// Get a organization by ID
router.get('/:id', organizationController.getOrganization);

// Update a organization by ID
router.put('/:id', organizationController.updateOrganization);

// Delete a organization by ID
router.delete('/:id', organizationController.deleteOrganization);

// Get a organization by user ID
router.get('/user/:userId', organizationController.getOrganizationByUserId);

// Delete a organization by user ID
router.delete('/user/:userId', organizationController.deleteOrganizationByUserId);

module.exports = router;
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler') // replaces try catch blocks
const Organization = require('../models/organizationModel');

// Create a new organization
const newOrganization = asyncHandler(async (req, res) => {
  const { org_name } = req.body;
  const existingOrganization = await Organization.findOne({ org_name }); // Check if a organization with the given org_name exists

  if (existingOrganization) {
    // If a organization with the given org_name already exists, send an error response
    return res.status(400).send({ error: 'Organization already exists for the given org name' });
  }

  // If no existing organization found, create a new one
  const organization = new Organization(req.body);
  await organization.save();

  res.status(201).send(organization);
});

// Get a organization by ID
const getOrganization = asyncHandler(async (req, res) => {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).send({ error: 'Organization not found' });
    }
    res.send(organization);
});

// Get a organization by user ID
const getOrganizationByUserId = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const organization = await Organization.findOne({ userId: userId });
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.status(200).json(organization);
});

// Update a organization by ID
const updateOrganization = asyncHandler(async (req, res) => {
    const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!organization) {
      return res.status(404).send({ error: 'Organization not found' });
    }
    res.send(organization);
});

// Delete a organization by ID
const deleteOrganization = asyncHandler(async (req, res) => {
    const organization = await Organization.findByIdAndDelete(req.params.id);
    if (!organization) {
      return res.status(404).send({ error: 'Organization not found' });
    }
    res.send(organization);
});

// Delete a organization by user ID
const deleteOrganizationByUserId = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const organization = await Organization.findOneAndDelete({ userId: userId });
    if (!organization) {
      return res.status(404).send({ error: 'Organization not found' });
    }
    res.send(organization);
});
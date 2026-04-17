const contentService = require('../services/contentService');

const getContents = async (req, res, next) => {
    try {
        const contents = await contentService.getAllContents();
        res.json(contents);
    } catch (error) {
        next(error);
    }
};

const getContentById = async (req, res, next) => {
    try {
        const content = await contentService.getContentById(req.params.id);
        res.json(content);
    } catch (error) {
        next(error);
    }
};

const createContent = async (req, res, next) => {
    try {
        const content = await contentService.createContent(req.body, req.user._id);
        res.status(201).json(content);
    } catch (error) {
        next(error);
    }
};

const updateContent = async (req, res, next) => {
    try {
        const content = await contentService.updateContent(req.params.id, req.body, req.user._id);
        res.json(content);
    } catch (error) {
        next(error);
    }
};

const submitContent = async (req, res, next) => {
    try {
        const content = await contentService.submitContent(req.params.id, req.user._id);
        res.json(content);
    } catch (error) {
        next(error);
    }
};

const approveContent = async (req, res, next) => {
    try {
        const content = await contentService.approveContent(
            req.params.id, 
            req.user._id, 
            req.user.role.slug, 
            req.body.comment
        );
        res.json(content);
    } catch (error) {
        next(error);
    }
};

const rejectContent = async (req, res, next) => {
    try {
        const content = await contentService.rejectContent(
            req.params.id, 
            req.user._id, 
            req.user.role.slug, 
            req.body.comment
        );
        res.json(content);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getContents,
    getContentById,
    createContent,
    updateContent,
    submitContent,
    approveContent,
    rejectContent
};


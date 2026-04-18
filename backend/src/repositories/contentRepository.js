const Content = require("../models/Content");

class ContentRepository {
  async findAll(query = {}) {
    return await Content.find(query)
      .populate("createdBy", "username")
      .populate("updatedBy", "username")
      .populate("approvalHistory.actedBy", "username")
      .sort({ updatedAt: -1 });
  }

  async findById(id) {
    return await Content.findById(id)
      .populate("createdBy", "username")
      .populate("updatedBy", "username")
      .populate("approvalHistory.actedBy", "username");
  }

  async create(contentData) {
    return await Content.create(contentData);
  }

  async update(id, updateData) {
    return await Content.findByIdAndUpdate(id, updateData, { new: true })
      .populate("createdBy", "username")
      .populate("updatedBy", "username")
      .populate("approvalHistory.actedBy", "username");
  }

  async save(content) {
    return await content.save();
  }
}

module.exports = new ContentRepository();

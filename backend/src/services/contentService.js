const contentRepository = require("../repositories/contentRepository");
const AppError = require("../utils/appError");

class ContentService {
  async getAllContents() {
    return await contentRepository.findAll();
  }

  async getContentById(id) {
    const content = await contentRepository.findById(id);
    if (!content) {
      throw new AppError("Content not found", 404);
    }
    return content;
  }

  async createContent(data, userId) {
    const { title, description } = data;
    return await contentRepository.create({
      title,
      description,
      createdBy: userId,
      status: "draft",
      currentStep: "draft",
    });
  }

  async updateContent(id, data, userId, userRole) {
    const content = await contentRepository.findById(id);
    if (!content) throw new AppError("Content not found", 404);

    // CRITICAL RULE: Once content status = "published": It becomes READ-ONLY
    if (content.status === "published") {
      throw new AppError("Published content cannot be edited", 400);
    }

    // Creator: Can edit ONLY if status is draft or rejected AND they own it
    if (userRole === "creator") {
      if (content.createdBy._id.toString() !== userId.toString()) {
        throw new AppError("You can only edit your own content", 403);
      }
      if (!["draft", "rejected"].includes(content.status)) {
        throw new AppError(
          "You can only edit content if it is in draft or rejected status",
          400,
        );
      }
    }

    // Admin: Can edit anything NOT published (handled above)
    // Reviewer: Cannot edit content (as per requirements)
    if (userRole === "reviewer") {
      throw new AppError("Reviewers cannot edit content", 403);
    }

    const updateData = {
      title: data.title || content.title,
      description: data.description || content.description,
      updatedBy: userId,
    };

    // If rejected, moving back to draft for modification
    if (content.status === "rejected") {
      updateData.status = "draft";
      updateData.currentStep = "draft";
      updateData.version = (content.version || 1) + 1;
    }

    return await contentRepository.update(id, updateData);
  }

  async submitContent(id, userId, userRole) {
    const content = await contentRepository.findById(id);
    if (!content) throw new AppError("Content not found", 404);

    // Only creator or admin can submit
    if (
      userRole === "creator" &&
      content.createdBy._id.toString() !== userId.toString()
    ) {
      throw new AppError("You can only submit your own content", 403);
    }

    if (!["draft", "rejected"].includes(content.status)) {
      throw new AppError(
        "Only draft or rejected content can be submitted",
        400,
      );
    }

    content.status = "pending_review_level_1";
    content.currentStep = "review_level_1";
    content.approvalHistory.push({
      step: 1,
      action: "SUBMITTED",
      actedBy: userId,
      actedAt: Date.now(),
    });

    await contentRepository.save(content);
    return await contentRepository.findById(id);
  }

  async approveContent(id, userId, userRole, comment) {
    const content = await contentRepository.findById(id);
    if (!content) throw new AppError("Content not found", 404);

    if (userRole === "creator") {
      throw new AppError("Creators cannot approve content", 403);
    }

    if (content.status === "pending_review_level_1") {
      content.status = "pending_review_level_2";
      content.currentStep = "review_level_2";
      content.approvalHistory.push({
        step: 1,
        action: "APPROVED",
        comment,
        actedBy: userId,
      });
    } else if (content.status === "pending_review_level_2") {
      // Segregation of Duties: Check if current user was the L1 reviewer (Admins exempt)
      const l1Review = content.approvalHistory.find(
        (h) => h.step === 1 && h.action === "APPROVED",
      );
      if (
        userRole !== "admin" &&
        l1Review &&
        l1Review.actedBy.toString() === userId.toString()
      ) {
        throw new AppError(
          "You cannot perform Level 2 approval as you were the Level 1 reviewer",
          400,
        );
      }

      content.status = "approved";
      content.currentStep = "approved";
      content.approvalHistory.push({
        step: 2,
        action: "APPROVED",
        comment,
        actedBy: userId,
      });
    } else {
      throw new AppError("Content is not in a state that can be approved", 400);
    }

    await contentRepository.save(content);
    return await contentRepository.findById(id);
  }

  async rejectContent(id, userId, userRole, comment) {
    const content = await contentRepository.findById(id);
    if (!content) throw new AppError("Content not found", 404);

    if (userRole === "creator") {
      throw new AppError("Creators cannot reject content", 403);
    }

    if (
      !["pending_review_level_1", "pending_review_level_2"].includes(
        content.status,
      )
    ) {
      throw new AppError("Only content in review can be rejected", 400);
    }

    content.status = "rejected";
    content.currentStep = "rejected";
    content.approvalHistory.push({
      step: content.status === "pending_review_level_1" ? 1 : 2,
      action: "REJECTED",
      comment,
      actedBy: userId,
    });

    await contentRepository.save(content);
    return await contentRepository.findById(id);
  }

  async publishContent(id, userId, userRole) {
    const content = await contentRepository.findById(id);
    if (!content) throw new AppError("Content not found", 404);

    // Admin and Reviewer can publish
    if (!["admin", "reviewer"].includes(userRole)) {
      throw new AppError(
        "Only administrators or reviewers can publish content",
        403,
      );
    }

    if (content.status !== "approved") {
      throw new AppError("Only approved content can be published", 400);
    }

    content.status = "published";
    content.currentStep = "published";
    content.approvalHistory.push({
      step: 3,
      action: "PUBLISHED",
      actedBy: userId,
    });

    await contentRepository.save(content);
    return await contentRepository.findById(id);
  }

  async unpublishContent(id, userId, userRole) {
    const content = await contentRepository.findById(id);
    if (!content) throw new AppError("Content not found", 404);

    if (userRole !== "admin") {
      throw new AppError("Only administrators can unpublish content", 403);
    }

    if (content.status !== "published") {
      throw new AppError("Only published content can be unpublished", 400);
    }

    content.status = "approved";
    content.currentStep = "approved";
    content.approvalHistory.push({
      step: 4,
      action: "UNPUBLISHED",
      actedBy: userId,
    });

    await contentRepository.save(content);
    return await contentRepository.findById(id);
  }
}

module.exports = new ContentService();

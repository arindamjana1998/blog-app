"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { contentService } from "@/services/contentService";
import { Content } from "@/types";
import ContentHeader from "@/components/content/ContentHeader";
import ContentTable from "@/components/content/ContentTable";
import ContentModal from "@/components/content/ContentModal";
import DetailsModal from "@/components/content/DetailsModal";
import WorkflowModal from "@/components/content/WorkflowModal";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { toast } from "react-toastify";

const ContentPage = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [workflowType, setWorkflowType] = useState<"approve" | "reject">(
    "approve"
  );
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");

  const filteredContents = contents.filter((c) => {
    if (!statusFilter || statusFilter === "ALL") return true;
    return c.status === statusFilter;
  });

  const fetchContents = async () => {
    try {
      const data = await contentService.getContents();
      setContents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleAction = async (content: Content, action: string) => {
    if (action === "edit") {
      setSelectedContent(content);
      setIsCreateModalOpen(true);
    } else if (action === "submit") {
      setSelectedContent(content);
      setIsConfirmModalOpen(true);
    } else if (action === "approve") {
      setSelectedContent(content);
      setWorkflowType("approve");
      setIsWorkflowModalOpen(true);
    } else if (action === "reject") {
      setSelectedContent(content);
      setWorkflowType("reject");
      setIsWorkflowModalOpen(true);
    }
  };

  const handleConfirmSubmit = async () => {
    if (selectedContent) {
      await contentService.submitContent(selectedContent._id);
      toast.success("Content submitted for review");
      setIsConfirmModalOpen(false);
      fetchContents();
    }
  };

  const handleViewDetails = (content: Content) => {
    setSelectedContent(content);
    setIsDetailsModalOpen(true);
  };

  if (loading) return <div className="p-8">Loading content...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <ContentHeader
        onNewContent={() => {
          setSelectedContent(null);
          setIsCreateModalOpen(true);
        }}
      />

      <ContentTable
        contents={filteredContents}
        onAction={handleAction}
        onViewDetails={handleViewDetails}
      />

      <ContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchContents}
        content={selectedContent}
      />

      <WorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        onSuccess={fetchContents}
        content={selectedContent}
        type={workflowType}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        content={selectedContent}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        title="Submit Content"
        message={`Are you sure you want to submit "${selectedContent?.title}" for level 1 review?`}
        confirmLabel="Submit"
        variant="primary"
      />
    </div>
  );
};

export default ContentPage;

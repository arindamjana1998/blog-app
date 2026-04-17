"use client";

import React, { useEffect, useState } from "react";
import { userService } from "@/services/contentService";
import { User } from "@/types";
import UserTable from "@/components/users/UserTable";
import UserHeader from "@/components/users/UserHeader";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import UserModal from "@/components/users/UserModal";
import { toast } from "react-toastify";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = (id: string) => {
    setSelectedUserId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId) {
      try {
        await userService.deleteUser(selectedUserId);
        toast.success("User deleted successfully");
        setIsConfirmModalOpen(false);
        fetchUsers();
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  if (loading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <UserHeader onCreateUser={() => setIsCreateModalOpen(true)} />

      <UserTable users={users} onDelete={handleDeleteUser} />

      <UserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchUsers}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};

export default UsersPage;

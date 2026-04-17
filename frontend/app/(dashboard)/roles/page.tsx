"use client";
import RoleHeader from "@/components/roles/RoleHeader";
import RoleTable from "@/components/roles/RoleTable";
import { userService } from "@/services/contentService";
import { Role } from "@/types";
import { useEffect, useState } from "react";

const RolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      const data = await userService.getRoles();
      setRoles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (loading) return <div className="p-8">Loading roles...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <RoleHeader />

      <RoleTable roles={roles} onRefresh={fetchRoles} />
    </div>
  );
};

export default RolesPage;

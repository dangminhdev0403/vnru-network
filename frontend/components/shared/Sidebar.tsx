"use client";

import WorkspaceSidebar, { type WorkspaceSidebarProps } from "@/features/workspace/components/WorkspaceSidebar";
import React from "react";

export type SidebarProps = WorkspaceSidebarProps;

export default function Sidebar(props: SidebarProps) {
  return <WorkspaceSidebar {...props} />;
}

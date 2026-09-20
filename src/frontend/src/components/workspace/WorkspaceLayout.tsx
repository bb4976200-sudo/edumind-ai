import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface WorkspaceLayoutProps {
  sidebar: ReactNode;
  chat: ReactNode;
  studyMaterial: ReactNode;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Three-panel workspace grid: collapsible navigation, the AI conversation and
 * the study-material generator. Panels stack on small screens.
 */
export function WorkspaceLayout({
  sidebar,
  chat,
  studyMaterial,
  className,
  "data-ocid": dataOcid,
}: WorkspaceLayoutProps) {
  return (
    <div
      data-ocid={dataOcid ?? "workspace.layout"}
      className={cn(
        "grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_20rem]",
        className,
      )}
    >
      <aside
        data-ocid="workspace.sidebar"
        className="overflow-hidden rounded-lg border border-border bg-card shadow-subtle lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]"
      >
        {sidebar}
      </aside>

      <section
        data-ocid="workspace.chat_panel"
        className="flex min-h-[32rem] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-subtle lg:h-[calc(100vh-6rem)] lg:min-h-0"
      >
        {chat}
      </section>

      <aside
        data-ocid="workspace.study_material_panel"
        className="rounded-lg border border-border bg-card p-4 shadow-subtle xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto"
      >
        {studyMaterial}
      </aside>
    </div>
  );
}

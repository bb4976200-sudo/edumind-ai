import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ConversationSummary } from "@/types/view";
import { formatRelative } from "@/types/view";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BrainCircuit, MessageSquare } from "lucide-react";

interface RecentChatsCardProps {
  conversations: ConversationSummary[];
  isLoading: boolean;
}

/** Dashboard card listing the most recent AI study conversations. */
export function RecentChatsCard({
  conversations,
  isLoading,
}: RecentChatsCardProps) {
  return (
    <Card data-ocid="dashboard.chats.card" className="shadow-subtle">
      <CardHeader>
        <CardTitle className="font-display text-base">
          Recent AI Chats
        </CardTitle>
        <CardDescription>
          Conversations grounded in your notebook sources.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <LoadingSkeleton variant="list" count={3} />
        ) : conversations.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No conversations yet"
            description="Open AI Study inside a notebook and ask your first question."
            action={
              <Button asChild className="rounded-full">
                <Link to="/study" data-ocid="dashboard.chats.empty_link">
                  <BrainCircuit className="size-4" aria-hidden="true" />
                  Start studying
                </Link>
              </Button>
            }
          />
        ) : (
          <ul data-ocid="dashboard.chats.list" className="space-y-3">
            {conversations.map((item, index) => (
              <li key={item.conversation.id.toString()}>
                <Link
                  to="/study"
                  data-ocid={`dashboard.chats.item.${index + 1}`}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-background/60 px-4 py-3.5 transition-smooth hover:border-primary/40 hover:bg-secondary/60 focus-ring"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <MessageSquare className="size-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-foreground">
                      {item.conversation.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary">
                        {Number(item.messageCount)} messages
                      </Badge>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {formatRelative(item.conversation.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <ArrowRight
                    className="hidden size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

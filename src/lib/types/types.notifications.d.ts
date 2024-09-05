import type { NotificationsHistoryMain } from "@betarena/scores-lib/types/v8/_HASURA-0.js";

export interface INotificationsConfigSection
{
  title: string;
  type: "general" | "push" | "mail";
  options: {
    id: number;
    label: string;
    checked: boolean;
  }[];
}

export interface INotificationMessage extends NotificationsHistoryMain
{
  template: string;
}
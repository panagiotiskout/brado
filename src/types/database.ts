export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          avatar_path: string | null;
          doctor_doc_path: string | null;
          approval_status: "pending" | "approved" | "rejected";
          role: "member" | "admin";
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          starts_at: string;
          status: "confirmed" | "cancelled";
          created_at: string;
          cancelled_at: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string | null;
          starts_on: string;
          ends_on: string;
          status: "active" | "expired" | "cancelled";
          amount_cents: number | null;
          payment_method:
            | "cash"
            | "bank"
            | "iris"
            | "stripe"
            | "other"
            | null;
          notes: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
        };
      };
      plans: {
        Row: {
          id: string;
          slug: string;
          name_el: string;
          name_en: string;
          price_cents: number;
          duration_days: number;
          active: boolean;
          created_at: string;
        };
      };
      closed_days: {
        Row: { date: string; reason: string | null };
      };
      gym_settings: {
        Row: { key: string; value: Json };
      };
    };
    Functions: {
      create_booking: {
        Args: { p_user_id: string; p_starts_at: string };
        Returns: string;
      };
    };
  };
};

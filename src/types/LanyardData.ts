export interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Array<{
    name: string;
    details?: string;
    state?: string;
    timestamps?: {
      start: number;
      end: number;
    };
    assets?: {
      large_image: string;
      large_text?: string;
    };
  }>;
  listening_to_spotify: boolean;
}

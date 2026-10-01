import { User } from "lucide-react";

interface UserAvatarProps {
  username: string;
  avatarUrl: string | null;
  /** Tailwind size classes, e.g. "size-9" or "size-24". */
  className?: string;
}

/** Round avatar: the uploaded picture, else the username's initial, else a generic icon. */
export function UserAvatar({
  username,
  avatarUrl,
  className = "size-9",
}: UserAvatarProps) {
  const initial = username.trim().charAt(0).toUpperCase();

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground ${className}`}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={username ? `${username}'s profile picture` : "Profile picture"}
          className="h-full w-full object-cover"
        />
      ) : initial ? (
        <span className="font-heading text-[1.1em] font-medium text-foreground">
          {initial}
        </span>
      ) : (
        <User className="size-1/2" />
      )}
    </span>
  );
}

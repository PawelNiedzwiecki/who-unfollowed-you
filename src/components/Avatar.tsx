interface AvatarProps {
  username: string;
  size?: number;
}

function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 45%)`;
}

export default function Avatar({ username, size = 36 }: AvatarProps) {
  const letter = username.charAt(0).toUpperCase();
  const bg = hashColor(username);

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-mono text-sm font-medium text-white"
      style={{ width: size, height: size, backgroundColor: bg }}
    >
      {letter}
    </div>
  );
}

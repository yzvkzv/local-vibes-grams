export default function Avatar({
  name,
  username,
  color,
  size = 40,
}: {
  name: string;
  username: string;
  color: string;
  size?: number;
}) {
  const initial = (username || name || "?").charAt(0).toUpperCase();
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.42,
      }}
      aria-label={name}
    >
      {initial}
    </span>
  );
}

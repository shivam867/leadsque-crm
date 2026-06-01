export default function Divider() {
  return (
    <div className="relative w-full h-16 overflow-hidden" style={{ background: "#F8F7F4" }}>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>
      </div>
    </div>
  );
}
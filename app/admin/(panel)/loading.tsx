export default function PanelLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="text-[13px] text-[#6B6B6B] motion-safe:animate-pulse">
        Cargando...
      </span>
    </div>
  );
}

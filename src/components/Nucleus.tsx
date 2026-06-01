export function Nucleus() {
  return (
    <div className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-96 sm:w-96">
      <div className="absolute inset-0 rounded-full bg-gradient-nucleus opacity-20 blur-3xl animate-breathe" />
      <div className="absolute inset-8 rounded-full bg-gradient-nucleus opacity-30 blur-2xl animate-drift" />
      <div className="relative h-44 w-44 rounded-full bg-gradient-nucleus shadow-nucleus animate-breathe sm:h-56 sm:w-56" />
      <div className="pointer-events-none absolute inset-0">
        {[
          { c: "bg-health-green", x: "10%", y: "20%" },
          { c: "bg-health-blue", x: "85%", y: "30%" },
          { c: "bg-health-yellow", x: "75%", y: "85%" },
          { c: "bg-health-purple", x: "15%", y: "80%" },
        ].map((p, i) => (
          <span
            key={i}
            className={`absolute h-3 w-3 rounded-full ${p.c} opacity-70 animate-breathe`}
            style={{ left: p.x, top: p.y, animationDelay: `${i * 0.8}s` }}
          />
        ))}
      </div>
    </div>
  );
}

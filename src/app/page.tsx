import CountdownApp from "@/components/CountdownApp";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <main className="flex flex-1 flex-col">
        <CountdownApp />
      </main>
      <footer className="pb-6 text-center text-xs text-muted">
        Event Countdown
      </footer>
    </div>
  );
}

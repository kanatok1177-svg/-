import TaskTracker from "@/components/TaskTracker";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-10 sm:py-16">
      <TaskTracker />
    </div>
  );
}

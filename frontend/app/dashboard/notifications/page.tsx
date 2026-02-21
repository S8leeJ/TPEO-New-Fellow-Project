export const dynamic = 'force-dynamic';

const FAKE_NOTIFICATIONS = [
  {
    id: "1",
    title: "New unit available at 26 West",
    message: "A 2B/2B unit on floor 5 just became available.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Price drop at Rise at West Campus",
    message: "Floor plan 3B/2B reduced by $150/month.",
    time: "1 day ago",
    read: false,
  },
  {
    id: "3",
    title: "Compare saved",
    message: "Your comparison of 26 West and The Standard has been saved.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "4",
    title: "New apartment added",
    message: "Moontower has been added to WAMP+. Check it out!",
    time: "3 days ago",
    read: true,
  },
  {
    id: "5",
    title: "Reminder: Tour scheduled",
    message: "You have a tour at Union on 24th tomorrow at 2pm.",
    time: "4 days ago",
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Notifications</h1>
      <ul className="space-y-1">
        {FAKE_NOTIFICATIONS.map((n) => (
          <li
            key={n.id}
            className={`rounded-lg border p-4 ${
              n.read
                ? "border-zinc-200 bg-white"
                : "border-zinc-200 bg-zinc-50"
            }`}
          >
            <div className="flex gap-3">
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    n.read ? "text-zinc-700" : "text-zinc-900"
                  }`}
                >
                  {n.title}
                </p>
                <p className="mt-0.5 text-sm text-zinc-500">{n.message}</p>
                <p className="mt-1 text-xs text-zinc-400">{n.time}</p>
              </div>
              {!n.read && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-zinc-800" />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

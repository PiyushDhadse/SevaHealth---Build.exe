"use client";

export default function Alertbox() {
  const alerts = [
    {
      id: 1,
      title: "Dengue Outbreak Alert",
      message: "Increase in dengue cases reported. Immediate action required.",
      issuedBy: "Dr. Anjali Sharma",
      date: "2026-01-12",
      type: "critical",
      fileUrl: "/alerts/sample-alert.pdf",
    },
    {
      id: 2,
      title: "Vaccination Drive Reminder",
      message: "Ensure all children under 5 are vaccinated.",
      issuedBy: "Health Department",
      date: "2026-01-10",
      type: "info",
      fileUrl: null,
    },
  ];

  const styles = {
    critical: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Alerts</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-2xl p-5 shadow-sm ${styles[alert.type]}`}
          >
            <div className="flex justify-between text-xs mb-2">
              <span className="font-semibold uppercase">{alert.type}</span>
              <span>{alert.date}</span>
            </div>

            <h3 className="text-lg font-semibold">{alert.title}</h3>

            <p className="text-sm mt-2">{alert.message}</p>

            <p className="text-xs mt-3 opacity-80">
              Issued by <span className="font-medium">{alert.issuedBy}</span>
            </p>

            {alert.fileUrl && (
              <div className="mt-4 flex justify-end">
                <a
                  href={alert.fileUrl}
                  download
                  className="text-sm px-4 py-2 border border-current rounded-lg hover:bg-white/40"
                >
                  ⬇ Download
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

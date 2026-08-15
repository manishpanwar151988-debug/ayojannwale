// Booking status configuration shared across booking UI

export const STATUS_FLOW = ["pending", "confirmed", "in_progress", "completed"];

export const STATUS_META = {
  pending: { label: "Requested", desc: "Awaiting vendor confirmation", color: "#E87817", bg: "rgba(232,120,23,0.12)" },
  confirmed: { label: "Confirmed", desc: "Vendor accepted your booking", color: "#4F7B5B", bg: "rgba(79,123,91,0.14)" },
  in_progress: { label: "In Progress", desc: "Work is underway", color: "#4A1748", bg: "rgba(74,23,72,0.10)" },
  completed: { label: "Completed", desc: "Event delivered successfully", color: "#4F7B5B", bg: "rgba(79,123,91,0.16)" },
  cancelled: { label: "Cancelled", desc: "This booking was cancelled", color: "#E85D5D", bg: "rgba(232,93,93,0.12)" },
};

export const formatDate = (iso) => {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return iso;
  }
};

export const isActive = (s) => ["pending", "confirmed", "in_progress"].includes(s);

const STEPS = [
  { key: "pending",    label: "Order Placed", icon: "fa-receipt" },
  { key: "processing", label: "Processing",   icon: "fa-box-open" },
  { key: "shipped",    label: "Shipped",      icon: "fa-shipping-fast" },
  { key: "delivered",  label: "Delivered",    icon: "fa-home" },
];

const OrderTimeline = ({ status }) => {
  if (status === "cancelled") {
    return (
      <div className="order-timeline cancelled">
        <i className="fal fa-times-circle"></i>
        <span>This order was cancelled</span>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="order-timeline">
      {STEPS.map((step, i) => {
        const done   = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step.key} className={`timeline-step ${done ? "done" : ""} ${active ? "active" : ""}`}>
            <div className="timeline-icon">
              <i className={`fal ${done ? "fa-check" : step.icon}`}></i>
            </div>
            <span className="timeline-label">{step.label}</span>
            {i < STEPS.length - 1 && <div className={`timeline-line ${done ? "done" : ""}`}></div>}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;

import { AlertTriangle } from "lucide-react";
import React, { useEffect, useState } from "react";

const SlaCountdown = ({
  assignedAt,
  durationMinutes,
}: {
  assignedAt: Date;
  durationMinutes: number;
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const createdAt = new Date(assignedAt);
    const slaDeadline = createdAt.getTime() + durationMinutes * 60 * 1000;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = slaDeadline - now;
      setTimeLeft(diff > 0 ? diff : 0);
    };

    updateCountdown(); // run immediately
    const interval = setInterval(updateCountdown, 1000); // update every second

    return () => clearInterval(interval); // cleanup on unmount
  }, [assignedAt, durationMinutes]);

  if (timeLeft <= 0) {
    return (
      <span>
        <span className="flex items-center gap-1 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          SLA Breached
        </span>
      </span>
    );
    // return <span className="text-red-600">SLA Breached</span>;
  }

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <span className="flex items-center gap-1 text-green-600">
      <AlertTriangle className="h-4 w-4" />
      {hours > 0 && `${hours}h `}
      {minutes}m {seconds}s remaining
    </span>
  );
};

export default SlaCountdown;

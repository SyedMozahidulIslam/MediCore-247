/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Clock, ShieldAlert, CheckCircle, Activity, Moon } from "lucide-react";
import { UserRole, AvailabilityStatus } from "../../types";
import { employeesData } from "../../data/employees";

export const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine current hospital shift based on hour
  const hour = time.getHours();
  let currentShift: "Morning" | "Evening" | "Night" = "Morning";
  let shiftTimeRange = "06:00 - 14:00";
  if (hour >= 14 && hour < 22) {
    currentShift = "Evening";
    shiftTimeRange = "14:00 - 22:00";
  } else if (hour >= 22 || hour < 6) {
    currentShift = "Night";
    shiftTimeRange = "22:00 - 06:00";
  }

  // Count active doctors (Available, In Consultation, On Surgery, Emergency)
  const availableDoctors = employeesData.filter(
    e => e.role === UserRole.DOCTOR && e.availability !== AvailabilityStatus.OFFLINE && e.availability !== AvailabilityStatus.VACATION
  ).length;

  // Static Dhaka prayer times schedule for the current date (standard/general estimates)
  const getPrayerTimes = () => {
    return {
      Fajr: "04:15 AM",
      Dhuhr: "12:15 PM",
      Asr: "04:45 PM",
      Maghrib: "06:55 PM",
      Isha: "08:20 PM"
    };
  };

  const prayers = getPrayerTimes();

  // Find next upcoming prayer
  const getNextPrayer = () => {
    const min = time.getMinutes();
    const currHour = time.getHours();
    const totalMins = currHour * 60 + min;

    // Map prayers to minutes from midnight
    const times = [
      { name: "Fajr", mins: 4 * 60 + 15 },
      { name: "Dhuhr", mins: 12 * 60 + 15 },
      { name: "Asr", mins: 16 * 60 + 45 },
      { name: "Maghrib", mins: 18 * 60 + 55 },
      { name: "Isha", mins: 20 * 60 + 20 }
    ];

    const next = times.find(p => p.mins > totalMins) || times[0];
    return next;
  };

  const nextPrayer = getNextPrayer();

  return (
    <div className="bg-gradient-to-br from-teal-950/70 to-emerald-950/70 backdrop-blur-md text-white rounded-3xl p-5 shadow-lg border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="text-sm font-medium tracking-wide text-emerald-300 uppercase">Live Command Clock</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-xs text-emerald-300">
          <Activity className="w-3.5 h-3.5" />
          <span className="font-semibold">24/7 ONLINE</span>
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <span className="text-4xl font-mono font-bold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-teal-300 bg-clip-text text-transparent">
          {time.toLocaleTimeString()}
        </span>
        <span className="text-xs text-teal-300 font-medium tracking-wide mt-1">
          {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-teal-800/60 pt-4 text-xs">
        <div>
          <p className="text-teal-400 font-medium">Hospital Shift</p>
          <p className="font-bold text-white text-sm">{currentShift} Shift</p>
          <p className="text-[10px] text-teal-300/80">{shiftTimeRange}</p>
        </div>
        <div>
          <p className="text-teal-400 font-medium">Active Clinicians</p>
          <p className="font-bold text-emerald-300 text-sm">{availableDoctors} On Duty</p>
          <p className="text-[10px] text-teal-300/80">Ready to respond</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-teal-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-teal-400 font-medium">Next Prayer: </span>
            <span className="font-bold text-white">{nextPrayer.name} ({nextPrayer.mins >= 12 * 60 ? prayers[nextPrayer.name as keyof typeof prayers] : prayers[nextPrayer.name as keyof typeof prayers]})</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-400">
          <CheckCircle className="w-3.5 h-3.5" />
          <span className="font-semibold text-[10px]">ALL SYSTEMS GREEN</span>
        </div>
      </div>
    </div>
  );
};

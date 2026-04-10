/** Shape exported by UT course schedule scrapers (see sample JSON). */

export type ScheduleMeetingLocation = {
  building?: string;
  room?: string;
};

export type ScheduleMeeting = {
  days?: string[];
  endTime?: number;
  startTime?: number;
  location?: ScheduleMeetingLocation;
};

export type ScheduleCourse = {
  fullName?: string;
  courseName?: string;
  department?: string;
  number?: string;
  uniqueId?: number;
  schedule?: { meetings?: ScheduleMeeting[] };
};

export type ScheduleFileRoot = {
  courses?: ScheduleCourse[];
  name?: string;
  id?: string;
};

export type ScheduleLocationPick = {
  key: string;
  buildingCode: string;
  room: string;
  courseLabel: string;
  daysLabel: string;
};

function meetingDaysLabel(days: string[] | undefined): string {
  if (!days?.length) return "";
  return days.join(", ");
}

/**
 * One row per class meeting that has a building (for dropdown).
 * Keys are stable for React / selection.
 */
export function extractScheduleLocationPicks(root: unknown): ScheduleLocationPick[] {
  if (!root || typeof root !== "object") {
    throw new Error("File must be a JSON object.");
  }
  const courses = (root as ScheduleFileRoot).courses;
  if (!Array.isArray(courses)) {
    throw new Error('Expected a "courses" array (UT schedule export format).');
  }

  const picks: ScheduleLocationPick[] = [];
  let idx = 0;

  for (const course of courses) {
    if (!course || typeof course !== "object") continue;
    const meetings = course.schedule?.meetings;
    if (!Array.isArray(meetings)) continue;

    const courseLabel =
      typeof course.fullName === "string"
        ? course.fullName
        : [course.department, course.number, course.courseName]
            .filter(Boolean)
            .join(" ");

    for (let mi = 0; mi < meetings.length; mi++) {
      const m = meetings[mi];
      const code = m?.location?.building?.trim();
      if (!code) continue;
      const room = (m.location?.room ?? "").trim();
      const daysLabel = meetingDaysLabel(m.days);
      const key = `${course.uniqueId ?? courseLabel}-${mi}-${idx++}`;
      picks.push({
        key,
        buildingCode: code.toUpperCase(),
        room,
        courseLabel: courseLabel || "Course",
        daysLabel,
      });
    }
  }

  return picks;
}

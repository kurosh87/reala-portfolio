"use client";

import { EventManager, type Event } from "@/components/ui/event-manager";

export default function EventManagerDemo() {
  const demoEvents: Event[] = [
    {
      id: "1",
      title: "Oakridge Avenue showing",
      description: "Private tour for Amelia Frost and her partner with prep notes ready for the listing agent.",
      startTime: new Date(2026, 3, 4, 11, 30),
      endTime: new Date(2026, 3, 4, 12, 15),
      color: "green",
      category: "Showing",
      attendees: ["Amelia Frost", "Listing agent"],
      tags: ["Confirmed", "Buyer", "Luxury"],
    },
    {
      id: "2",
      title: "Design review",
      description: "Review updated brochure copy and staging photos before the launch push.",
      startTime: new Date(2026, 3, 8, 9, 0),
      endTime: new Date(2026, 3, 8, 9, 45),
      color: "red",
      category: "Task",
      attendees: ["Marketing", "Alex"],
      tags: ["Work", "Important"],
    },
    {
      id: "3",
      title: "Buyer discussion",
      description: "Talk through offer posture and inspection timing for the Kitsilano shortlist.",
      startTime: new Date(2026, 3, 8, 11, 0),
      endTime: new Date(2026, 3, 8, 11, 30),
      color: "purple",
      category: "Meeting",
      attendees: ["Jordan Velasco"],
      tags: ["Buyer", "Urgent"],
    },
    {
      id: "4",
      title: "Market research",
      description: "Compare recent sold data for East Van semis before buyer callbacks.",
      startTime: new Date(2026, 3, 14, 10, 30),
      endTime: new Date(2026, 3, 14, 11, 30),
      color: "green",
      category: "Task",
      tags: ["Work"],
    },
    {
      id: "5",
      title: "Offer discussion",
      description: "Prep negotiation angles and deposit timing ahead of the evening call.",
      startTime: new Date(2026, 3, 14, 12, 0),
      endTime: new Date(2026, 3, 14, 12, 45),
      color: "purple",
      category: "Meeting",
      attendees: ["Buyer clients"],
      tags: ["Buyer", "Important"],
    },
    {
      id: "6",
      title: "Seller consult",
      description: "Review staging readiness and feedback from the first weekend of tours.",
      startTime: new Date(2026, 3, 19, 10, 0),
      endTime: new Date(2026, 3, 19, 11, 0),
      color: "pink",
      category: "Meeting",
      attendees: ["Seller"],
      tags: ["Seller"],
    },
    {
      id: "7",
      title: "New lead tour",
      description: "First walkthrough for a fresh relocation lead in Mount Pleasant.",
      startTime: new Date(2026, 3, 19, 13, 30),
      endTime: new Date(2026, 3, 19, 14, 15),
      color: "orange",
      category: "Showing",
      attendees: ["New lead"],
      tags: ["Buyer"],
    },
    {
      id: "8",
      title: "Team showing",
      description: "Joint showing coverage for the open block while Alex handles follow-up routing.",
      startTime: new Date(2026, 3, 22, 9, 30),
      endTime: new Date(2026, 3, 22, 10, 15),
      color: "green",
      category: "Showing",
      attendees: ["Alex", "Showing assistant"],
      tags: ["Team", "Confirmed"],
    },
    {
      id: "9",
      title: "Design review",
      description: "Sign off final ad set and agent social tiles before the Thursday post.",
      startTime: new Date(2026, 3, 22, 14, 0),
      endTime: new Date(2026, 3, 22, 14, 45),
      color: "red",
      category: "Task",
      tags: ["Work"],
    },
    {
      id: "10",
      title: "Meeting",
      description: "Weekly ops check-in on showing cadence and lead response times.",
      startTime: new Date(2026, 3, 28, 9, 0),
      endTime: new Date(2026, 3, 28, 10, 0),
      color: "green",
      category: "Meeting",
      attendees: ["Ops team"],
      tags: ["Team"],
    },
    {
      id: "11",
      title: "New deal",
      description: "Review intake packet and assign next steps after the consult.",
      startTime: new Date(2026, 3, 28, 12, 30),
      endTime: new Date(2026, 3, 28, 13, 0),
      color: "orange",
      category: "Task",
      tags: ["Urgent"],
    },
    {
      id: "12",
      title: "Discussion",
      description: "Talk through lender timing before a weekend offer window.",
      startTime: new Date(2026, 3, 28, 15, 0),
      endTime: new Date(2026, 3, 28, 15, 30),
      color: "purple",
      category: "Meeting",
      attendees: ["Buyer clients"],
      tags: ["Buyer"],
    },
  ];

  return (
    <div className="w-full">
      <EventManager
        events={demoEvents}
        onEventCreate={(event) => console.log("Created:", event)}
        onEventUpdate={(id, event) => console.log("Updated:", id, event)}
        onEventDelete={(id) => console.log("Deleted:", id)}
        categories={["Showing", "Meeting", "Task", "Reminder"]}
        availableTags={["Important", "Urgent", "Work", "Buyer", "Seller", "Team", "Confirmed", "Luxury"]}
        defaultView="month"
      />
    </div>
  );
}

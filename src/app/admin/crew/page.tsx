"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CrewMember } from "@/db/schema";

export default function AdminCrewPage() {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCrew();
  }, []);

  const fetchCrew = async () => {
    try {
      const res = await fetch("/api/crew");
      if (!res.ok) throw new Error("Failed to fetch crew");
      const data = await res.json();
      setCrewMembers(data);
    } catch (err) {
      setError("Failed to load crew members");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCrew = async (id: string) => {
    if (!confirm("Are you sure you want to delete this crew member?")) return;
    
    try {
      const res = await fetch(`/api/crew/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setCrewMembers(crewMembers.filter((c) => c.id !== id));
    } catch (err) {
      setError("Failed to delete crew member");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Crew Management</h1>
          <p className="text-[var(--theme-text-muted)] mt-1">Manage your team members</p>
        </div>
        <Link
          href="/admin/crew/new"
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          + Add Crew Member
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {crewMembers.length === 0 ? (
        <div className="text-center py-12 bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)]">
          <p className="text-[var(--theme-text-muted)]">No crew members yet.</p>
          <Link href="/admin/crew/new" className="text-orange-400 hover:text-orange-300 mt-2 inline-block">
            Add your first crew member
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {crewMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-4 bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)]"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[var(--theme-bg)]">
                {member.imageUrl ? (
                  <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-orange-400">{member.role}</p>
                <p className="text-xs text-[var(--theme-text-muted)]">
                  {member.yearsExperience ? `${member.yearsExperience} years experience` : "Experience not set"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${member.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                  {member.isActive ? "Active" : "Inactive"}
                </span>
                <Link href={`/admin/crew/${member.id}`} className="px-3 py-1.5 text-sm bg-[var(--theme-bg)] rounded-lg hover:bg-[var(--theme-border)] transition-colors">
                  Edit
                </Link>
                <button onClick={() => deleteCrew(member.id)} className="px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


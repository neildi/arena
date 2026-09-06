"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Select } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import { Building2, MapPin, Users, UserCog, Plus, Trash2 } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  learner: "Learner",
  store_manager: "Store Manager",
  trainer: "Trainer / L&D Lead",
  district_leader: "District Leader",
  admin: "Administrator",
};

const TABS = [
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "teams", label: "Teams", icon: Users },
  { id: "users", label: "Users", icon: UserCog },
] as const;

export function OrganizationClient({ organizations, locations, teams: initialTeams, users: initialUsers, managers }: any) {
  const { showToast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("locations");
  const [teams, setTeams] = useState(initialTeams);
  const [users, setUsers] = useState(initialUsers);

  const [locModalOpen, setLocModalOpen] = useState(false);
  const [locName, setLocName] = useState("");
  const [locType, setLocType] = useState("boutique");
  const [locCity, setLocCity] = useState("");
  const [savingLoc, setSavingLoc] = useState(false);

  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamManager, setTeamManager] = useState("");
  const [savingTeam, setSavingTeam] = useState(false);

  const [localLocations, setLocalLocations] = useState(locations);

  async function createLocation() {
    if (!locName.trim()) return;
    setSavingLoc(true);
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: locName, locationType: locType, city: locCity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLocalLocations((l: any[]) => [{ ...data.location, user_count: 0 }, ...l]);
      showToast("Location created.", "success");
      setLocModalOpen(false);
      setLocName("");
      setLocCity("");
    } catch {
      showToast("Could not create location.", "error");
    } finally {
      setSavingLoc(false);
    }
  }

  async function createTeam() {
    if (!teamName.trim()) return;
    setSavingTeam(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName, managerId: teamManager || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const managerName = managers.find((m: any) => m.id === teamManager)?.name;
      setTeams((t: any[]) => [{ ...data.team, member_count: 0, manager_name: managerName }, ...t]);
      showToast("Team created.", "success");
      setTeamModalOpen(false);
      setTeamName("");
    } catch {
      showToast("Could not create team.", "error");
    } finally {
      setSavingTeam(false);
    }
  }

  async function changeRole(userId: string, role: string) {
    const prev = users;
    setUsers((u: any[]) => u.map((x) => (x.id === userId ? { ...x, role } : x)));
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error();
      showToast("Role updated.", "success");
    } catch {
      setUsers(prev);
      showToast("Could not update role.", "error");
    }
  }

  async function archiveUserRow(userId: string) {
    if (!confirm("Archive this user? They will lose access to the platform.")) return;
    const prev = users;
    setUsers((u: any[]) => u.filter((x) => x.id !== userId));
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("User archived.", "success");
    } catch {
      setUsers(prev);
      showToast("Could not archive user.", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-charcoal-900 mb-1">Organization Settings</h1>
        <p className="text-sm text-charcoal-500">Manage locations, teams, and user access.</p>
      </div>

      {organizations[0] && (
        <Card>
          <CardBody className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="font-serif text-lg text-charcoal-900">{organizations[0].name}</p>
              {organizations[0].description && <p className="text-sm text-charcoal-500">{organizations[0].description}</p>}
            </div>
          </CardBody>
        </Card>
      )}

      <div className="flex gap-1 overflow-x-auto border-b border-champagne">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id ? "border-gold text-charcoal-900" : "border-transparent text-charcoal-500 hover:text-charcoal-800"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "locations" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setLocModalOpen(true)}>
              <Plus className="h-4 w-4" /> New location
            </Button>
          </div>
          {localLocations.length === 0 ? (
            <EmptyState icon={<MapPin className="h-6 w-6" />} title="No locations yet" />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {localLocations.map((l: any) => (
                <Card key={l.id}>
                  <CardBody>
                    <h3 className="font-medium text-charcoal-900 mb-1">{l.name}</h3>
                    <Pill tone="gold" className="mb-2">
                      {l.location_type?.replace(/_/g, " ")}
                    </Pill>
                    <p className="text-xs text-charcoal-500">{l.city}{l.region ? `, ${l.region}` : ""}</p>
                    <p className="text-xs text-charcoal-400 mt-2">{l.user_count} team members</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "teams" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setTeamModalOpen(true)}>
              <Plus className="h-4 w-4" /> New team
            </Button>
          </div>
          {teams.length === 0 ? (
            <EmptyState icon={<Users className="h-6 w-6" />} title="No teams yet" />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((t: any) => (
                <Card key={t.id}>
                  <CardBody>
                    <h3 className="font-medium text-charcoal-900 mb-1">{t.name}</h3>
                    <p className="text-xs text-charcoal-500 mb-1">{t.location_name || "No location"}</p>
                    <p className="text-xs text-charcoal-500">Manager: {t.manager_name || "Unassigned"}</p>
                    <p className="text-xs text-charcoal-400 mt-2">{t.member_count} members</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "users" &&
        (users.length === 0 ? (
          <EmptyState icon={<UserCog className="h-6 w-6" />} title="No users yet" />
        ) : (
          <Card>
            <CardBody className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-charcoal-500 border-b border-champagne">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Team</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id} className="border-b border-champagne/50 last:border-0">
                      <td className="py-3 px-4 text-charcoal-900 font-medium">{u.name}</td>
                      <td className="py-3 px-4 text-charcoal-500">{u.email}</td>
                      <td className="py-3 px-4">
                        <Select
                          value={u.role}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                          className="text-xs py-1"
                        >
                          {Object.entries(ROLE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </Select>
                      </td>
                      <td className="py-3 px-4 text-charcoal-600">{u.location_name || "—"}</td>
                      <td className="py-3 px-4 text-charcoal-600">{u.team_name || "—"}</td>
                      <td className="py-3 px-4 text-right">
                        <Button size="sm" variant="ghost" onClick={() => archiveUserRow(u.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        ))}

      <Modal
        open={locModalOpen}
        onClose={() => setLocModalOpen(false)}
        title="New location"
        footer={
          <>
            <Button variant="ghost" onClick={() => setLocModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createLocation} loading={savingLoc} disabled={!locName.trim()}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="loc-name" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Name
            </label>
            <Input id="loc-name" value={locName} onChange={(e) => setLocName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="loc-type" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Type
            </label>
            <Select id="loc-type" value={locType} onChange={(e) => setLocType(e.target.value)}>
              <option value="boutique">Luxury Boutique</option>
              <option value="bridal_showroom">Bridal Showroom</option>
              <option value="travel_retail">Cruise / Travel Retail</option>
            </Select>
          </div>
          <div>
            <label htmlFor="loc-city" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              City (optional)
            </label>
            <Input id="loc-city" value={locCity} onChange={(e) => setLocCity(e.target.value)} />
          </div>
        </div>
      </Modal>

      <Modal
        open={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
        title="New team"
        footer={
          <>
            <Button variant="ghost" onClick={() => setTeamModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createTeam} loading={savingTeam} disabled={!teamName.trim()}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="team-name" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Name
            </label>
            <Input id="team-name" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="team-manager" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Manager (optional)
            </label>
            <Select id="team-manager" value={teamManager} onChange={(e) => setTeamManager(e.target.value)}>
              <option value="">Unassigned</option>
              {managers.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Application {
  id: string;
  pet_name: string;
  status: string;
  admin_notes: string;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push("/login");
        return;
      }

      setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "User");

      const { data: apps, error: appsError } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!appsError && apps) {
        setApplications(apps as any);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [router]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-[#ffeeba] text-[#856404]";
      case "Approved":
        return "bg-[#d4edda] text-[#155724]";
      case "Rejected":
        return "bg-[#f8d7da] text-[#721c24]";
      case "Archived":
        return "bg-[#e2e3e5] text-[#383d41]";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#003366] dark:text-[#82b1ff] bg-[#f4f7f6] dark:bg-[#2c2c36]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f7f6] dark:bg-[#2c2c36] text-[#333] dark:text-[#f5f5f5] font-sans pb-[50px]">
      <nav className="bg-[#003366] dark:bg-[#202028] px-[5%] py-4 flex justify-between items-center text-white sticky top-0 z-[1000] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        <Link href="/" className="text-[1.5rem] font-bold flex items-center gap-[10px] text-[#d4af37] no-underline">
          Furfinder
        </Link>
        <div className="flex gap-[20px] items-center list-none">
          <Link href="/" className="text-white no-underline font-semibold px-[15px] py-[8px] rounded transition duration-300 hover:bg-white/10">Home</Link>
          <button onClick={handleLogout} className="text-white bg-transparent border-none cursor-pointer font-semibold px-[15px] py-[8px] rounded transition duration-300 hover:bg-white/10">Logout</button>
        </div>
      </nav>

      <div className="max-w-[1000px] mx-auto my-[40px] px-[20px]">
        <div className="bg-[#ffffff] dark:bg-[#383844] p-[2rem] rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e1e4e8] dark:border-[#555566]">
          <h2 className="text-[#003366] dark:text-[#82b1ff] mb-[10px] text-2xl font-bold">
            Welcome, {userName}!
          </h2>
          <p className="mb-[25px]">Track the status of your adoption applications below.</p>
          
          <h3 className="text-[#d4af37] text-xl font-bold mb-4">My Applications</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-[20px] text-left">
              <thead>
                <tr>
                  <th className="p-[12px_15px] border-b border-[#e1e4e8] dark:border-[#555566] bg-[#f4f7f6] dark:bg-[#2c2c36] text-[#003366] dark:text-[#82b1ff] font-bold">App ID</th>
                  <th className="p-[12px_15px] border-b border-[#e1e4e8] dark:border-[#555566] bg-[#f4f7f6] dark:bg-[#2c2c36] text-[#003366] dark:text-[#82b1ff] font-bold">Pet Name</th>
                  <th className="p-[12px_15px] border-b border-[#e1e4e8] dark:border-[#555566] bg-[#f4f7f6] dark:bg-[#2c2c36] text-[#003366] dark:text-[#82b1ff] font-bold">Status</th>
                  <th className="p-[12px_15px] border-b border-[#e1e4e8] dark:border-[#555566] bg-[#f4f7f6] dark:bg-[#2c2c36] text-[#003366] dark:text-[#82b1ff] font-bold">Admin Notes</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id}>
                      <td className="p-[12px_15px] border-b border-[#e1e4e8] dark:border-[#555566]">{app.id}</td>
                      <td className="p-[12px_15px] border-b border-[#e1e4e8] dark:border-[#555566]">{app.pet_name}</td>
                      <td className="p-[12px_15px] border-b border-[#e1e4e8] dark:border-[#555566]">
                        <span className={`px-[10px] py-[5px] rounded-[20px] text-[0.85rem] font-bold ${getStatusBadgeClass(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-[12px_15px] border-b border-[#e1e4e8] dark:border-[#555566]">{app.admin_notes || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-[12px_15px] border-b border-[#e1e4e8] dark:border-[#555566] text-center text-gray-500">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

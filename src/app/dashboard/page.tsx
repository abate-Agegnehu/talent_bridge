"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Role } from "@/constants/menus";
import {
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboard } from "@/context/DashboardContext";

export default function DashboardPage() {
  const { role, isLoading } = useDashboard();

  if (isLoading) return null;
  if (!role) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* Role Based Content */}
          {role === "ADMIN" && <AdminDashboard />}
          {role === "UNIVERSITY" && <UniversityDashboard />}
          {role === "COLLEGE" && <CollegeDashboard />}
          {role === "DEPARTMENT" && <DepartmentDashboard />}
          {role === "ADVISOR" && <AdvisorDashboard />}
          {role === "COMPANY" && <CompanyDashboard />}
          {role === "STUDENT" && <StudentDashboard />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- Role Specific Widgets ---

function AdminDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Universities" value="12" icon={Building2} description="+2 this month" />
        <StatsCard title="Pending Approvals" value="5" icon={Clock} description="3 Universities, 2 Companies" />
        <StatsCard title="Active Users" value="2,350" icon={Users} description="+180 this week" />
        <StatsCard title="System Status" value="Healthy" icon={CheckCircle2} description="All services operational" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pending Registrations</CardTitle>
            <CardDescription>
              Recent registration requests from universities and companies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Addis Ababa University", type: "University", date: "2 hours ago", status: "Pending" },
                { name: "Tech Corp Solutions", type: "Company", date: "5 hours ago", status: "Pending" },
                { name: "Rift Valley University", type: "University", date: "1 day ago", status: "Pending" },
                { name: "Innovate Bank", type: "Company", date: "2 days ago", status: "Pending" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 border rounded-lg hover:bg-slate-50">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {item.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.type} • {item.date}</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Reject</Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                   </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>
              Recent actions across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <ActivityItem title="New University Approved" time="10 mins ago" />
                <ActivityItem title="System Maintenance Scheduled" time="2 hours ago" />
                <ActivityItem title="New Company Registered" time="5 hours ago" />
                <ActivityItem title="Backup Completed" time="1 day ago" />
             </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function UniversityDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Colleges" value="8" icon={Building2} description="Across 3 campuses" />
        <StatsCard title="Total Students" value="12,450" icon={Users} description="Enrolled this semester" />
        <StatsCard title="Active Internships" value="845" icon={Briefcase} description="Currently placed" />
        <StatsCard title="Partner Companies" value="120" icon={CheckCircle2} description="Active MOUs" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>College Performance</CardTitle>
            <CardDescription>Internship placement rates by college.</CardDescription>
          </CardHeader>
           <CardContent>
             <div className="space-y-4">
                <div className="space-y-2">
                   <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">College of Engineering</span>
                      <span className="text-slate-500">85% Placed</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[85%]"></div>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">College of Business</span>
                      <span className="text-slate-500">72% Placed</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[72%]"></div>
                   </div>
                </div>
                 <div className="space-y-2">
                   <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">College of Science</span>
                      <span className="text-slate-500">64% Placed</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[64%]"></div>
                   </div>
                </div>
             </div>
           </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
             <CardDescription>Latest generated reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-slate-400" />
                        <div>
                            <p className="font-medium text-sm">Annual Internship Report</p>
                            <p className="text-xs text-slate-500">PDF • 2.4 MB</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm">Download</Button>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-slate-400" />
                        <div>
                            <p className="font-medium text-sm">Placement Statistics</p>
                            <p className="text-xs text-slate-500">CSV • 120 KB</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm">Download</Button>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function CollegeDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Departments" value="5" icon={Building2} description="Computer Science, IT, SE..." />
        <StatsCard title="Total Students" value="1,200" icon={Users} description="In this college" />
        <StatsCard title="Advisors Pending" value="3" icon={Clock} description="Awaiting approval" />
        <StatsCard title="Internship Rate" value="78%" icon={TrendingUp} description="+5% from last year" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
         <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Advisor Approval Requests</CardTitle>
                <CardDescription>Review and approve new advisor accounts.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4">
                  {[
                    { name: "Dr. Alemu Tadesse", dept: "Computer Science", date: "Today" },
                    { name: "Ms. Sara Kebede", dept: "Information Systems", date: "Yesterday" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                       <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.dept} • Applied {item.date}</p>
                       </div>
                       <Button size="sm">Approve</Button>
                    </div>
                  ))}
                 </div>
            </CardContent>
         </Card>
      </div>
    </>
  );
}

function DepartmentDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Active Internships" value="145" icon={Briefcase} description="Students currently placed" />
        <StatsCard title="Unplaced Students" value="24" icon={AlertCircle} description="Need attention" />
        <StatsCard title="Pending Reports" value="12" icon={FileText} description="Final evaluations" />
        <StatsCard title="Total Staff" value="18" icon={Users} description="Advisors & Faculty" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
         <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Internship Progress</CardTitle>
                <CardDescription>Student status overview.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="text-2xl font-bold text-green-700">145</div>
                        <div className="text-xs text-green-600 font-medium">Placed</div>
                    </div>
                     <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <div className="text-2xl font-bold text-yellow-700">45</div>
                        <div className="text-xs text-yellow-600 font-medium">Applying</div>
                    </div>
                     <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <div className="text-2xl font-bold text-red-700">24</div>
                        <div className="text-xs text-red-600 font-medium">Not Started</div>
                    </div>
                </div>
            </CardContent>
         </Card>
         <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Advisor Assignments</CardTitle>
                <CardDescription>Assign advisors to students.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                     <div className="flex items-center justify-between text-sm">
                        <span>Students without advisor</span>
                        <Badge variant="destructive">15</Badge>
                     </div>
                     <Button className="w-full" variant="outline">Manage Assignments</Button>
                </div>
            </CardContent>
         </Card>
      </div>
    </>
  );
}

function AdvisorDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Assigned Students" value="24" icon={Users} description="Active mentorships" />
        <StatsCard title="Pending Reports" value="8" icon={Clock} description="Weekly reports to review" />
        <StatsCard title="Unread Messages" value="3" icon={MessageSquare} description="From students" />
        <StatsCard title="Avg. Progress" value="85%" icon={TrendingUp} description="On track" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
         <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Weekly Report Review</CardTitle>
                <CardDescription>Pending reports from your students.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                     {[
                        { student: "Abebe Bikila", week: "Week 4", status: "Pending" },
                        { student: "Tirunesh Dibaba", week: "Week 4", status: "Pending" },
                        { student: "Haile Gebrselassie", week: "Week 3", status: "Late" },
                     ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{item.student[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm text-foreground">{item.student}</p>
                                    <p className="text-xs text-muted-foreground">{item.week}</p>
                                </div>
                            </div>
                            <Button size="sm" variant="secondary">Review</Button>
                        </div>
                     ))}
                </div>
            </CardContent>
         </Card>
         <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Student Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm border-b pb-2">
                        <span>Abebe B.</span>
                        <Badge className="bg-green-600">On Track</Badge>
                    </div>
                     <div className="flex items-center justify-between text-sm border-b pb-2">
                        <span>Tirunesh D.</span>
                        <Badge className="bg-green-600">On Track</Badge>
                    </div>
                     <div className="flex items-center justify-between text-sm pb-2">
                        <span>Haile G.</span>
                        <Badge variant="destructive" className="bg-red-600">At Risk</Badge>
                    </div>
                </div>
            </CardContent>
         </Card>
      </div>
    </>
  );
}

function CompanyDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Active Interns" value="12" icon={Users} description="Currently working" />
        <StatsCard title="Open Positions" value="5" icon={Briefcase} description="Across 3 departments" />
        <StatsCard title="Applications" value="45" icon={FileText} description="Received this week" />
        <StatsCard title="Pending Evals" value="2" icon={Clock} description="Monthly evaluations" />
      </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
         <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Candidates for your open internships.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4">
                    {[
                        { name: "Student A", role: "Frontend Dev", gpa: "3.8" },
                        { name: "Student B", role: "Backend Dev", gpa: "3.5" },
                        { name: "Student C", role: "Frontend Dev", gpa: "3.9" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
                            <div>
                                <p className="font-medium text-foreground">{item.name}</p>
                                <p className="text-xs text-muted-foreground">Applied for {item.role}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">GPA {item.gpa}</Badge>
                                <Button size="sm" variant="outline">View</Button>
                            </div>
                        </div>
                    ))}
                 </div>
            </CardContent>
         </Card>
      </div>
    </>
  );
}

function StudentDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Internship Status" value="Active" icon={Briefcase} description="At Tech Corp" />
        <StatsCard title="Completed Weeks" value="4 / 12" icon={Clock} description="33% complete" />
        <StatsCard title="Pending Tasks" value="1" icon={AlertCircle} description="Weekly Report due" />
        <StatsCard title="Advisor Feedback" value="Good" icon={MessageSquare} description="Last reviewed yesterday" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
         <Card className="col-span-5">
            <CardHeader>
                <CardTitle>Current Tasks</CardTitle>
                <CardDescription>Your to-do list for a successful internship.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="bg-destructive/20 p-2 rounded-full text-destructive">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground">Submit Week 4 Report</h4>
                                <p className="text-sm text-muted-foreground">Due: Today, 11:59 PM</p>
                            </div>
                        </div>
                        <Button size="sm" variant="destructive">Submit Now</Button>
                    </div>
                     <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg opacity-60">
                        <div className="flex items-center gap-4">
                             <div className="bg-muted p-2 rounded-full text-muted-foreground">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground line-through">Week 3 Report</h4>
                                <p className="text-sm text-muted-foreground">Submitted on Monday</p>
                            </div>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                    </div>
                </div>
            </CardContent>
         </Card>
         <Card className="col-span-2">
             <CardHeader>
                 <CardTitle>Advisor</CardTitle>
             </CardHeader>
             <CardContent className="flex flex-col items-center text-center space-y-4">
                 <Avatar className="h-20 w-20">
                     <AvatarFallback className="text-xl bg-muted">DA</AvatarFallback>
                 </Avatar>
                 <div>
                     <p className="font-medium text-lg text-foreground">Dr. Alemu</p>
                     <p className="text-sm text-muted-foreground">Computer Science Dept</p>
                 </div>
                 <Button className="w-full" variant="outline">
                     <MessageSquare className="mr-2 h-4 w-4" />
                     Chat
                 </Button>
             </CardContent>
         </Card>
      </div>
    </>
  );
}

// --- Shared Components ---

function StatsCard({ title, value, icon: Icon, description }: { title: string, value: string, icon: any, description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ title, time }: { title: string, time: string }) {
    return (
        <div className="flex items-start gap-2 border-l-2 border-border pl-3 py-1">
            <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{title}</span>
                <span className="text-xs text-muted-foreground">{time}</span>
            </div>
        </div>
    )
}

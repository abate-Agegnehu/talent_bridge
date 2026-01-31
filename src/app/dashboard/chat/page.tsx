"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import { io, Socket } from "socket.io-client";

type Advisor = {
  id: number;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  departmentId: number;
};

type Message = {
  id: string;
  senderId: number;
  receiverId: number;
  text?: string | null;
  messageType?: "TEXT" | "FILE";
  fileUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  fileSize?: number | null;
  createdAt: string;
  readBy?: number[]; // userIds who have read
};

type Peer = {
  id: number;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export default function ChatPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [activeAdvisor, setActiveAdvisor] = useState<Advisor | null>(null);
  const [companies, setCompanies] = useState<Peer[]>([]);
  const [students, setStudents] = useState<Peer[]>([]);
  const [activePeer, setActivePeer] = useState<Peer | null>(null);
  const [tab, setTab] = useState<"students" | "companies">("students");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const socket: Socket | null = useMemo(() => {
    if (typeof window === "undefined") return null;
    return io(window.location.origin, { transports: ["websocket"] });
  }, []);

  const getAdvisorUserId = (a: Advisor | null): number | null => {
    if (!a) return null;
    const id: unknown = a.user?.id ?? a.userId;
    const num = typeof id === "number" ? id : Number(id);
    return Number.isFinite(num) && num > 0 ? num : null;
  };

  const getPeerUserId = (p: Peer | null): number | null => {
    if (!p) return null;
    const id: unknown = p.user?.id ?? p.userId;
    const num = typeof id === "number" ? id : Number(id);
    return Number.isFinite(num) && num > 0 ? num : null;
  };

  useEffect(() => {
    const sid = session?.student?.id;
    if (!sid) return;
    const fetchAdvisors = async () => {
      try {
        const res = await fetch(`/api/students/${sid}/advisors`);
        if (!res.ok) throw new Error("Failed to fetch advisors");
        const raw: any[] = await res.json();
        const mapped: Advisor[] = raw.map((item) => {
          const adv = item?.advisor ?? item;
          const uidUnknown = adv?.user?.id ?? adv?.userId;
          const uid = typeof uidUnknown === "number" ? uidUnknown : Number(uidUnknown);
          return {
            id: adv?.id ?? item?.advisorId ?? 0,
            userId: Number.isFinite(uid) && uid > 0 ? uid : 0,
            user: {
              id: Number.isFinite(uid) && uid > 0 ? uid : 0,
              name: adv?.user?.name ?? `Advisor ${adv?.id ?? item?.advisorId ?? ""}`,
              email: adv?.user?.email ?? "",
            },
            departmentId: adv?.departmentId ?? 0,
          };
        });
        setAdvisors(mapped);
        if (mapped.length > 0) setActiveAdvisor(mapped[0]);
      } catch {
        toast({
          title: "Failed to load advisors",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    };
    fetchAdvisors();
  }, [session, toast]);

  useEffect(() => {
    const aid = session?.advisor?.id;
    if (!aid) return;
    const fetchAdvisorContacts = async () => {
      try {
        const [companiesRes, studentsRes] = await Promise.all([
          fetch("/api/companies"),
          fetch(`/api/advisors/${aid}/students`),
        ]);
        if (!companiesRes.ok) throw new Error("Failed to fetch companies");
        if (!studentsRes.ok) throw new Error("Failed to fetch students");
        const rawCompanies: any[] = await companiesRes.json();
        const mappedCompanies: Peer[] = rawCompanies.map((c) => {
          const uidUnknown = c?.user?.id;
          const uid = typeof uidUnknown === "number" ? uidUnknown : Number(uidUnknown);
          return {
            id: c?.id ?? 0,
            userId: Number.isFinite(uid) && uid > 0 ? uid : 0,
            user: {
              id: Number.isFinite(uid) && uid > 0 ? uid : 0,
              name: c?.user?.name ?? `Company ${c?.id ?? ""}`,
              email: c?.user?.email ?? "",
            },
          };
        });
        const rawStudents: any[] = await studentsRes.json();
        const mappedStudents: Peer[] = rawStudents.map((item) => {
          const st = item?.student ?? item;
          const uidUnknown = st?.user?.id;
          const uid = typeof uidUnknown === "number" ? uidUnknown : Number(uidUnknown);
          return {
            id: st?.id ?? item?.studentId ?? 0,
            userId: Number.isFinite(uid) && uid > 0 ? uid : 0,
            user: {
              id: Number.isFinite(uid) && uid > 0 ? uid : 0,
              name: st?.user?.name ?? `Student ${st?.id ?? item?.studentId ?? ""}`,
              email: st?.user?.email ?? "",
            },
          };
        });
        setCompanies(mappedCompanies);
        setStudents(mappedStudents);
        if (!activePeer) {
          if (tab === "students" && mappedStudents.length > 0) {
            setActivePeer(mappedStudents[0]);
          } else if (mappedCompanies.length > 0) {
            setActivePeer(mappedCompanies[0]);
          }
        }
      } catch {
        toast({
          title: "Failed to load contacts",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    };
    fetchAdvisorContacts();
  }, [session, tab, activePeer, toast]);

  useEffect(() => {
    if (!session?.user?.id || !socket) return;
    const uid = Number(session.user.id);
    socket.emit("join", { userId: uid });
    const onNewMessage = (msg: Message) => {
      const aid = getAdvisorUserId(activeAdvisor) ?? getPeerUserId(activePeer);
      if (
        aid &&
        ((msg.senderId === uid && msg.receiverId === aid) ||
          (msg.senderId === aid && msg.receiverId === uid))
      ) {
        setMessages((prev) => [...prev, msg]);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };
    socket.on("message:new", onNewMessage);
    return () => {
      socket.off("message:new", onNewMessage);
    };
  }, [socket, session, activeAdvisor, activePeer]);

  useEffect(() => {
    const loadConversation = async () => {
      const aid = getAdvisorUserId(activeAdvisor) ?? getPeerUserId(activePeer);
      if (!aid || !session?.user?.id) return;
      setLoadingMessages(true);
      try {
        const res = await fetch(
          `/api/messages/conversation?senderId=${session.user.id}&receiverId=${aid}`
        );
        if (!res.ok) throw new Error("Failed to load conversation");
        const data: Message[] = await res.json();
        setMessages(data);
        // mark all messages addressed to current user as read
        for (const m of data) {
          if (m.receiverId === Number(session.user.id)) {
            fetch(`/api/messages/${m.id}/read?userId=${session.user.id}`).catch(() => {});
          }
        }
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch {
        toast({
          title: "Failed to load conversation",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoadingMessages(false);
      }
    };
    loadConversation();
  }, [activeAdvisor, activePeer, session, toast]);

  const handleSend = async () => {
    const rid = getAdvisorUserId(activeAdvisor) ?? getPeerUserId(activePeer);
    if (!rid || !session?.user?.id) {
      toast({
        title: "Send failed",
        description: "Receiver ID is invalid",
        variant: "destructive",
      });
      return;
    }
    if (!text && !file) return;
    setSending(true);
    try {
      let fileMeta:
        | {
            fileUrl: string;
            fileName: string;
            fileType: string;
            fileSize: number;
          }
        | null = null;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch("/api/messages/upload", {
          method: "POST",
          body: fd,
        });
        if (!up.ok) {
          throw new Error("File upload failed");
        }
        const uploaded = await up.json();
        fileMeta = {
          fileUrl: uploaded.fileUrl,
          fileName: uploaded.fileName,
          fileType: uploaded.fileType,
          fileSize: uploaded.fileSize,
        };
      }

      const body: any = {
        senderId: Number(session.user.id),
        receiverId: rid,
      };
      if (text) body.text = text;
      if (fileMeta) {
        body.messageType = text ? undefined : "FILE";
        Object.assign(body, fileMeta);
      }

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        let message = "Failed to send message";
        try {
          const err = await res.json();
          message = err?.message ?? message;
        } catch {
          const t = await res.text().catch(() => "");
          if (t) message = t;
        }
        throw new Error(message);
      }
      const msg: Message = await res.json();
      setMessages((prev) => [...prev, msg]);
      setText("");
      setFile(null);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      socket?.emit("message:send", msg);
    } catch (error) {
      toast({
        title: "Send failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (!session) return <div>Loading session...</div>;
  if (!session.student && !session.advisor)
    return <div>Access Denied. You must be a student or advisor to view this page.</div>;

  if (session.student) {
    return (
    <div className="h-[calc(100vh-140px)] grid grid-cols-12 gap-4">
      <Card className="col-span-4 overflow-hidden">
        <CardHeader>
          <CardTitle>Assigned Advisor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {advisors.length === 0 ? (
            <div className="text-sm text-muted-foreground">No advisor assigned</div>
          ) : (
            advisors.map((a) => (
              <button
                key={a.id}
                onClick={() => setActiveAdvisor(a)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border ${
                  activeAdvisor?.id === a.id ? "bg-muted" : "bg-card"
                }`}
              >
                <Avatar>
                  <AvatarFallback>
                    {(a.user?.name ?? `Advisor ${a.id}`).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="font-medium">{a.user?.name ?? `Advisor ${a.id}`}</div>
                  <div className="text-xs text-muted-foreground">{a.user?.email ?? ""}</div>
                </div>
                {activeAdvisor?.id === a.id && <Badge>Active</Badge>}
              </button>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="col-span-8 flex flex-col">
        <CardHeader>
          <CardTitle>
            {activeAdvisor
              ? `Chat with ${activeAdvisor.user?.name ?? `Advisor ${activeAdvisor.id}`}`
              : "Select an advisor"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-3">
          {loadingMessages ? (
            <div>Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-sm text-muted-foreground">No messages yet</div>
          ) : (
            messages.map((m) => {
              const isMine = m.senderId === Number(session.user.id);
              return (
                <div
                  key={m.id}
                  className={`max-w-[75%] p-3 rounded-lg border ${
                    isMine ? "ml-auto bg-primary/10 border-primary/20" : "bg-muted border-muted-foreground/20"
                  }`}
                >
                  {m.text && <div className="mb-2">{m.text}</div>}
                  {m.fileUrl && (
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm underline"
                    >
                      {m.fileName ?? "Attachment"}
                    </a>
                  )}
                  <div className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(m.createdAt), "MMM d, yyyy h:mm a")}
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </CardContent>

        <div className="p-4 border-t flex items-center gap-2">
          <Input
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:bg-background file:text-sm"
          />
          <Button onClick={handleSend} disabled={sending || (!text && !file) || !activeAdvisor}>
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
      </Card>
    </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] grid grid-cols-12 gap-4">
      <Card className="col-span-4 overflow-hidden">
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
          <Tabs value={tab} onValueChange={(v) => setTab(v as "students" | "companies")}>
            <TabsList>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="companies">Companies</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-2">
          {tab === "students"
            ? (students.length === 0 ? (
                <div className="text-sm text-muted-foreground">No assigned students</div>
              ) : (
                students.map((p) => (
                  <button
                    key={`${p.id}-${p.user.id}`}
                    onClick={() => setActivePeer(p)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border ${
                      activePeer?.user.id === p.user.id ? "bg-muted" : "bg-card"
                    }`}
                  >
                    <Avatar>
                      <AvatarFallback>
                        {(p.user?.name ?? `Student ${p.id}`).slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{p.user?.name ?? `Student ${p.id}`}</div>
                      <div className="text-xs text-muted-foreground">{p.user?.email ?? ""}</div>
                    </div>
                    {activePeer?.user.id === p.user.id && <Badge>Active</Badge>}
                  </button>
                ))
              ))
            : (companies.length === 0 ? (
                <div className="text-sm text-muted-foreground">No companies</div>
              ) : (
                companies.map((p) => (
                  <button
                    key={`${p.id}-${p.user.id}`}
                    onClick={() => setActivePeer(p)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border ${
                      activePeer?.user.id === p.user.id ? "bg-muted" : "bg-card"
                    }`}
                  >
                    <Avatar>
                      <AvatarFallback>
                        {(p.user?.name ?? `Company ${p.id}`).slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{p.user?.name ?? `Company ${p.id}`}</div>
                      <div className="text-xs text-muted-foreground">{p.user?.email ?? ""}</div>
                    </div>
                    {activePeer?.user.id === p.user.id && <Badge>Active</Badge>}
                  </button>
                ))
              ))}
        </CardContent>
      </Card>

      <Card className="col-span-8 flex flex-col">
        <CardHeader>
          <CardTitle>
            {activePeer ? `Chat with ${activePeer.user?.name ?? `User ${activePeer.id}`}` : "Select a contact"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-3">
          {loadingMessages ? (
            <div>Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-sm text-muted-foreground">No messages yet</div>
          ) : (
            messages.map((m) => {
              const isMine = m.senderId === Number(session.user.id);
              return (
                <div
                  key={m.id}
                  className={`max-w-[75%] p-3 rounded-lg border ${
                    isMine ? "ml-auto bg-primary/10 border-primary/20" : "bg-muted border-muted-foreground/20"
                  }`}
                >
                  {m.text && <div className="mb-2">{m.text}</div>}
                  {m.fileUrl && (
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm underline"
                    >
                      {m.fileName ?? "Attachment"}
                    </a>
                  )}
                  <div className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(m.createdAt), "MMM d, yyyy h:mm a")}
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </CardContent>

        <div className="p-4 border-t flex items-center gap-2">
          <Input
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:bg-background file:text-sm"
          />
          <Button onClick={handleSend} disabled={sending || (!text && !file) || !activePeer}>
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

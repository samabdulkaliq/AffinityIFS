"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip,
  CheckCheck,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const MOCK_CONTACTS: Contact[] = [
  { 
    id: 'cleaner-1', 
    name: 'Cleaner 1', 
    role: 'On Duty @ Metro Hub', 
    avatarUrl: 'https://picsum.photos/seed/cleaner1/100/100',
    lastMessage: 'Geofence verified, starting shift now.',
    time: '12:38 PM',
    unread: 0,
    online: true
  },
  { 
    id: 'cleaner-2', 
    name: 'Cleaner 2', 
    role: 'Off Duty', 
    avatarUrl: 'https://picsum.photos/seed/cleaner2/100/100',
    lastMessage: 'Thanks for the late arrival approval!',
    time: '11:20 AM',
    unread: 1,
    online: false
  },
  { 
    id: 'admin-2', 
    name: 'Admin User 2', 
    role: 'Shift Manager', 
    avatarUrl: 'https://picsum.photos/seed/admin2/100/100',
    lastMessage: 'Can you check the floor scrubber status?',
    time: 'Yesterday',
    unread: 0,
    online: true
  }
];

const MOCK_MESSAGES: Message[] = [
  { id: '1', text: 'Hi, I arrived at Metro Hub but the south gate is locked.', senderId: 'cleaner-1', timestamp: '12:30 PM', status: 'READ' },
  { id: '2', text: 'I checked the logs, security should be there in 2 mins.', senderId: 'admin-1', timestamp: '12:32 PM', status: 'READ' },
  { id: '3', text: 'Okay, they just opened it. Thanks!', senderId: 'cleaner-1', timestamp: '12:34 PM', status: 'READ' },
  { id: '4', text: 'Geofence verified, starting shift now.', senderId: 'cleaner-1', timestamp: '12:38 PM', status: 'DELIVERED' },
];

export default function AdminChatPage() {
  const [activeTab, setActiveTab] = useState<'CONTACTS' | 'CHAT'>('CONTACTS');
  const [selectedContact, setSelectedContact] = useState<Contact>(MOCK_CONTACTS[0]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Area */}
      <div className="px-1 flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Messages</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Field Communication</p>
        </div>
        <div className="flex -space-x-2">
          {MOCK_CONTACTS.filter(c => c.online).map(c => (
            <div key={c.id} className="relative">
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src={c.avatarUrl} />
              </Avatar>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Contact List (Desktop Sidebar / Mobile Toggle) */}
        <div className={cn(
          "flex-col gap-4 w-full md:w-80 transition-all",
          activeTab === 'CHAT' ? "hidden md:flex" : "flex"
        )}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search contacts..." 
              className="h-12 pl-12 rounded-2xl border-none shadow-sm bg-white font-medium"
            />
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-hide">
            {MOCK_CONTACTS.map((contact) => (
              <button 
                key={contact.id}
                onClick={() => {
                  setSelectedContact(contact);
                  setActiveTab('CHAT');
                }}
                className={cn(
                  "w-full p-4 rounded-2xl transition-all flex items-center gap-4 text-left border-2",
                  selectedContact.id === contact.id 
                    ? "bg-white border-blue-500 shadow-lg shadow-blue-50" 
                    : "bg-white/50 border-transparent hover:bg-white"
                )}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={contact.avatarUrl} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 truncate">{contact.name}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase whitespace-nowrap ml-2">{contact.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <Badge className="bg-blue-600 font-black px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                    {contact.unread}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={cn(
          "flex-1 flex-col bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden",
          activeTab === 'CONTACTS' ? "hidden md:flex" : "flex"
        )}>
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setActiveTab('CONTACTS')}>
                <Search className="w-5 h-5 rotate-180" />
              </Button>
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedContact.avatarUrl} />
                </Avatar>
                {selectedContact.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 leading-none">{selectedContact.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{selectedContact.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 rounded-xl">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 rounded-xl">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 rounded-xl">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-95">
            {MOCK_MESSAGES.map((msg) => {
              const isMe = msg.senderId === 'admin-1';
              return (
                <div key={msg.id} className={cn(
                  "flex flex-col max-w-[80%] space-y-1",
                  isMe ? "ml-auto items-end" : "items-start"
                )}>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm font-medium shadow-sm",
                    isMe 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-slate-100 text-slate-800 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase">{msg.timestamp}</span>
                    {isMe && (
                      <CheckCheck className={cn(
                        "w-3 h-3",
                        msg.status === 'READ' ? "text-blue-500" : "text-slate-300"
                      )} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-slate-400 shrink-0">
                <Paperclip className="w-5 h-5" />
              </Button>
              <div className="flex-1 relative">
                <Input 
                  placeholder="Type message..." 
                  className="h-12 pr-12 rounded-2xl border-none shadow-inner bg-white font-medium"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && newMessage.trim() && (setNewMessage(""))}
                />
                <Button 
                  size="icon" 
                  className="absolute right-1 top-1 w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                  onClick={() => newMessage.trim() && (setNewMessage(""))}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

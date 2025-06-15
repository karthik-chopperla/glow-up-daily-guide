
import { Home, MessageCircle, Layers, FileText, User } from "lucide-react";

const nav = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "chatbot", label: "Chatbot", icon: MessageCircle },
  { id: "services", label: "Services", icon: Layers },
  { id: "records", label: "Records", icon: FileText },
  { id: "profile", label: "Profile", icon: User },
];

interface BottomTabNavProps {
  current: string;
  onChange: (id: string) => void;
}

const BottomTabNav = ({ current, onChange }: BottomTabNavProps) => (
  <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-md py-2">
    <div className="flex justify-around max-w-md mx-auto">
      {nav.map(n => {
        const Icon = n.icon;
        const isActive = current === n.id;
        return (
          <button
            key={n.id}
            className={`flex flex-col items-center px-2 ${isActive ? "text-blue-700 font-bold" : "text-gray-500"} focus:outline-none`}
            onClick={() => onChange(n.id)}
          >
            <Icon size={22} />
            <span className="text-xs">{n.label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

export default BottomTabNav;

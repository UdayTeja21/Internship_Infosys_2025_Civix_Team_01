export interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export interface DashboardProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
}